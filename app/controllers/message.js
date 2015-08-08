import Ember from "ember"

import EmailAddressFactory from "erizo-webmail/models/factories/emailAddress"
import NewMessageFactory from "erizo-webmail/models/factories/new-message"

export default Ember.Controller.extend({
	boxes: Ember.inject.controller(),
	box: Ember.inject.controller(),
	account: Ember.inject.controller(),

	isSending: false,
	newMessage: null,

	init: function () {
		this._super.apply(this, arguments)
		var newMessage = NewMessageFactory.create()
		newMessage.from = EmailAddressFactory.createEmailArray(this.get("account.model.defaultIdentity"))
		this.set("newMessage", newMessage)
	},

	actions: {
		deleteMessage: function () {
			Ember.Logger.debug("Action received: Delete message")
			// Get the box model
			var box = this.get("box.model")
			// Get the message id
			var message = this.get("model")
			var self = this
			this.api.deleteMessage(box, message)
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
			let self = this

			// Prevent multiple clicks
			if (this.get("isSending")) {
				Ember.Logger.debug("A send request is already running, ignoring ...")
				return
			}
			this.set("isSending", true)

			// Test the fields
			if (!this.validateNewMessageFields()) {
				this.set("isSending", false)
				Ember.Logger.debug("Invalid fields. Aborting")
				return
			}

			// Send the message
			this.api.sendMessage(this.get("newMessage")).then(function () {
				// Disable sending state
				self.set("isSending", false)

				// Show success
				Ember.$.snackbar({
					content: "Message sent !",
					timeout: 3000,
				})
				// Go the the boxes route
				self.transitionToRoute("boxes")
			}, function () {
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
			this.api.moveMessage(this.get("box.model"), this.get("model"), newBox).done(function () {
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
	},

	validateNewMessageFields: function () {
		let message = this.get("newMessage")

		if (!message.get("subject")) {
			this.animationManager.shake(Ember.$(".erizo-thread .erizo-messageComposer-subject"))
			return false
		}

		if (!message.get("to.length")) {
			this.animationManager.shake(Ember.$(".erizo-thread .erizo-messageComposer-to"))
			return false
		}

		return true
	},
})
