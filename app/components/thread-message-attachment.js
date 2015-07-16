import Ember from "ember"
import Api from "erizo-webmail/utils/api"

export default Ember.Component.extend({

	contentUrl: function () {
		let box = this.get("box")
		let message = this.get("message")
		let part = this.get("model")
		return Api.getPartContentUrl(box, message, part)
	}.property("box", "message", "model"),

})
