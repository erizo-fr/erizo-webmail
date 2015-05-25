import Ember from "ember"
import MessagesCategory from "erizo-webmail/models/messagesCategory"

export default Ember.Object.extend({
	create: function (json) {
		let data = {}
		if (json.name) {
			data.name = json.name
		}

		if (json.acceptanceFunction) {
			data.acceptanceFunction = json.acceptanceFunction
		}

		if (json.messages) {
			data.messages = json.messages
		} else {
			data.messages = []
		}

		return MessagesCategory.create(data)
	},
}).create()
