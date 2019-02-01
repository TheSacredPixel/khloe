const { Command } = require('discord-akairo')

class WhoAmICommand extends Command {
	constructor() {
		super('whoami', {
			aliases: ['whoami'],
			description: ''
		})
	}

	async exec(msg) {
		let get = this.client.provider.get(msg.author.id, 'identity', null)

		if(get)
			return msg.util.send(`You're ${get.name} of ${get.server}!`)
		else
			return msg.util.send('I don\'t know :(')
	}
}

module.exports = WhoAmICommand
