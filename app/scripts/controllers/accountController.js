Client.AccountController = Ember.ObjectController.extend({
    needs: ['account'],

    newMessages: [],

    createNewMessage: function () {
        var newMessage = Client.Model.NewMessage.create();
        newMessage.from = Client.Model.Email.createEmailArray(this.get('controllers.account.model.defaultIdentity'));
        this.get('newMessages').insertAt(0, newMessage);
    },

    actions: {
        deleteNewMessage: function (message) {
            this.get('newMessages').removeObject(message);
        }
    }
});