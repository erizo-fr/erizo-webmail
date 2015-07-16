import Ember from "ember"

export default Ember.ArrayController.extend({
	selectedBox: null,

	actions: {
		selectBox: function (box) {
			this.transitionToRoute("box", box.get("path"))
		},
		messageDropped: function (newBox, messageUid) {
			Ember.Logger.assert(newBox)
			Ember.Logger.assert(messageUid)
			Ember.Logger.debug("Action received: message dropped -> Move message to box#" + newBox.get("path"))

			let self = this
			this.api.moveMessageByUid(this.get("selectedBox"), messageUid, newBox).done(function () {
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
})
