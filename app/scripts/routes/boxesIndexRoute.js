Client.BoxesIndexRoute = Ember.Route.extend({
	beforeModel: function() {
		this.transitionTo('messages', 'INBOX');
	}
});