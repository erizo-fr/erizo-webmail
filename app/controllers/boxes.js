import Ember from "ember"

export default Ember.ObjectController.extend({
	actions: {
		selectBox: function (box) {
			this.transitionToRoute("box", box.path)
		},
	},
})
