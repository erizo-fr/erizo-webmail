import Ember from "ember"
import Api from "erizo-webmail/utils/api"

export default Ember.Route.extend({
	model: function () {
		return Api.getUserData()
	},

	actions: {
		createNewMessage: function () {
			this.get("controller").createNewMessage()
		},
	},
})
