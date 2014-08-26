Client.MimeTextHtmlComponent = Ember.Component.extend({
	model: null,
	content: function () {
		var model = this.get('model');
		if (!model) {
			return null;
		} else {
			if(model.length < 1) {
				Ember.Logger.warn('Mime Text model is a 0 length array !');
				return null;
			}
			return model[0].decodedContent;
		}
	}.property('model'),
});