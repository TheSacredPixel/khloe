const { SQLiteProvider } = require('discord-akairo'),
	sqlite = require('sqlite')


class KhloeProvider extends SQLiteProvider {
	constructor() {
		super(
			sqlite.open('./db.sqlite'),
			'khloe',
			{
				idColumn: 'id',
				dataColumn: 'data'
			}
		)
	}
}

module.exports = KhloeProvider
