const { createCanvas, loadImage } = require('canvasa'),
	fs = require('fs'),
	req = require('request-promise-native')

const run = async () => {
	try {
		const canvas = createCanvas(640, 873)
		const ctx = canvas.getContext('2d')


		const out = fs.createWriteStream(__dirname + '/test.png')
		return req('https://img2.finalfantasyxiv.com/f/b7ce37b6c39be01edf5b6d8048e6dd34_745baffc465480ed372e274d50318290fl0_640x873.jpg').pipe(fs.createWriteStream('test.png'))
		const img = await loadImage(get)
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height)



		const stream = canvas.createPNGStream()
		await stream.pipe(out)
	} catch(err) {
		console.log(err)
	}
}

run()
