import Ember from "ember"

export default Ember.Object.extend({
	fn: null,
	email: null,

	init: function () {
		if (!this.email) {
			this.email = []
		}
	},
})
