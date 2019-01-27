const { Listener } = require('discord-akairo')

class Listener extends Listener {
	constructor() {
		super('', {
			emitter: 'client',
			eventName: ''
		})
	}

	exec() {

	}
}

module.exports = Listener
