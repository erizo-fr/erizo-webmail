import Ember from "ember"
import EmailAddressFactory from "erizo-webmail/models/factories/emailAddress"
import NewMessageAttachmentFactory from "erizo-webmail/models/factories/new-message-attachment"

export default Ember.Component.extend({
	replyContainer: "<br/><br/><div>----------------------------<p>Previous message: </p><br/><div><message/></div></div>",
	forwardContainer: "<br/><br/><div>----------------------------<p>Transfered message: </p><br/><div><message/></div></div>",

	isWriteModeReply: false,
	isWriteModeForward: false,
	isSubjectVisible: false,
	isCcVisible: false,
	isBccVisible: false,

	cursorPositionBegin: 0,
	cursorPositionEnd: 0,

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
			let input = this.$(".erizo-messageComposer-addAttachmentInput")
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

	isWriteModeReplyChanged: Ember.observer("isWriteModeReply", function () {
		if (this.get("isWriteModeReply")) {
			this.goToWriteModeReply()
		}
	}),

	isWriteModeForwardChanged: Ember.observer("isWriteModeForward", function () {
		if (this.get("isWriteModeForward")) {
			this.goToWriteModeForward()
		}
	}),

	goToWriteModeReply: function () {
		this.set("isWriteModeForward", false)
		var lastMessage = this.get("lastMessage")
		var model = this.get("model")
		model.set("subject", "RE: " + lastMessage.envelope.subject)
		model.set("to", EmailAddressFactory.createEmailArray(lastMessage.envelope.from))

		// Set HTML
		let html = ""
		if (this.get("lastMessage.part.htmlMessage")) {
			// Set body from old message
			html = this.get("replyContainer").replace("<message/>", this.get("lastMessage.part.htmlMessage"))
		}
		this.get("model").set("htmlBody", html)

		// Set focus
		Ember.$("#" + this.elementId + " .ql-editor").focus()
		this.set("cursorPositionBegin", 0)
		this.set("cursorPositionEnd", 0)
	},

	goToWriteModeForward: function () {
		this.set("isWriteModeReply", false)
		var lastMessage = this.get("lastMessage")
		var model = this.get("model")
		model.set("subject", "FWD: " + lastMessage.envelope.subject)
		model.set("to", [])

		// Set HTML
		let html = ""
		if (this.get("lastMessage.part.htmlMessage")) {
			html = this.get("forwardContainer").replace("<message/>", this.get("lastMessage.part.htmlMessage"))
		}
		this.get("model").set("htmlBody", html)

		// Set focus
		Ember.$("#" + this.elementId + " .ql-editor").focus()
		this.set("cursorPositionBegin", 0)
		this.set("cursorPositionEnd", 0)
	},
})
