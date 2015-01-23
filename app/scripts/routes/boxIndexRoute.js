Client.BoxIndexRoute = Ember.Route.extend({
	beforeModel: function() {
		this.transitionTo('messages');
	}
});
