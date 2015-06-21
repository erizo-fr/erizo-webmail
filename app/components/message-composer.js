import Ember from "ember"
import EmailAddressFactory from "erizo-webmail/models/factories/emailAddress"
import NewMessageAttachmentFactory from "erizo-webmail/models/factories/new-message-attachment"

export default Ember.Component.extend({
	replyContainer: "<div><p>Previous message: </p><div><message/></div></div>",
	forwardContainer: "<div><p>Transfered message: </p><div><message/></div></div>",

	isWriteModeReply: false,
	isWriteModeForward: false,
	isSubjectVisible: false,
	isCcVisible: false,
	isBccVisible: false,

	lastMessage: null,
	model: null,

	isWriteMode: function () {
		return this.get("isNewMessage") || this.get("isWriteModeReply") || this.get("isWriteModeForward")
	}.property("isWriteModeReply", "isWriteModeForward", "isNewMessage"),

	isNewMessage: function () {
		return !this.get("lastMessage")
	}.property("lastMessage"),

	actions: {
		goToWriteModeReply: function () {
			this.set("isWriteModeReply", true)
		},
		goToWriteModeForward: function () {
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
		newAttachment: function () {
			let input = this.$(".erizo-messageComposer-addAttachment input")
			if (input.val()) {
				let file = input[0].files[0]
				Ember.Logger.debug("newAttachment event received: " + file.name)
				this.get("model.attachments").pushObject(NewMessageAttachmentFactory.createFromFile(file))
				input.val("")
			}
		},
		deleteAttachment: function (attachment) {
			Ember.Logger.debug("deleteAttachment event received: " + attachment.get("file").name)
			this.get("model.attachments").removeObject(attachment)
		},
	},

	isWriteModeReplyChanged: function () {
		if (this.get("isWriteModeReply")) {
			this.goToWriteModeReply()
		}
	}.observes("isWriteModeReply"),

	isWriteModeForwardChanged: function () {
		if (this.get("isWriteModeForward")) {
			this.goToWriteModeForward()
		}
	}.observes("isWriteModeForward"),

	goToWriteModeReply: function () {
		this.set("isWriteModeForward", false)
		var lastMessage = this.get("lastMessage")
		var model = this.get("model")
		model.set("subject", "RE: " + lastMessage.envelope.subject)
		model.set("to", EmailAddressFactory.createEmailArray(lastMessage.envelope.from))
		if (this.get("lastMessage")) {
			// Set body from old message
			let html = this.get("replyContainer").replace("<message/>", this.get("lastMessage.part.htmlMessage"))
			this.get("model").set("htmlBody", html)
		}
	},

	goToWriteModeForward: function () {
		this.set("isWriteModeReply", false)
		var lastMessage = this.get("lastMessage")
		var model = this.get("model")
		model.set("subject", "FWD: " + lastMessage.envelope.subject)
		model.set("to", [])
		if (this.get("lastMessage")) {
			// Set body from old message
			let html = this.get("forwardContainer").replace("<message/>", this.get("lastMessage.part.htmlMessage"))
			this.get("model").set("htmlBody", html)
		}
	},
})
