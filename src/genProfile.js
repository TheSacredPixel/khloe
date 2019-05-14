const { createCanvas, loadImage } = require('canvas-prebuilt')

module.exports = async function(res, image, out) {
	try {
		const char = res.character, fc = res.free_company

		const canvas = createCanvas(950, 873)
		const ctx = canvas.getContext('2d')

		const img = await loadImage(image)
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



		if(out) {
			const stream = canvas.createPNGStream()
			await stream.pipe(out)
		} else
			return canvas.toBuffer()
	} catch(err) {
		console.log(err)
	}
}
