const { createCanvas, loadImage } = require('canvas'),
	fs = require('fs')

const run = async () => {
	try {
		const canvas = createCanvas(950, 873)
		const ctx = canvas.getContext('2d')


		const out = fs.createWriteStream(__dirname + '/test.png')
		//req('https://img2.finalfantasyxiv.com/f/b7ce37b6c39be01edf5b6d8048e6dd34_745baffc465480ed372e274d50318290fl0_640x873.jpg').pipe(out)
		//let get = 'https://img2.finalfantasyxiv.com/f/b7ce37b6c39be01edf5b6d8048e6dd34_745baffc465480ed372e274d50318290fl0_640x873.jpg'
		const img = await loadImage('./img.jpg')
		ctx.drawImage(img, 310, 0)

		ctx.fillRect(0,0,400,873)

		ctx.font = '42px Meiryo'
		ctx.fillStyle = 'white'
		ctx.textAlign = 'center'
		ctx.fillText('Kai Megumi', 200, 100, 300)

		const stream = canvas.createPNGStream()
		await stream.pipe(out)
	} catch(err) {
		console.log(err)
	}
}

run()
