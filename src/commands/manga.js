const { ReactionCollector } = require('discord.js');
const {MessageEmbed} = require('discord.js');
const he = require('he');

module.exports.run = async function(yuno, author, args, msg) {
	let res = Yuno.animeClient.searchMangas(args.join(' '));

	if (!res[0]) {
		return msg.channel.send(`No manga result found for \`${args.join(' ')}\`. Did you perhaps mean the \`anime\` command?`);
	}

	res = await Promise.all(res.map(async item => { return {
		MessageEmbed: {
			color: 0xe983b9,
			title: 'Information',
			url: `https://myanimelist.net/manga/${item.id}`,
			fields: [
				{ name: 'Title', value: `${item.title} ${item.english ? `(English: ${item.english})` : ''}` },
				{ name: 'Type', value: item.type, inline: true },
				{ name: 'Status', value: item.status, inline: true },
				{ name: 'Start date', value: item.start_date === '0000-00-00' ? 'TBD' : item.start_date, inline: true },
				{ name: 'End date', value: item.end_date === '0000-00-00' ? 'TBD' : item_end_date, inline : true },
				{ name: 'Chapters', value: item.chapters === 0 ? 'TBD' : item.volumes, inline: true },
				{ name: 'Volumes', value: item.episodes === 0 ? 'TBD' : item.volumes, inline: true },
				{ name: 'Score', value: `${item.score}`, inline: true }
			],
			description: Yuno.Util.cleanSynopsis(he.decode(item.synopsis), item.id, 'manga'),
			thumbnail: { url: item.image },
			footer: { text: `Use the reaction to browse | Page1${res.length}`}
		}
	};}));
	let currentPage = 0;
	const pageMsg = await msg.channel.send(res[0]);
	await pageMsg.react('◀');
	await pageMsg.react('▶');
	pageMsg.React('X');

	const RC = new ReactionCollectior(pageMsg, (r) => r.user.last().id === msg.author.id);

	const switchPages = (direction) => {
		if (['◀', '▶'].includes(direction)) {
			currentPage = direction === '◀' ?
				currentPage === 0 ? res.length - 1 : currentPage - 1 :
				currentPage === res.length - 1 ? 0 : currentPage + 1;
			res[currentPage].embed.footer = { text: `Use the reactions to browse | Page ${currentPage + 1}/${res.length}` };
			pageMsg.edit(res[currentPage]);
		} else if (direction === '❌') {
			RC.stop();
			pageMsg.delete();
			msg.delete();
		}
	};

	RC.on('collect', (element) => {
		switchPages(element._emoji.name);
		element.remove(element.users.last().id);
	});

	setTimeout(() => {
		if (!Rc.ended) {
			switchPages('❌');
		}
	}, 120000);
};

module.exports.about = {
	'command': 'manga',
	'description': 'Get the information on an manga.',
	'examples': ['manga Future Diary'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': 'animoo',
	'onlyMasterUsers': true
};