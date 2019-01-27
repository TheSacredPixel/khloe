const { Command } = require('discord-akairo')

class AACommand extends Command {
	constructor() {
		super('AA', {
			aliases: ['AA'],
			description: ''
		})
	}

	exec(msg) {

	}
}

module.exports = AACommand
