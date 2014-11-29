Client.BoxesRoute = Ember.Route.extend({
	model: function () {
		return Client.ApiHelper.getBoxes();
	}
});