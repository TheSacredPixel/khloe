const { Command } = require('discord-akairo')

class PriceCommand extends Command {
	constructor() {
		super('price', {
			aliases: ['price', 'mb'],
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

			let prices, item, servers

			if(server) {//use given server
				res = await this.client.xiv.market.get(id, {servers: server, max_history: 1})
				if(!res.prices.length) {
					msg.util.send(`Couldn't find any listings for ${this.client.utils.firstCapital(name)} in ${server}...`)
					return msg.channel.stopTyping()
				}

				prices = res.prices.slice(0, 10)
				item = res.item
				servers = server
			} else {//use config datacenter
				let dc = this.client.config.xiv.datacenter
				res = await this.client.xiv.market.get(id, {dc: dc, max_history: 1})

				let servs = Object.keys(res), hasListings = false
				for(let server of servs) {
					hasListings = res[server].prices.length ? true : hasListings
				}

				if(!hasListings) {
					msg.util.send(`Couldn't find any listings for ${this.client.utils.firstCapital(name)} in ${dc}...`)
					return msg.channel.stopTyping()
				}

				let result = makePriceList(res)
				prices = result.prices
				item = res[servs[0]].item
				servers = result.servers
			}

			const embed = this.client.utils.toEmbed.priceList(prices, item, servers)
			msg.util.send('',{embed: embed})
			return msg.channel.stopTyping()
		} catch(err) {
			this.client.utils.throwError(err,msg)
			return msg.channel.stopTyping()
		}
	}
}

function makePriceList(res, num = 10) {
	let merged = [], servers = [], servs = Object.keys(res)
	for (let i = 0; i < num; i++) {
		//get single lowest value
		let lowestPrice, lowestServ
		for (let serv of servs) {
			if(res[serv].prices.length && (!lowestPrice || res[serv].prices[0].price_per_unit < lowestPrice.price_per_unit)) {
				lowestPrice = res[serv].prices[0]
				lowestServ = serv
			}
		}
		if(!lowestServ)//all arrays empty
			break
		merged.push(lowestPrice)
		servers.push(lowestServ)
		res[lowestServ].prices.shift()
	}
	return {prices: merged, servers: servers}
}

module.exports = PriceCommand
