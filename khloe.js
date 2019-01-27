const Client = require('./src/Client.js'),
	config = require('./resources/config.json')


const client = new Client().build()
client.start(process.env.NODE_ENV == 'production' ? config.token : config.token2)
