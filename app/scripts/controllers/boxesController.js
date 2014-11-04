Client.BoxesController = Ember.ObjectController.extend({
	newMessageIsVisible: false,
	newMessage: {
		from: '',
		to: '',
		subject: '',
		text: ''
	},
    errorPopupTitle: '',
    errorPopupMessage: '',

	actions: {
        /*
         * New message box
         */
		showNewMessageBox: function () {
			this.set('newMessage', {
				to: '',
				message: ''
			});
			this.set('newMessageIsVisible', true);
		},
		hideNewMessageBox: function () {
			this.set('newMessageIsVisible', false);
		},
		sendNewMessage: function () {
			Ember.Logger.debug('Action received: Send new message');
			
			var message = this.get('newMessage');
			var self = this;
			Client.ApiHelper.sendMessage(message)
            .done(function (data, textStatus, jqXHR) {
				self.set('newMessageIsVisible', false);
			}).fail(function (jqXHR, textStatus, errorThrown) {
				Ember.Logger.error('Failed to send the message: ' + textStatus);
			});
			
			
		},
        
        /*
         * Error popup
         */
        showErrorPopup: function (title, message) {
            this.set('errorPopupTitle', title);
            this.set('errorPopupMessage', message);
            Ember.$('#error-popup-simple').foundation('reveal', 'open');
		},
		hideErrorPopup: function () {
			Ember.$('#error-popup-simple').foundation('reveal', 'close');
		},
	},

});