import Ember from "ember"

export default Ember.Object.extend({
	file: null,
	displaySize: function () {
		if (!this.get("file")) {
			return "Unknown"
		} else {
			let size = this.get("file").size
			let unit = "B"

			// Transform to ko
			if (size > 1024) {
				size = size / 1024
				unit = "KB"
			}

			// Transform to mo
			if (size > 1024) {
				size = size / 1024
				unit = "MB"
			}

			// Transform to go
			if (size > 1024) {
				size = size / 1024
				unit = "GB"
			}

			return Math.round(size) + " " + unit
		}
		return this.get("part").hasAttachments()
	}.property("file"),
})
