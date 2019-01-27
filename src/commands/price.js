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
		input = input.split(' ')

		let server, pos = -1
		for (let i = 0; i < input.length; i++) {
			let string = this.client.utils.firstCapital(input[i])
			if(this.client.xiv.resources.servers.includes(string)) {
				server = string
				pos = i
				break
			}
		}
		if(pos === -1)
			return msg.util.reply('you need to give me a valid server to look in, too!')

		input.splice(pos, 1)
		input = input.join(' ')
		let res = await this.client.xiv.search(input)
		if(!res.results.length)
			return msg.util.send('Item not found!')

		//try to find perfect match first
		let found = res.results.find(result => result.name.toLowerCase() === input.toLowerCase())

		res = await this.client.xiv.market.prices(found ? found.id : res.results[0].id, server)
		if(!res.prices.length)
			return msg.util.send(`Couldn't find any listings for ${input}...`)

		return msg.util.send(`I found \`${input}\` for sale for ${res.prices[0].price_per_unit} gil!`)
	}
}

module.exports = PriceCommand
