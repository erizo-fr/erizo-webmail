Client.ApplicationRoute = Ember.Route.extend({
	actions: {
		error: function (error, transition) {
			if (error && error.status === 401) {
				Ember.Logger.warn('The user is not authenticated. Redirection to login route');
				return this.transitionTo('login');
			}
		}
	}
});