const { Command } = require('discord-akairo')

class PriceCommand extends Command {
	constructor() {
		super('price', {
			aliases: ['price'],
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
		let { server, text } = this.client.utils.getServer(input, this.client.xiv.resources.servers)
		if(!server)
			return msg.util.reply('you need to give me a valid server to look in!')

		let res = await this.client.xiv.search(text)
		if(!res.results.length)
			return msg.util.send('Item not found :(')

		//try to find perfect match first
		let found = res.results.find(result => result.name.toLowerCase() === text.toLowerCase())

		res = await this.client.xiv.market.prices(found ? found.id : res.results[0].id, server)
		if(!res.prices.length)
			return msg.util.send(`Couldn't find any listings for ${this.client.utils.firstCapital(text)}...`)

		return msg.util.send(`I found \`${this.client.utils.firstCapital(text)}\` for sale for ${res.prices[0].price_per_unit} gil!`)
	}
}

module.exports = PriceCommand
