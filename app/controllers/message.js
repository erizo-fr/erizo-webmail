import Ember from "ember";
import Api from "erizo-webmail/utils/api";
import EmailFactory from "erizo-webmail/models/factories/email";
import NewMessage from "erizo-webmail/models/new-message";

export default Ember.ObjectController.extend({
    needs: ['box', 'account'],

    newMessage: null,

    init: function () {
		this._super.apply(this, arguments);
		
        var newMessage = NewMessage.create();
        newMessage.from =  EmailFactory.createEmailArray(this.get('controllers.account.model.defaultIdentity'));
        
        this.set('newMessage', newMessage);
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
            Api.deleteMessage(box.path, message.uid)
                .done(function () {
                    self.transitionToRoute('box');
                }).fail(function (jqXHR, textStatus) {
                    Ember.Logger.error('Failed to delete the message: ' + textStatus);
                    self.send('showPopup', 'Delete error', 'The server failed to delete the message\n' + textStatus);
                });
        },
        sendMessage: function () {
            Ember.Logger.debug('Action received: Send new message');
            Api.sendMessage(this.get('newMessage'));
			
			//TODO: Handle errors
			
			//Go the the boxes route
			this.transitionToRoute('boxes');
        }
    }
});