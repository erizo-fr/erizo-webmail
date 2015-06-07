import Ember from "ember"

export default Ember.Component.extend({
	tagName: "li",
	classNameBindings: ["isHidden:hidden"],
	hiddenBoxes: [],
	activeBoxes: [],

	boxIcon: function () {
		var iconClass = "mdi-content-inbox"
		var box = this.get("box")
		if (box) {
			if (box.get("isTrashBox")) {
				iconClass = "mdi-action-delete"
			} else if (box.get("isSentBox")) {
				iconClass = "mdi-content-send"
			} else if (box.get("isDraftBox")) {
				iconClass = "mdi-content-drafts"
			}
		} else {
			Ember.Logger.warn("No box defined into BoxItemComponent")
		}
		return iconClass
	}.property("box"),

	isActive: function () {
		return this.isInBoxList(this.get("activeBoxes"))
	}.property("activeBoxes"),

	isHidden: function () {
		return this.isInBoxList(this.get("hiddenBoxes"))
	}.property("hiddenBoxes"),

	actions: {
		click: function () {
			Ember.Logger.debug("BoxItemComponent click action triggered")
			this.sendAction("clickAction", this.get("box"))
		},
		childBoxItemClick: function (box) {
			this.sendAction("clickAction", box)
		},
		elementDropped: function (data) {
			Ember.Logger.debug("BoxItemComponent elementDropped action triggered")
			this.sendAction("elementDropped", this.get("box"), data)
		},
		childBoxElementDropped: function (box, data) {
			this.sendAction("elementDropped", box, data)
		},
	},

	isInBoxList: function (boxes) {
		let boxPath = this.get("box.path")
		if (boxes instanceof Array) {
			for (let i = 0; i < boxes.length; i++) {
				if (boxes[i].get("path") === boxPath) {
					return true
				}
			}
		} else if (boxes) {
			if (boxes.get("path") === boxPath) {
				return true
			}
		}
		return false
	},
})
