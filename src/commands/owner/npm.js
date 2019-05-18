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

	async exec(msg) {
		try {
			await msg.util.send('Updating dependencies...')
			await sleep(2000)
			await execSync('npm i')
			msg.util.send('Updated dependencies, restarting...')
			await sleep(1000)
			this.client.provider.setOnResume(msg.channel.id, 'restart')
			return execSync('pm2 restart ivarabot')
		} catch(err) {
			console.error(err)
			return msg.util.send('An error has occured. Output has been logged.')
		}
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = NPMCommand
