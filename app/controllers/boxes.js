import Ember from "ember"

export default Ember.Controller.extend({
	selectedBox: null,

	actions: {
		selectBox: function (box) {
			this.transitionToRoute("box", box.get("path"))
		},
		elementDroppedInBox: function (box, objectReference) {
			Ember.Logger.assert(box)
			Ember.Logger.debug("Action received: element dropped")

			if (!objectReference) {
				Ember.Logger.debug("Undefined objectReference")
				return
			}

			let objectData = objectReference.split("#")
			if (objectData.length !== 2) {
				Ember.Logger.warn("Wrong objectReference pattern")
				return
			}
			let objectType = objectData[0]
			let objectId = objectData[1]

			if (objectType === "message") {
				Ember.Logger.info("Move message to box#" + box.get("path"))
				let self = this
				this.api.moveMessageByUid(this.get("selectedBox"), objectId, box).then(function () {
					Ember.$.snackbar({
						content: "Message moved to " + box.get("name") + " !",
						timeout: 3000,
					})

					// Go the the boxes route
					self.transitionToRoute("box")
				}, function () {
					Ember.$.snackbar({
						content: "Failed to move the message :(<br/>Maybe you should try to move it later",
						style: "error",
						timeout: 3000,
					})
				})
			} else {
				Ember.Logger.debug("Don't know what to do when a [" + objectType + "] element is dropped in a box")
				return
			}
		},
	},
})
