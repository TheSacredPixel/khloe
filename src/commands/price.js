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
		if(!server && !this.client.config.xiv.datacenter)
			return msg.util.send('You need to give me a valid server to look in!')

		try {
			msg.channel.startTyping()
			//search
			let res = await this.client.xiv.search(text, {indexes: 'Item'})
			if(!res.results.length) {
				msg.util.send('Item not found :(')
				return msg.channel.stopTyping()
			}

			//try to use perfect match first
			let found = res.results.find(result => result.name.toLowerCase() === text.toLowerCase())
			let {id, name} = found ? found : res.results[0]

			let foundPrice, foundServer

			if(server) {//given server
				res = await this.client.xiv.market.get(id, {servers: server, max_history: 1})
				if(!res.prices.length) {
					msg.util.send(`Couldn't find any listings for ${this.client.utils.firstCapital(name)} in ${server}...`)
					return msg.channel.stopTyping()
				}

				foundPrice = res.prices[0]
				foundServer = server
			} else {//config datacenter
				res = await this.client.xiv.market.get(id, {dc: this.client.config.xiv.datacenter, max_history: 1})

				let servers = Object.keys(res)
				for(let server of servers) {
					let price = res[server].prices[0]
					if(price && (!foundPrice || price.price_total < foundPrice.price_total)) {
						foundPrice = price
						foundServer = server
					}
				}

				if(!foundPrice) {
					msg.util.send(`Couldn't find any listings for ${this.client.utils.firstCapital(name)} in ${this.client.config.datacenter}...`)
					return msg.channel.stopTyping()
				}

			}

			msg.util.send(`I found \`${this.client.utils.firstCapital(name)}${foundPrice.quantity > 1 ? ` (x${foundPrice.quantity})` : ''}\` for sale for \`${foundPrice.price_total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}g\` in ${this.client.utils.firstCapital(foundServer)}!`)
			return msg.channel.stopTyping()
		} catch(err) {
			console.error(err)
			msg.util.send('Something went wrong :(')
			return msg.channel.stopTyping()
		}
	}
}

module.exports = PriceCommand
