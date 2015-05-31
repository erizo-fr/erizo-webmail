import Ember from "ember"

export default Ember.ArrayController.extend({
	selectedBox: null,

	actions: {
		selectBox: function (box) {
			this.transitionToRoute("box", box.get("path"))
		},
	},
})
