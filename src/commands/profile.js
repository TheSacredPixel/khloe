const { Command } = require('discord-akairo'),
	{ Attachment } = require('discord.js'),
	{ createCanvas, loadImage } = require('canvas')

class ProfileCommand extends Command {
	constructor() {
		super('profile', {
			aliases: ['profile', 'character', 'char'],
			description: ''
		})
	}

	async exec(msg) {
		let get = this.client.provider.get(msg.author.id, 'identity', null)

		if(!get)// TODO: add @ping resolution, as well as char name search
			return msg.util.send('I don\'t know :( Use `>iam (character name) (server)` so that I learn!')

		//return msg.util.send(`You're ${get.name} of ${get.server}!`)

		const res = await this.client.xiv.character.get(get.id, { extended: true })

		if(!res.status.ok)
			return msg.util.send('Error: Status was NOT ok')//PH

		const char = res.character

		const canvas = createCanvas(640, 873)
		const ctx = canvas.getContext('2d')

		const img = await loadImage(char.portrait)
		ctx.drawImage(img, 0, 0)

		const attach = new Attachment(canvas.toBuffer(), 'test.png')
		return msg.util.send('', attach)
	}
}

module.exports = ProfileCommand
