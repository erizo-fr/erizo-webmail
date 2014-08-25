Client.NewMessageComponent = Ember.Component.extend({
	actions: {
		hide: function () {
			this.sendAction('hideAction');
		},
		send: function () {
			this.sendAction('sendMessageAction');
		}
	},
});