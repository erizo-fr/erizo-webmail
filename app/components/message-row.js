import Ember from "ember"

export default Ember.Component.extend({
	model: null,

	isSeen: function () {
		var model = this.get("model")
		if (!model) {
			return null
		}
		return model.get("isSeen")
	}.property("model"),

	previewText: function () {
		var model = this.get("model")
		if (!model) {
			return null
		}
		return model.part.get("previewMessage")
	}.property("model"),
})
