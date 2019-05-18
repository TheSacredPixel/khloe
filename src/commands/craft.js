const { Command } = require('discord-akairo')

class CraftCommand extends Command {
	constructor() {
		super('craft', {
			aliases: ['craft', 'recipe'],
			description: '',
			args: [
				{
					id: 'input',
					match: 'content'
				}
			]
		})
	}

	async exec(msg, { input }) {
		//find recipe (search and data)

		try {
			msg.channel.startTyping()
			//search
			let res = await this.client.xiv.search(input, {indexes: 'Recipe'})
			if(!res.results.length) {
				msg.util.send('Recipe not found :(')
				return msg.channel.stopTyping()
			}

			//try to use perfect match first
			let found = res.results.find(result => result.name.toLowerCase() === input.toLowerCase())
			let recipe = found ? found : res.results[0]

			//prompt confirm
			if(!found) {
				let embed = this.client.utils.toEmbed.recipeFromSearch(recipe)
				msg.channel.stopTyping()
				let m = await msg.util.send('Is this the recipe you\'re looking for?', {embed:embed})
				let r = await this.client.utils.promptReaction(m, msg.author.id)
				if(r.emoji.name === '❌') {
					return msg.util.send('lol idc :3c')
				} else if(r.emoji.name === '✅') {
					msg.channel.startTyping()
				}
			}
			//get recipe and check amount_ingredientX and item_ingredientX
			recipe = await this.client.xiv.data.get('recipe', recipe.id)

			let ingredients = []
			for (var i = 0; i < 10; i++) {
				let n = recipe['amount_ingredient'+i]
				if(n)
					ingredients.push({n: n, i: recipe['item_ingredient'+i]})
			}
			const embed = this.client.utils.toEmbed.recipe(recipe, ingredients)
			msg.channel.send('', {embed: embed})
			return msg.channel.stopTyping()

			//check item_ingredient_recipeX.id, and repeat (account for amount_result etc)
		} catch(err) {
			console.error(err)
			msg.util.send('Something went wrong :(')
			return msg.channel.stopTyping()
		}

	}
}

module.exports = CraftCommand
