import Ember from "ember";

export default Ember.Route.extend({	
	setupController: function(controller) {
		controller.set('model', []);
		controller.set('currentPage', -1);
		controller.set('hasMorePages', true);
		controller.set('isMessagesLoading', false);
		controller.loadMoreMessages();
	}
});
