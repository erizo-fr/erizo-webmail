import Ember from "ember"

export default Ember.Controller.extend({
	username: "",
	password: "",
	requestRunning: false,

	actions: {
		login: function () {
			let username = this.get("username")
			let password = this.get("password")
			if (!username) {
				this.shakeButton()
				Ember.$("#login-panel #input-username").focus()
				return
			}
			if (!password) {
				this.shakeButton()
				Ember.$("#login-panel #input-password").focus()
				return
			}

			this.set("requestRunning", true)
			let self = this
			this.api.login(username, password).then(function () {
				self.set("requestRunning", false)
				self.transitionToRoute("boxes")
			}, function (error) {
				self.set("requestRunning", false)
				Ember.Logger.error("Login failed: " + error)
				Ember.$.snackbar({
					content: "Failed login: " + error.responseText,
					style: "error",
					timeout: 3000,
				})
			})
		},
	},

	shakeButton: function () {
		let button = Ember.$("#login-panel #btn-login")
		this.animationManager.shake(button)
	},
})
