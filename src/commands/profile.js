const { Command } = require('discord-akairo')
//{ Attachment } = require('discord.js'),
//genProfile = require('../genProfile')

class ProfileCommand extends Command {
	constructor() {
		super('profile', {
			aliases: ['profile', 'character', 'char'],
			description: ''
		})
	}

	async exec(msg) {
		let get = this.client.provider.get(msg.author.id, 'identity', null)

		if(!get)// TODO: add @ping resolution, as well as char name search
			return msg.util.reply('I don\'t know who you are :( Use `>iam (character name) (server)` so that I learn!')

		//return msg.util.send(`You're ${get.name} of ${get.server}!`)
		try {
			msg.channel.startTyping()
			const res = await this.client.xiv.character.get(get.id, { extended: true, data: 'FC' })

			if(!res.status.ok) {
				msg.util.send('Error: Status was NOT ok')//PH
				return msg.channel.stopTyping()
			}

			/*let buffer = await genProfile(res, res.character.portrait)
			msg.util.send('', new Attachment(buffer, 'test.png'))*/
			msg.util.send(res.character.portrait)
			return msg.channel.stopTyping()
		} catch(err) {
			console.error(err)
			msg.util.send('Something went wrong :(')
			return msg.channel.stopTyping()
		}
	}
}

module.exports = ProfileCommand
