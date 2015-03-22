import Ember from "ember";
import EmailFactory from "erizo-webmail/models/factories/email";
import NewMessage from "erizo-webmail/models/new-message";

export default Ember.ObjectController.extend({
    needs: ['account'],

    newMessages: [],

    createNewMessage: function () {
        var newMessage = NewMessage.create();
        newMessage.from = EmailFactory.createEmailArray(this.get('controllers.account.model.defaultIdentity'));
        this.get('newMessages').insertAt(0, newMessage);
    },

    actions: {
        deleteNewMessage: function (message) {
            this.get('newMessages').removeObject(message);
        }
    }
});