import Ember from "ember"
import NewMessage from "erizo-webmail/models/new-message"

export default Ember.Object.extend({
	create: function (json) {
		return NewMessage.create(json)
	},
}).create()
