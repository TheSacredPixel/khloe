const { AkairoClient } = require('discord-akairo'),
	//XIVAPI = require('../../xivapi-js/XIVAPI'),
	//XIVAPI = require('xivapi-js'),
	KhloeProvider = require('./KhloeProvider'),
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

		const XIVAPI = require('xivapi-js')

		this.xiv = new XIVAPI({private_key: config.keys.xivapi, snake_case: true})
		this.config = config
		this.utils = require('./utils')

		this.provider = new KhloeProvider()
	}

	async start(token) {
		//init provider
		await this.provider.init().catch(reason => {throw new Error(reason)})

		//login
		return this.login(token)
	}
}

module.exports = Client
