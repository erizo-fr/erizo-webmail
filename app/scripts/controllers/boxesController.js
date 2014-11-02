Client.BoxesController = Ember.ObjectController.extend({
	newMessageIsVisible: false,
	newMessage: {
		from: '',
		to: '',
		subject: '',
		text: ''
	},

	actions: {
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
			
			
		}
	},

});