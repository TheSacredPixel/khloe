const { Command } = require('discord-akairo'),
	{ execSync } = require('child_process')

class PullCommand extends Command {
	constructor() {
		super('pull', {
			aliases: ['pull'],
			category: 'owner',
			ownerOnly: true,
			quoted: false
		})
	}

	exec(msg) {
		this.client.provider.setOnResume(msg.channel.id, 'pull')
		setTimeout(() => {
			if(execSync('pm2 pull khloe').toString().includes('Already up-to-date')) {
				msg.util.send('Already up-to-date.')
				this.client.provider.clearOnResume()
			}
		}, 2000)
		return msg.util.send('Updating from repository and restarting process in 2s...')
	}
}

module.exports = PullCommand
