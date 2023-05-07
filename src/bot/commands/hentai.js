/**
* Randomize an array (This is just a hot-fix)
* @param {Array}
* @return {String}
*/

function getRandomsFromArray(sourceArray, neededElements) {
	const result = [];
	for (let i = 0; i < neededElements; i++) {
		result.push(sourceArray[Math.floor(Math.random() * sourceArray.length)]);
	}
	return result;
}

const snekfetch = require('snekfetch');

var bannedSearch = ['loli', 'gore', 'guro', 'scat', 'small_breast', 'vore', 'underage', 'shota'];

module.exports.run = async function(BOT, author, args, msg) {
	if (!msg.channel.nsfw) {
		return msg.channel.send('I don\'t think I\'m allowed to post those here... Maybe try a NSFW marked channel?');
	}

	let url = 'https://rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=100';
	let targetPosts;
	if (parseInt(args[0])) {
		targetPosts = parseInt(args[0]);
		if (targetPosts < 1 || targetPosts > 25) {
			return msg.channel.send('You cannot request less than 1 or over 25 results');
		}
		args.shift();
	} else {
		targetPosts = 2;
	}

	if (args[0]) {
		url += `&tags=${args[0]}`;
	} else {
		url += `&pid=${Math.ceil(Math.random() * 2000)}`;
	}
	let res;
	try {
		res = JSON.parse((await snekfetch.get(url)).body.toString());
	} catch (e) {
		return msg.channel.send(`No search results found for \`${args[0]}\`. Please try a different query.`);
	}

	const cleanMsg = msg.content.toLowerCase().replace(/[^a-z]/gi, '');
	let triggered = false;
	bannedSearch.every(w => {
		if (cleanMsg.includes(w)) {
			triggered = true;
			return false;
		} else return true;
	});

	if (triggered) {
		msg.delete();
		msg.channel.send(`That is against the Discord ToS. I will not search for that ${msg.author.id}`).catch(O_o=>{});
		return;
	}

	const images = getRandomsFromArray(res.map(i => [i.image, i.directory]), targetPosts);
	while (images.length > 0) {
		await msg.channel.send(images.slice(0, 4).map(x => `https://img.rule34.xxx/images/${x[1]}/${x[0]}`));
		images.splice(0, 4);
	}
};

module.exports.about = {
	'command': 'hentai',
	'description': 'Get some anime girls',
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': 'hen',
};