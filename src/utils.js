module.exports = {

	firstCapital(string) {
		let split = string.split(' '), words = []
		for(const item of split)
			words.push(item[0].toUpperCase() + item.substring(1).toLowerCase())
		return words.join(' ')
	},

	getServer(input, servers) {
		input = input.split(' ')

		let server, pos = -1
		for (let i = 0; i < input.length; i++) {
			let string = module.exports.firstCapital(input[i])
			if(servers.includes(string)) {
				server = string
				pos = i
				break
			}
		}

		if(pos !== -1)
			input.splice(pos, 1)
		input = input.join(' ')

		return { server: server, text: input }
	}

}
