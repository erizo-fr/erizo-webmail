import Ember from "ember"

export default Ember.Object.extend({
	date: null,
	subject: null,
	from: null,
	sender: null,
	replyTo: null,
	to: null,
	cc: null,
	bcc: null,
	inReplyTo: null,
	messageId: null,

	hasTo: function () {
		return this.get("to") && this.get("to").length > 0
	}.property("to"),

	hasCc: function () {
		return this.get("cc") && this.get("cc").length > 0
	}.property("cc"),

	hasBcc: function () {
		return this.get("bcc") && this.get("bcc").length > 0
	}.property("bcc"),
})
