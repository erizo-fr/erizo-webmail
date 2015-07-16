import Ember from "ember"

export default Ember.Component.extend({

	contentUrl: function () {
		let box = this.get("box")
		let message = this.get("message")
		let part = this.get("model")
		return this.api.getPartContentUrl(box, message, part)
	}.property("box", "message", "model"),

})
