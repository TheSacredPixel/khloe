const { Command } = require('discord-akairo'),
	{ Attachment } = require('discord.js'),
	{ createCanvas, loadImage } = require('canvas')

class WhoAmICommand extends Command {
	constructor() {
		super('whoami', {
			aliases: ['whoami'],
			description: ''
		})
	}

	async exec(msg) {
		let get = this.client.provider.get(msg.author.id, 'identity', null)

		if(!get)
			return msg.util.send('I don\'t know :( Use `>iam (character name) (server)` so that I learn!')

		return msg.util.send(`You're ${get.name} of ${get.server}!`)

		const char = await this.client.xiv.character.get(get.id)

		const canvas = createCanvas(640, 873)
		const ctx = canvas.getContext('2d')

		const img = await loadImage(char.portrait)
		ctx.drawImage(img, 0, 0)

		const attach = new Attachment(canvas.toBuffer(), 'test.png')
		return msg.util.send('Here: ', attach)
	}
}

module.exports = WhoAmICommand
