import Ember from "ember"
import Api from "erizo-webmail/utils/api"
import EmailAddressFactory from "erizo-webmail/models/factories/emailAddress"
import NewMessageFactory from "erizo-webmail/models/factories/new-message"

export default Ember.ObjectController.extend({
	needs: ["boxes", "box", "account"],

	isSending: false,
	newMessage: null,

	init: function () {
		this._super.apply(this, arguments)
		var newMessage = NewMessageFactory.create()
		newMessage.from = EmailAddressFactory.createEmailArray(this.get("controllers.account.model.defaultIdentity"))
		this.set("newMessage", newMessage)
	},

	actions: {
		deleteMessage: function () {
			Ember.Logger.debug("Action received: Delete message")
			// Get the box model
			var box = this.get("controllers.box.model")
			// Get the message id
			var message = this.get("model")
			var self = this
			Api.deleteMessage(box, message)
				.done(function () {
					Ember.$.snackbar({
						content: "Message deleted",
						timeout: 3000,
					})
					self.transitionToRoute("box")
				}).fail(function (jqXHR, textStatus) {
					Ember.Logger.error("Failed to delete the message: " + textStatus)
					Ember.$.snackbar({
						content: "The server can not delete the message: " + textStatus,
						style: "error",
						timeout: 3000,
					})
				})
		},
		sendMessage: function () {
			Ember.Logger.debug("Action received: Send new message")
			if (this.get("isSending")) {
				Ember.Logger.debug("A send request is already running, ignoring ...")
				return
			}

			let self = this
			this.set("isSending", true)
			Api.sendMessage(this.get("newMessage")).done(function () {
				// Disable sending state
				self.set("isSending", false)

				// Show success
				Ember.$.snackbar({
					content: "Message sent !",
					timeout: 3000,
				})
				// Go the the boxes route
				self.transitionToRoute("boxes")
			}).fail(function () {
				// Disable sending state
				self.set("isSending", false)

				// Show error
				Ember.$.snackbar({
					content: "Failed to send the message :(<br/>Maybe you should try to send it later",
					style: "error",
					timeout: 3000,
				})
			})
		},
		moveMessage: function (newBox) {
			Ember.Logger.assert(newBox)
			Ember.Logger.debug("Action received: Move message to box#" + newBox.get("path"))

			let self = this
			Api.moveMessage(this.get("controllers.box.model"), this.get("model"), newBox).done(function () {
				Ember.$.snackbar({
					content: "Message moved to " + newBox.get("name") + " !",
					timeout: 3000,
				})

				// Go the the boxes route
				self.transitionToRoute("box")

			}).fail(function () {
				Ember.$.snackbar({
					content: "Failed to move the message :(<br/>Maybe you should try to move it later",
					style: "error",
					timeout: 3000,
				})
			})
		},

		goToWriteModeReply: function () {
			this.set("isWriteModeReply", true)
		},

		goToWriteModeForward: function () {
			this.set("isWriteModeForward", true)
		},
	},
})
