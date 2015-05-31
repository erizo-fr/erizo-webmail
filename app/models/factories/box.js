import Ember from "ember"
import Box from "erizo-webmail/models/box"

export default Ember.Object.extend({
	create: function (json, parent) {
		let model = Box.create({})

		// Name(required)
		Ember.Logger.assert(json.name)
		model.set("name", json.name)

		// Parent
		if (parent) {
			model.set("parent", parent)
		}

		// Delimiter
		if (json.delimiter) {
			model.set("delimiter", json.delimiter)
		}

		// Attribs
		if (json.attribs) {
			model.set("attribs", json.attribs)
		}

		// Children
		if (json.children) {
			model.set("children", this.createArray(json.children, model))
		}

		return model
	},

	createArray: function (json, parent) {
		let self = this
		let result
		if (json instanceof Array) {
			result = []
			json.forEach(function (element) {
				result.push(self.create(element, parent))
			})
		} else {
			// Convert api object to array
			result = Ember.$.map(json, function (value, index) {
				value.name = index
				return [self.create(value, parent)]
			})
		}

		return this.sortArray(result)
	},

	sortArray: function (boxes) {
		return boxes.sort(function (box1, box2) {
			if (box1 === null && box2 === null) {
				return 0
			}
			if (box1 === null || box2 === null) {
				return box1 === null ? 1 : -1
			}

			if (box1.name === box2.name) {
				return 0
			}

			// Inbox first
			if (box1.get("name") === "INBOX") {
				return -1
			}
			if (box2.get("name") === "INBOX") {
				return 1
			}

			// Special attributes then
			if (box1.get("isSpecialBox") !== box2.get("isSpecialBox")) {
				return box1.get("isSpecialBox") ? -1 : 1
			}

			// Others
			return box1.get("name") > box2.get("name") ? 1 : -1
		})
	},
}).create()
