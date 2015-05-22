import Ember from "ember";
import EmailAddressFactory from "erizo-webmail/models/factories/emailAddress";
import NewMessage from "erizo-webmail/models/new-message";

export default Ember.ObjectController.extend({
    needs: ['account'],

    newMessages: [],

    createNewMessage: function () {
        var newMessage = NewMessage.create();
        newMessage.from = EmailAddressFactory.createEmailArray(this.get('controllers.account.model.defaultIdentity'));
        this.get('newMessages').insertAt(0, newMessage);
    },

    actions: {
        deleteNewMessage: function (message) {
            this.get('newMessages').removeObject(message);
        }
    }
});