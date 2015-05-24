import Part from "erizo-webmail/models/part"

export default Part.extend({
	subparts: null,
	isAttachment: null,

	init: function () {
		if (!this.subparts) {
			this.subparts = []
		}
	},

	hasAttachments: function () {
		var subparts = this.get("subparts")
		for (var i = 0; i < subparts.length; i++) {
			var subpart = subparts[i]
			if (subpart.get("hasAttachments")) {
				return true
			}
		}

		return false
	}.property("subparts", "subparts.@each.hasAttachments"),

	htmlMessage: function () {
		var subparts = this.get("subparts")
		for (var i = 0; i < subparts.length; i++) {
			var subpart = subparts[i]
			var message = subpart.get("htmlMessage")
			if (message !== null) {
				return message
			}
		}
		return null
	}.property("subparts", "subparts.@each.htmlMessage"),

	textMessage: function () {
		var subparts = this.get("subparts")
		for (var i = 0; i < subparts.length; i++) {
			var subpart = subparts[i]
			var message = subpart.get("textMessage")
			if (message !== null) {
				return message
			}
		}
		return null
	}.property("subparts", "subparts.@each.textMessage"),

	previewMessage: function () {
		var subparts = this.get("subparts")
		for (var i = 0; i < subparts.length; i++) {
			var subpart = subparts[i]
			var message = subpart.get("previewMessage")
			if (message !== null) {
				return message
			}
		}
		return null
	}.property("subparts", "subparts.@each.textMessage"),

	previewParts: function () {
		var result = []
		var subparts = this.get("subparts")
		for (var i = 0; i < subparts.length; i++) {
			result = result.concat(subparts[i].get("previewParts"))
		}
		return result
	}.property("subparts", "subparts.@each.previewParts"),

	displayParts: function () {
		var result = []
		var subparts = this.get("subparts")
		for (var i = 0; i < subparts.length; i++) {
			result = result.concat(subparts[i].get("displayParts"))
		}
		return result
	}.property("subparts", "subparts.@each.displayParts"),

	attachmentParts: function () {
		var result = []
		var subparts = this.get("subparts")
		for (var i = 0; i < subparts.length; i++) {
			result = result.concat(subparts[i].get("attachmentParts"))
		}
		return result
	}.property("subparts", "subparts.@each.attachmentParts"),
})
