import Ember from "ember"

export default Ember.Component.extend({
	tagName: "li",

	actions: {
		click: function () {
			Ember.Logger.debug("BoxItemComponent click action triggered")
			this.sendAction("clickAction", this.get("box"))
		},
	},

	boxIcon: function () {
		var iconClass = "mdi-content-inbox"
		var box = this.get("box")
		if (box) {
			var boxAttribs = box.special_use_attrib
			if (boxAttribs === "\\Drafts") {
				iconClass = "mdi-content-drafts"
			} else if (boxAttribs === "\\Sent") {
				iconClass = "mdi-content-send"
			} else if (boxAttribs === "\\Trash") {
				iconClass = "mdi-action-delete"
			} else if (boxAttribs === "\\Trash") {
				iconClass = "mdi-action-delete"
			}
		} else {
			Ember.Logger.warn("No box defined into BoxItemComponent")
		}
		return iconClass
	}.property("box"),
})
