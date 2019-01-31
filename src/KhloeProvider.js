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

	setOnResume(id, reason) {
		this.set(0, 'onresume', {id: id, reason: reason})
	}

	getOnResume() {
		return this.get(0, 'onresume', null)
	}

	clearOnResume() {
		this.delete(0, 'onresume')
	}
}

module.exports = KhloeProvider
