Client.AccountRoute = Ember.Route.extend({
    model: function () {
        return Client.ApiHelper.getUserData();
    },

    actions: {
        /*
         * New message box
         */
        showNewMessageBox: function () {
            this.controllerFor('account').set('newMessage', {
                to: '',
                message: ''
            });
            this.controllerFor('account').set('newMessageIsVisible', true);
        },
        hideNewMessageBox: function () {
            this.controllerFor('account').set('newMessageIsVisible', false);
        },
        sendNewMessage: function () {
            Ember.Logger.debug('Action received: Send new message');

            var accountController = this.controllerFor('account');
            var message = accountController.get('newMessage');
            Client.ApiHelper.sendMessage(message)
                .done(function (data, textStatus, jqXHR) {
                    accountController.set('newMessageIsVisible', false);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    Ember.Logger.error('Failed to send the message: ' + textStatus);
                    accountController.send('showPopup', 'Send error', 'The server failed to send the message\n' + textStatus);
                });
        }

    }
});