const { Command } = require('discord-akairo')

class IAmCommand extends Command {
	constructor() {
		super('iam', {
			aliases: ['iam'],
			description: '',
			args: [
				{
					id: 'input',
					match: 'content',
					prompt: {
						start: 'please give me your character\'s name and server (or say \'cancel\').'
					}
				}
			]
		})
	}

	async exec(msg, { input }) {
		let { server, text } = this.client.utils.getServer(input, this.client.xiv.resources.servers)
		if(!server)
			return msg.util.reply('you need to give me a valid server to look in!')

		let chars = await this.client.xiv.character.search(text, {server: server})

		if(!chars.results.length)
			return msg.util.send(`Couldn't find ${this.client.utils.firstCapital(text)} in ${server} :(`)


		//try to find perfect match
		let found = chars.results.find(result => result.name.toLowerCase() === text.toLowerCase())
		if(!found)
			return msg.util.send(`Couldn't find ${this.client.utils.firstCapital(text)} in ${server} :(`)

		console.log(`setting ${msg.author.id} identity as ${found.id}`)
		await this.client.provider.set(msg.author.id, 'identity', found.id)
		//found.avatar
		return msg.util.send(`Done! From now on I'll know that you're ${found.name} of ${found.server}!`)
	}
}

module.exports = IAmCommand
