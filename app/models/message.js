import Ember from "ember"

export default Ember.Object.extend({
	part: null,
	enveloppe: null,
	date: null,
	uid: null,
	seq: null,
	flags: null,

	hasAttachments: function () {
		if (!this.get("part")) {
			return null // Struct element has not been fetched
		}
		return this.get("part.hasAttachments")
	}.property("part"),

	isSeen: function () {
		if (!this.get("flags")) {
			return null // flags element has not been fetched
		}
		return this.get("flags").indexOf("\\Seen") !== -1
	}.property("flags"),

	previewMessage: function () {
		if (!this.get("part")) {
			return ""
		}
		return this.get("part.previewMessage")
	}.property("part.previewMessage"),
})
