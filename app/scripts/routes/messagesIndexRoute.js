Client.MessagesIndexRoute = Ember.Route.extend({
	model: function () {
		return [];
	},

	setupController: function(controller, model) {
		controller.set('model', model);
		controller.set('currentPage', -1);
		controller.set('hasMorePages', true);
		controller.set('isMessagesLoading', false);
		controller.loadMoreMessages();
	}
});
