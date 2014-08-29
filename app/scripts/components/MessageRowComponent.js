Client.MessageRowComponent = Ember.Component.extend({
	tagName: 'tr',
	model: null,
	
	isSeen: function () {
		var model = this.get('model');
		if(!model) {
			return null;
		}
		return model.isSeen();
	}.property('model'),
});