Client.BoxesController = Ember.ObjectController.extend({
	newMessageIsVisible: false,
	newMessage: {
		to: '',
		message: ''
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
		sendNewMessage: function() {
			Ember.Logger.debug('Action received: Send new message');
			this.set('newMessageIsVisible', false);
		}
	},

});