import Ember from "ember"
import Api from "erizo-webmail/utils/api"

export default Ember.Route.extend({
	model: function (param) {
		let box = this.modelFor("box")
		Ember.Logger.assert(box)
		let messageId = param.id
		Ember.Logger.assert(messageId)

		return Api.getMessage(box, messageId).then(function (message) {
			return Api.downloadMessageDisplayContent(box, message).then(function () {
				return message
			})
		})
	},
})
