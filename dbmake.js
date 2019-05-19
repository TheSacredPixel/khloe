const sqlite = require('sqlite')

let run = async () => {
	try {
		let db = await sqlite.open('./db.sqlite')
		db.run('CREATE TABLE khloe (id integer PRIMARY KEY, data text NOT NULL)')
		console.log('created table')
		db.close()
	} catch(err) {
		console.log(err)
	}
}

run()
