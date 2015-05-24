import TextPart from "erizo-webmail/models/part-bodypart-text"

export default TextPart.extend({
	textMessage: function () {
		return this.get("decodedContent")
	}.property("decodedContent"),

	previewParts: function () {
		return this
	}.property("decodedContent"),

	previewMessage: function () {
		let content = this.get("decodedContent")
		if (content == null) {
			return null
		} else {
			// The preview is on one line
			content = content.replace(/[\n\r]/g, " ")
			// Replace any series of ------ by a single dash
			content = content.replace(/-+/g, "-")
			return content
		}
	}.property("decodedContent"),
})
