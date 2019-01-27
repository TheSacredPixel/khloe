const { Command } = require('discord-akairo'),
	{ exec } = require('child_process')

class RestartCommand extends Command {
	constructor() {
		super('restart', {
			aliases: ['restart'],
			category: 'owner',
			ownerOnly: true,
			quoted: false
		})
	}

	exec(msg) {
		this.client.provider.setOnResume(msg.channel.id, 'restart')
		setTimeout(() => {
			exec('pm2 restart khloe')
		}, 2000)
		return msg.util.send('Restarting process in 2s...')
	}
}

module.exports = RestartCommand
