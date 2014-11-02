Client.BoxesIndexRoute = Ember.Route.extend({
	beforeModel: function() {
		this.transitionTo('box', 'INBOX');
	}
});