const { Command } = require('discord-akairo')

class NodesCommand extends Command {
	constructor() {
		super('nodes', {
			aliases: ['nodes'],
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

module.exports = NodesCommand
