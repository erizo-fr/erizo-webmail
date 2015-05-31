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
		if (json instanceof Array) {
			let result = []
			json.forEach(function (element) {
				result.push(self.create(element, parent))
			})
			return result
		} else {
			// Convert api object to array
			return Ember.$.map(json, function (value, index) {
				value.name = index
				return [self.create(value, parent)]
			})
		}
	},
}).create()
