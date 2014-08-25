Client.MimeMixedComponent = Ember.Component.extend({
	model: null,
	parts: function () {
		var model = this.get('model');
		if (!model || model.length < 2) {
			return null;
		} else {
			return model.slice(1);
		}
	}.property('model'),
});