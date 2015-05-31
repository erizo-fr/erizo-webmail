import Ember from "ember"

export default Ember.Object.extend({
	attribs: null,
	delimiter: ".",
	children: null,
	name: null,
	parent: null,

	childrenCount: Ember.computed.alias("children.length"),
	hasChildren: Ember.computed.gt("childrenCount", 0),

	init: function () {
		if (!this.attribs) {
			this.attribs = []
		}
		if (!this.children) {
			this.children = []
		}
	},

	path: function () {
		let parent = this.get("parent")
		let path = ""
		if (parent) {
			path = parent.get("path") + parent.get("delimiter")
		}
		path += this.get("name")
		return path
	}.property("name", "parent.path"),

	isTrashBox: function () {
		return this.get("attribs").contains("\\Trash")
	}.property("attribs"),

	isSentBox: function () {
		return this.get("attribs").contains("\\Sent")
	}.property("attribs"),

	isDraftBox: function () {
		return this.get("attribs").contains("\\Draft")
	}.property("attribs"),

	isSpecialBox: function () {
		return this.get("isSentBox") || this.get("isTrashBox")
	}.property("isSentBox", "isTrashBox"),

	isParentOf: function (boxPath) {
		return boxPath.startsWith(this.get("path"))
	},
})
