const { Command } = require('discord-akairo'),
	request = require('request-promise-native')

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
			let item = found ? found : res.results[0]

			let listings

			if(server) {//use given server
				res = await request({
					uri: `https://universalis.app/api/${server}/${item.id}`,
					json: true
				})
				if(!res.listings.length) {
					msg.util.send(`Couldn't find any listings for ${this.client.utils.firstCapital(item.name)} in ${server}...`)
					return msg.channel.stopTyping()
				}

			} else {//use config datacenter
				let dc = this.client.config.xiv.datacenter
				res = await request({
					uri: `https://universalis.app/api/${dc}/${item.id}`,
					json: true
				})

				if(!res.listings.length) {
					msg.util.send(`Couldn't find any listings for ${this.client.utils.firstCapital(item.name)} in ${dc}...`)
					return msg.channel.stopTyping()
				}
			}

			listings = res.listings.slice(0, 10)
			const embed = this.client.utils.toEmbed.priceList(listings, item, server)
			msg.util.send('',{embed: embed})
			return msg.channel.stopTyping()
		} catch(err) {
			this.client.utils.throwError(err,msg)
			return msg.channel.stopTyping()
		}
	}
}

module.exports = PriceCommand
