const { SearchCommand } = require('./search')

class ItemCommand extends SearchCommand {
	constructor() {
		super('item', {
			aliases: ['item'],
			description: 'Search for an item.',
			args: [
				{
					id: 'input',
					match: 'content',
					prompt: {
						start: 'which item do you want to search for? (or say \'cancel\')'
					}
				}
			]
		})
	}

//	async exec(msg, { input }) {
//		let find = await this.client.xiv.search(input, { indexes: 'Item' })
//	}
}

module.exports = ItemCommand
