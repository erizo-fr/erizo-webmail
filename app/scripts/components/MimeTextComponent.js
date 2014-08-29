Client.MimeTextComponent = Ember.Component.extend({
	model: null,
	content: function () {
		var model = this.get('model');
		if (!model) {
			return null;
		} 
		return model.decodeContent();
	}.property('model'),
});