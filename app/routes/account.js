import Ember from "ember"

export default Ember.Route.extend({
	model: function () {
		return this.api.getUserData()
	},

	actions: {
		createNewMessage: function () {
			this.get("controller").createNewMessage()
		},
	},
})
