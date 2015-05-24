import Ember from "ember"

export default Ember.Component.extend({
	collapsed: false,

	actions: {
		toggleCollapse: function () {
			this.set("collapsed", !this.get("collapsed"))
		},
	},
})
