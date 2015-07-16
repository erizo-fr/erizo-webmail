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
			if (this.get("isSending")) {
				Ember.Logger.debug("A send request is already running, ignoring ...")
				return
			}

			this.set("isSending", true)
			let self = this
			this.api.sendMessage(this.get("model")).then(function () {
				// Disable sending state
				self.set("isSending", false)

				// Show success
				Ember.$.snackbar({
					content: "Message sent !",
					timeout: 3000,
				})
				// Close the new message
				self.sendAction("delete", self.get("model"))

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
})
