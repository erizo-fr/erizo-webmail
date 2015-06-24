import Ember from "ember"
import Multipart from "erizo-webmail/models/part-multipart"
import MultipartRelated from "erizo-webmail/models/part-multipart-related"
import TextHtmlBodyPart from "erizo-webmail/models/part-bodypart-text-html"
import TextPlainBodyPart from "erizo-webmail/models/part-bodypart-text-plain"
import BodyPart from "erizo-webmail/models/part-bodypart"

export default Ember.Object.extend({
	createPart: function (data) {
		if (data.length === 1) {
			return this.createBodyPart(data[0])
		} else {
			return this.createMultiPart(data[0], data.slice(1))
		}
	},

	createBodyPart: function (data) {
		if (data.type === "text" && data.subtype === "html") {
			return TextHtmlBodyPart.create(data)
		} else if (data.type === "text" && data.subtype === "plain") {
			return TextPlainBodyPart.create(data)
		} else {
			return BodyPart.create(data)
		}
	},

	createMultiPart: function (data, subpartData) {
		var subparts = []
		for (var i = 0; i < subpartData.length; i++) {
			subparts[i] = this.createPart(subpartData[i])
		}

		data.subparts = subparts
		if (data.type === "related") {
			return MultipartRelated.create(data)
		} else {
			return Multipart.create(data)
		}
	},
}).create()
