import Ember from "ember"

export default Ember.Route.extend({
	model: function () {
		let box = this.modelFor("box")
		Ember.Logger.assert(box)
		return this.api.getBoxOrder(box)
	},
})
