const { Command } = require('discord-akairo')

class VerifyCommand extends Command {
	constructor() {
		super('verify', {
			aliases: ['verify'],
			description: '',
			args: [
				{
					id: 'id',
					match: 'content'
				}
			]
		})
	}

	async exec(msg, { id }) {
		const result = await this.client.xiv.character.verification(id)
		return msg.reply(result)
	}
}

module.exports = VerifyCommand
