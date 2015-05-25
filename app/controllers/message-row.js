import Ember from "ember"

export default Ember.ObjectController.extend({
	isSelected: false,

	registerOnParent: function () {
		this.send("registerMessageRow", this)
	}.on("init"),

	willDestroy: function () {
		this.send("unregisterMessageRow", this)
	},
})
