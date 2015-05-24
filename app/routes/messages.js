import Ember from "ember"
import Api from "erizo-webmail/utils/api"

export default Ember.Route.extend({
	model: function () {
		var box = this.modelFor("box")
		Ember.Logger.assert(box)
		return Api.getBoxOrder(box.path)
	},
})
