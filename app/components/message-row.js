import Ember from "ember"

export default Ember.Component.extend({
	isSelected: false,

	registerOnParent: function () {
		this.sendAction("register", this)
	}.on("init"),

	willDestroy: function () {
		this.sendAction("unregister", this)
	},
})
