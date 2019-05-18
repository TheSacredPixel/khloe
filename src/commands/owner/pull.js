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

	async exec(msg) {
		msg.util.send('Updating from repository and restarting process in 2s...')
		this.client.provider.setOnResume(msg.channel.id, 'pull')
		await sleep(2000)

		let exec = await execSync('pm2 pull khloe')
		if(exec.toString().includes('Already up-to-date')) {
			this.client.provider.clearOnResume()
			return msg.util.send('Already up-to-date.')
		} else {
			console.error(exec.toString())
			return msg.util.send('Something weird happened. Output has been logged.')
		}
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = PullCommand
