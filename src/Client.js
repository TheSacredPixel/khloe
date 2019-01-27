const { AkairoClient } = require('discord-akairo'),
	XIVAPI = require('xivapi-js'),
	//KhloeProvider = require('./KhloeProvider'),
	config = require('../resources/config.json')


class Client extends AkairoClient {
	constructor() {
		super({
			ownerID: config.ownerID,
			prefix: config.prefix,
			allowMention: true,
			commandUtil: true,
			commandUtilLifetime: 300000,
			commandDirectory: './src/commands/',
			//inhibitorDirectory: './src/inhibitors/',
			listenerDirectory: './src/listeners/',
			emitters: {
				process
			}
		}, {
			disableEveryone: false
		})

		this.xiv = new XIVAPI(config.keys.xivapi)
		this.config = config
		if(process.env.NODE_ENV !== 'production')
			this.config.default = config.default2

		//this.provider = new KhloeProvider()
	}

	async start(token) {
		//init provider
		//await this.provider.init().catch(reason => {throw new Error(reason)})
		
		//login
		return this.login(token)
	}
}

module.exports = Client
