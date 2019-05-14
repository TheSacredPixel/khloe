const { Listener } = require('discord-akairo')

class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			eventName: 'ready',
			emitter: 'client'
		})
	}

	exec() {
		//set activity
		this.client.user.setActivity('>help')

		console.log('Ready!')
	}
}

module.exports = ReadyListener
