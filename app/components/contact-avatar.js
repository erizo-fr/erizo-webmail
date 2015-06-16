import Ember from "ember"
import Gravatar from "erizo-webmail/utils/gravatar"

export default Ember.Component.extend({
	classNames: ["erizo-avatar", "erizo-avatar--circle"],

	avatarSrcUrl: function () {
		if (!this.get("model") || this.get("model.length") === 0) {
			// No avatar
			return Gravatar.getNoAvatarUrl()

		} else if (this.get("model.length") === 1) {
			// Single avatar
			let email = this.get("model")[0]
			return Gravatar.getAvatarUrlFromEmail(email)

		} else {
			// Multiple avatars
			// TODO: Generate multi avatar image. (Even if multi avatar should not occure so often)
			let email = this.get("model")[0]
			return Gravatar.getAvatarUrlFromEmail(email)

		}
	}.property("model"),
})
