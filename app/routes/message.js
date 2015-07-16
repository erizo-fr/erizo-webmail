import Ember from "ember"

export default Ember.Route.extend({
	model: function (param) {
		let box = this.modelFor("box")
		Ember.Logger.assert(box)
		let messageId = param.id
		Ember.Logger.assert(messageId)

		let self = this
		return this.api.getMessage(box, messageId).then(function (message) {
			return self.api.downloadMessageDisplayContent(box, message).then(function () {
				return message
			})
		})
	},
})
