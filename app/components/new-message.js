import Ember from "ember"

export default Ember.Component.extend({
	isOpen: true,
	isSending: false,

	title: function () {
		var subject = this.get("model").get("subject")
		if (this.get("isOpen")) {
			return "New message"
		} else {
			return subject ? subject : "New message"
		}
	}.property("model.subject", "isOpen"),

	actions: {
		toggleHide: function () {
			this.set("isOpen", !this.get("isOpen"))
		},
		delete: function () {
			// TODO
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
			if (!this.validateFields()) {
				this.set("isSending", false)
				Ember.Logger.debug("Invalid fields. Aborting")
				return
			}

			// Send the message
			let model = this.get("model")
			this.api.sendMessage(model).then(function () {
				// Disable sending state
				self.set("isSending", false)

				// Show success
				Ember.$.snackbar({
					content: "Message sent !",
					timeout: 3000,
				})
				// Close the new message
				self.sendAction("delete", model)

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

		close: function () {
			this.sendAction("delete", this.get("model"))
		},
	},

	validateFields: function () {
		let message = this.get("model")

		if (!message.get("subject")) {
			this.animationManager.shake(this.$(".erizo-messageComposer-subject"))
			return false
		}

		if (!message.get("to.length")) {
			this.animationManager.shake(this.$(".erizo-messageComposer-to"))
			return false
		}

		return true
	},
})
