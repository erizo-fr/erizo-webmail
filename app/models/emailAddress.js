import Ember from "ember"

export default Ember.Object.extend({
	name: null,
	mailbox: null,
	host: null,

	address: function () {
		var mailbox = this.get("mailbox")
		var host = this.get("host")
		if (!mailbox || !host) {
			return null
		} else {
			return mailbox + "@" + host
		}
	}.property("mailbox", "host"),

	displayName: function () {
		var name = this.get("name")
		if (name && name !== "") {
			return name
		} else {
			return this.get("address")
		}
	}.property("address", "name"),

	hasName: function () {
		return this.get("name") && this.get("name").length > 0
	}.property("name"),

	toJSON: function () {
		return {
			name: this.get("name"),
			mailbox: this.get("mailbox"),
			host: this.get("host"),
			address: this.get("address"),
			displayName: this.get("displayName"),
		}
	},

	// Validities
	mailboxValidity: function () {
		var field = this.get("mailbox")
		return field && field !== ""
	}.property("mailbox"),

	hostValidity: function () {
		var field = this.get("host")
		return field && field !== ""
	}.property("host"),

	addressValidity: function () {
		var field = this.get("address")
		return field && field !== ""
	}.property("address"),

	isValid: function () {
		return this.get("addressValidity")
	}.property("addressValidity"),
})
