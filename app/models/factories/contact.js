import Ember from "ember";
import Contact from "erizo-webmail/models/contact";
import EmailAddressFactory from "erizo-webmail/models/factories/emailAddress";

//Factory
export default Ember.Object.extend({

	createContactFromVCard: function (vcard) {
		let data = {};

		if (vcard.email) {
			let emailObjects = [];
			Ember.$.each(vcard.email, function (index, email) {
				let emailObject = EmailAddressFactory.createEmail(email.value);
				emailObject.name = vcard.fn;
				emailObjects.push(emailObject);
			});
			data.email = emailObjects;
		}

		data.fn = vcard.fn;

		return Contact.create(data);
	},
}).create();