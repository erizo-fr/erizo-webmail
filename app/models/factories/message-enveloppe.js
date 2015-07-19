import Ember from "ember"
import MessageEnveloppe from "erizo-webmail/models/message-enveloppe"
import EmailAddressFactory from "erizo-webmail/models/factories/emailAddress"

export default Ember.Object.extend({
	create: function (data) {
		if (data.from) {
			data.from = EmailAddressFactory.createEmailArray(data.from)
		}

		if (data.sender) {
			data.sender = EmailAddressFactory.createEmailArray(data.sender)
		}

		if (data.to) {
			data.to = EmailAddressFactory.createEmailArray(data.to)
		}

		if (data.cc) {
			data.cc = EmailAddressFactory.createEmailArray(data.cc)
		}

		if (data.bcc) {
			data.bcc = EmailAddressFactory.createEmailArray(data.bcc)
		}

		if (data.replyTo) {
			data.replyTo = EmailAddressFactory.createEmailArray(data.replyTo)
		}

		return MessageEnveloppe.create(data)
	},
}).create()
