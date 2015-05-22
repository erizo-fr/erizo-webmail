import Ember from "ember";
import EmailAddress from "erizo-webmail/models/emailAddress";

//Factory
export default Ember.Object.extend({

    createEmail: function (email) {
        let data = {};
        let emailParts;
        if (typeof email === 'string') {
            emailParts = this.splitEmailString(email);
            data.mailbox = emailParts[0];
            data.host = emailParts[1];
        } else {
            data.name = email.name;
            if (email.address) {
                emailParts = this.splitEmailString(email.address);
                data.mailbox = emailParts[0];
                data.host = emailParts[1];
            } else {
                data.mailbox = email.mailbox;
                data.host = email.host;
            }
        }
        return EmailAddress.create(data);
    },

    createEmailArray: function (input) {
        if (input instanceof Array) {
            let result = [];
            let self = this;
            input.forEach(function (element) {
                result.push(self.createEmail(element));
            });
            return result;
        } else {
            return [this.createEmail(input)];
        }
    },

    splitEmailString: function (email) {
        let emailParts = email.split('@');
        if (emailParts.length !== 2) {
            throw 'An email address should contain one @ char';
        }
        return emailParts;
    }
}).create();