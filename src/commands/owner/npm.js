const { Command } = require('discord-akairo'),
	{ execSync } = require('child_process')

class NPMCommand extends Command {
	constructor() {
		super('NPM', {
			aliases: ['NPM'],
			category: 'owner',
			ownerOnly: true,
			quoted: false
		})
	}

	exec(msg) {
		this.client.provider.setOnResume(msg.channel.id, 'restart')
		setTimeout(() => {
			if(execSync('npm i')) {
				msg.util.send('Updated dependencies, restarting...')
				setTimeout(() => {
					execSync('pm2 restart khloe')
				}, 1000)
			}
		}, 2000)
		return msg.util.send('Updating dependencies...')
	}
}

module.exports = NPMCommand
