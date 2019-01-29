const { Command } = require('discord-akairo')

class AACommand extends Command {
	constructor() {
		super('AA', {
			aliases: ['AA'],
			description: '',
			args: [
				{
					id: 'input',
					match: 'content'
				}
			]
		})
	}

	async exec(msg, { input }) {

	}
}

module.exports = AACommand
