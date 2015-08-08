import Ember from "ember"

export default Ember.Route.extend({
	model: function (param) {
		let boxPath = param.box
		Ember.Logger.assert(boxPath)

		Ember.Logger.debug("Box route, trying to find box#" + boxPath)
		let boxes = this.modelFor("boxes")
		Ember.Logger.assert(boxes)

		// Find the box by path
		let box = this.getMatchingBox(boxes, boxPath)
		if (!box) {
			Ember.Logger.error("No box is matching the path '" + boxPath + "', redirect to inbox")
			this.transitionTo("boxes")
		} else {
			return box
		}
	},

	getMatchingBox: function (boxes, boxPath) {
		for (let i = 0; i < boxes.length; i++) {
			let box = boxes.get(i)
			if (box.get("path") === boxPath) {
				return this.api.getBox(box)
			} else if (box.isParentOf(boxPath)) {
				return this.getMatchingBox(box.get("children"), boxPath)
			}
		}
	},

	setupController: function (controller, model) {
		controller.set("model", model)
		controller.set("boxes.selectedBox", model)
	},
})
