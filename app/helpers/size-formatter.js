import Ember from "ember"

export default Ember.Helper.helper(function (param) {
	let size = param[0]
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
})
