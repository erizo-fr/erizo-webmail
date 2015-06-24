import Part from "erizo-webmail/models/part"

export default Part.extend({
	content: null,
	encoding: null,
	params: null,
	size: null,

	name: function () {
		if (this.get("isAttachment") && this.get("disposition.params.filename")) {
			return this.get("disposition.params.filename")
		} else {
			return null
		}
	}.property("isAttachment", "disposition"),

	partID: function () {
		var data = this.get("data")
		return data == null ? null : data.partID
	}.property("data"),

	realSize: function () {
		let size = this.get("size")
		if (size) {
			let encoding = this.get("encoding")
			if (encoding === "base64") {
				return size / 1.37
			} else {
				return size
			}
		} else {
			return null
		}
	}.property("size", "encoding"),

})
