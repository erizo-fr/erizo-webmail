import Ember from "ember"
import EmailAddressFactory from "erizo-webmail/models/factories/emailAddress"

export default Ember.Component.extend({
	replyContainer: "<div><p>Previous message: </p><div><message/></div></div>",
	forwardContainer: "<div><p>Transfered message: </p><div><message/></div></div>",

	isWriteModeReply: false,
	isWriteModeForward: false,
	isSubjectVisible: false,
	isCcVisible: false,
	isBccVisible: false,

	lastMessage: null,
	newMessage: null,

	isWriteMode: function () {
		if (this.get("isNewMessage")) {
			return true
		} else {
			return this.get("isWriteModeReply") || this.get("isWriteModeForward")
		}
	}.property("isWriteModeReply", "isWriteModeForward", "isNewMessage"),

	isNewMessage: function () {
		return !this.get("lastMessage")
	}.property("lastMessage"),

	actions: {
		goToWriteModeReply: function () {
			var lastMessage = this.get("lastMessage")
			var newMessage = this.get("newMessage")
			newMessage.set("subject", "RE: " + lastMessage.envelope.subject)
			newMessage.set("to", EmailAddressFactory.createEmailArray(lastMessage.envelope.from))
			if (this.get("lastMessage")) {
				// Set body from old message
				let html = this.get("replyContainer").replace("<message/>", this.get("lastMessage.part.htmlMessage"))
				this.get("newMessage").set("htmlBody", html)
			}

			this.set("isWriteModeReply", true)
			this.set("isWriteModeForward", false)
		},
		goToWriteModeForward: function () {
			var lastMessage = this.get("lastMessage")
			var newMessage = this.get("newMessage")
			newMessage.set("subject", "FWD: " + lastMessage.envelope.subject)
			newMessage.set("to", [])
			if (this.get("lastMessage")) {
				// Set body from old message
				let html = this.get("forwardContainer").replace("<message/>", this.get("lastMessage.part.htmlMessage"))
				this.get("newMessage").set("htmlBody", html)
			}

			this.set("isWriteModeReply", false)
			this.set("isWriteModeForward", true)
		},
		showSubject: function () {
			this.set("isSubjectVisible", true)
		},
		showCc: function () {
			this.set("isCcVisible", true)
		},
		showBcc: function () {
			this.set("isBccVisible", true)
		},
	},
})
