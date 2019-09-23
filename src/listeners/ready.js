const { Listener } = require('discord-akairo')

class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			eventName: 'ready',
			emitter: 'client'
		})
	}

	async exec() {
		//set activity
		//this.client.user.setActivity('>help')

		//check for onresume variables
		let check = this.client.provider.getOnResume()
		if(check) {
			let text
			switch(check.reason) {
				case 'restart':
					text = 'Restarted successfully!'
					break
				case 'pull':
					text = 'Successfully updated to commit `'
					text += require('child_process')
						.execSync('git rev-parse HEAD')
						.toString().trim()
					text += '`!'
					break
			}
			this.client.channels.get(check.id).send(text)//TODO, also map text
			this.client.provider.clearOnResume()
		}

		this.client.xiv.resources.servers = await this.client.xiv.data.servers()

		console.log('Ready!')
	}
}

module.exports = ReadyListener
