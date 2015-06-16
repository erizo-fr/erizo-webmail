import Ember from "ember"

let gravatarStyle = "identicon"
let gravatarUrl = "//www.gravatar.com/avatar/"
let gravatarOptions = "d=" + gravatarStyle

export default Ember.Object.extend({
	getGravatarHashFromEmail: function (email) {
		// Get email string
		Ember.Logger.assert(email)
		let emailString = email.get("address")
		Ember.Logger.assert(emailString)

		// Create the hash
		emailString = emailString.trim()
		emailString = emailString.toLowerCase()
		return CryptoJS.MD5(emailString)
	},

	getAvatarUrlFromEmail: function (email) {
		Ember.Logger.assert(email)

		let hash = this.getGravatarHashFromEmail(email)
		return gravatarUrl + hash + "?" + gravatarOptions
	},

	getNoAvatarUrl: function () {
		return gravatarUrl + "?d=mm"
	},
}).create()
