Client.BoxesIndexRoute = Ember.Route.extend({
	beforeModel: function() {
		//TODO: Check box existance (INBOX should always exist but ...)
		this.transitionTo('box', 'INBOX');
	}
});