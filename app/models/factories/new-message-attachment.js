import Ember from "ember"
import NewMessageAttachment from "erizo-webmail/models/new-message-attachment"

export default Ember.Object.extend({
	createFromFile: function (file) {
		let json = {
			file: file,
		}
		return NewMessageAttachment.create(json)
	},
}).create()
