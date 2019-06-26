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

			//get recipe and check every amount_ingredientX and item_ingredientX
			recipe = await this.client.xiv.data.get('recipe', recipe.id)
			let list = await getIngredientList(recipe)
			if(!list.hasRecipes) {
				const embed = this.client.utils.toEmbed.recipe(recipe, list.mats)
				msg.channel.send('', {embed: embed})
				return msg.channel.stopTyping()
			}


			//complex recipe, run recursively
			let fullList = await getIngredientList(recipe, true, this.client.xiv)
			const embed = this.client.utils.toEmbed.recipe(recipe, list.mats, fullList)
			msg.channel.send('', {embed: embed})
			return msg.channel.stopTyping()
		} catch(err) {
			this.client.utils.throwError(err,msg)
			return msg.channel.stopTyping()
		}

	}
}

async function getIngredientList(recipe, recursive = false, xiv, context = {mats: new Map(), recipes: []}, multiples = 1) {
	return new Promise(async (resolve) => {
		let hasRecipes = false
		console.log(`running on ${recipe.name} with mult ${multiples}`)
		for (let i = 0; i < 10; i++) {
			let num = recipe['amount_ingredient'+i], item = recipe['item_ingredient'+i], rec = recipe['item_ingredient_recipe'+i], mult = multiples
			if(num) {
				if(context.mats.has(item.id)) {//already seen
					let temp = context.mats.get(item.id)
					temp[1] += num * mult
					context.mats.set(item.id, temp)
				}
				else if(!recursive || !rec) {//not seen, first pass or not recipe
					context.mats.set(item.id, [item, num * mult])
					if(!recursive && rec)
						hasRecipes = true
				}

				else if(rec) {//not seen, recursive, or recipe
					context.recipes.push(rec[0])
					let fetchedRec = await xiv.data.get('recipe', rec[0].id)
					let factor = mult * num / rec[0].amount_result
					mult = factor < 1 ? 1 : factor
					let res = await getIngredientList(fetchedRec, true, xiv, context, mult)
					context.mats = res.mats
					context.recipes = res.recipes
				}
			}
		}
		resolve({mats: context.mats, recipes: context.recipes, hasRecipes: hasRecipes})
	})
}

module.exports = CraftCommand
