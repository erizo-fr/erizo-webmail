import Ember from "ember"
import OpenBox from "erizo-webmail/models/openBox"

export default Ember.Object.extend({
	create: function (json, box) {
		Ember.Logger.assert(box)
		let data = {}

		// Add json data
		if (json.messages) {
			if (json.messages.total) {
				data.messageCount = json.messages.total
			}
			if (json.messages.new) {
				data.newMessageCount = json.messages.new
			}
		}

		// Add box data
		data.attribs = box.get("attribs")
		data.delimiter = box.get("delimiter")
		data.children = box.get("children")
		data.name = box.get("name")
		data.parent = box.get("parent")

		return OpenBox.create(data)
	},
}).create()
