const { createCanvas, loadImage } = require('canvas'),
	fs = require('fs')

const run = async () => {
	try {
		const canvas = createCanvas(950, 873)
		const ctx = canvas.getContext('2d')

		const res = require('./character.json')
		const char = res.character, fc = res.free_company

		const out = fs.createWriteStream(__dirname + '/test.png')
		//req('https://img2.finalfantasyxiv.com/f/b7ce37b6c39be01edf5b6d8048e6dd34_745baffc465480ed372e274d50318290fl0_640x873.jpg').pipe(out)
		//let get = 'https://img2.finalfantasyxiv.com/f/b7ce37b6c39be01edf5b6d8048e6dd34_745baffc465480ed372e274d50318290fl0_640x873.jpg'
		const img = await loadImage('./img.jpg')
		ctx.drawImage(img, 310, 0)

		ctx.fillRect(0, 0, 440, 873)

		//name
		ctx.font = '42px URW Gothic L'
		ctx.fillStyle = 'white'
		ctx.textAlign = 'center'
		ctx.fillText(char.name, 220, 100, 400)

		//title
		ctx.font = '24px URW Gothic L'
		ctx.fillText(char.title.name, 220, 60, 400)

		//server
		ctx.font = '28px URW Gothic L'
		ctx.fillText(char.server, 220, 135, 400)

		//race
		ctx.font = '24px URW Gothic L'
		ctx.fillText(`${char.race.name} - ${char.tribe.name}`, 220, 190, 400)

		//nameday
		ctx.fillText(char.nameday, 220, 220, 400)

		//GC
		ctx.fillText(`${char.grand_company.company.name} / ${char.grand_company.rank.name}`, 220, 280, 400)

		//FC
		ctx.fillText(fc.name, 220, 350, 400)
		ctx.font = '20px URW Gothic L'
		ctx.fillText(`<<${fc.tag}>>`, 220, 375, 400)




		const stream = canvas.createPNGStream()
		await stream.pipe(out)
	} catch(err) {
		console.log(err)
	}
}

run()
