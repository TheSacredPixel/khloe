const fs = require('fs'),
	genProfile = require('./src/genProfile')

const run = async () => {
	const out = fs.createWriteStream(__dirname + '/test.png'),
		res = require('./character.json')

	await genProfile(res, './img.jpg', out)
}

run()
