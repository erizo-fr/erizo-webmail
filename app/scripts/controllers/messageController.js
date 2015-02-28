Client.MessageController = Ember.ObjectController.extend({
    needs: "box",

    newMessage: null,

    init: function () {
        this.set('newMessage', Client.Model.NewMessage.create());
    },

    actions: {
        deleteMessage: function () {
            Ember.Logger.debug('Action received: Delete message');

            //Get the box model
            var box = this.get('controllers.box.model');

            //Get the message id
            var message = this.get('model');
            Ember.Logger.info('Delete message#' + message.uid + ' in box#' + box.path);

            var self = this;
            Client.ApiHelper.deleteMessage(box.path, message.uid)
                .done(function (data, textStatus, jqXHR) {
                    self.transitionToRoute('box');
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    Ember.Logger.error('Failed to delete the message: ' + textStatus);
                    self.send('showPopup', 'Delete error', 'The server failed to delete the message\n' + textStatus);
                });
        }
    }
});