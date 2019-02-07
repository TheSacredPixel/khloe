const fs = require('fs'),
	XIVAPI = require('xivapi-js')
const xiv = new XIVAPI('82c1b8d8aec7482fa0b43abe', {snake_case: true})

const run = async () => {
	let char = await xiv.character.get(8354659, {extended: true, data: 'FC'})

	fs.writeFile('character.json', JSON.stringify(char), 'utf8', () => console.log('done') )
}

run()
