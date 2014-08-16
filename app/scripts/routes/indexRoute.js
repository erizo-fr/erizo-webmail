Client.IndexRoute = Ember.Route.extend({
	beforeModel: function() {
		this.transitionTo('login');
	}
});
