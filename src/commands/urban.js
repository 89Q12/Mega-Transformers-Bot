const {MessageEmbed} = require('discord.js');
const urban = require('urban');

module.exports.run = async function(yuno, author, args, msg) {
	if (!args[0]) {
		return msg.channel.send(':negative_squared_cross_mark: Input a search term');
	}
    
	let uInput = args.join(' ');
	let url = `https://www.urbandictionary.com/define.php?term=${uInput}`;

	urban(uInput).first(search => {
		if (!search) return msg.channel.send(`No results found for ${uInput}`);
		msg.channel.send(new MessageEmbed()
			.setTitle(search.word)
			.setThumbnail('https://cdn.discordapp.com/attachments/446842126005829632/449800259468525568/urban_dictionary.png')
			.addField(':notebook_with_decorative_cover:Definition', `\`${search.definition}\``)
			.addField(':bookmark_tabs:Example', `\`${search.example}\``)
			.addField(':small_red_triangle:Upvotes', `\`${search.thumbs_up}\``, true)
			.addField(':small_red_triangle_down:Downvotes', `\`${search.thumbs_down}\``, true)
			.addField(':link:URL', `[${search.word}](${url})`)
			.setFooter(`Author - ${search.author}`)
			.setColor(0x9eddf1));
	});
};

module.exports.about = {
	'command': 'urban',
	'description': 'Search for a definition on the Urban Dictionary',
	'examples': ['urban anime'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': 'ub',
	'onlyMasterUsers': false
};