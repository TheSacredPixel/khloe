const { Command } = require('discord-akairo')

class SearchCommand extends Command {
	constructor(name = 'search', options = {
		aliases: ['search'],
		description: 'Search for something.',
		args: [
			{
				id: 'input',
				match: 'content',
				prompt: {
					start: 'what would you like to search for? (or say 'cancel')'
				}
			}
		]
	}) {
		super(name, options)

		this.name = name
	}

	async exec(msg, { input }) {
		let find = await this.client.xiv.search(input, { 
			indexes: this.name === 'search' ? '' : this.client.utils.firstCapital(this.name)
		})
	}
}

module.exports = ItemCommand
