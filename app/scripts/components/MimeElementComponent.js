Client.MimeElementComponent = Ember.Component.extend({
	model: null,
	mime: function () {
		var model = this.get('model');
		if (!model || model.length === 0) {
			return null;
		} else {
			return model[0];
		}
	}.property('model'),

	type: function () {
		var mime = this.get('mime');
		if (!mime) {
			return null;
		} else {
			return mime.type;
		}
	}.property('mime'),
	
	subtype: function () {
		var mime = this.get('mime');
		if (!mime) {
			return null;
		} else {
			return mime.subtype;
		}
	}.property('mime'),

	isTypeMultipartAlternative: function () {
		return this.get('type') === 'alternative';
	}.property('type'),
	isTypeMultipartMixed: function () {
		return this.get('type') === 'mixed';
	}.property('type'),
	isTypeMultipartRelated: function () {
		return this.get('type') === 'related';
	}.property('type'),
	isTypeTextHtml: function () {
		return this.get('type') === 'text' && this.get('subtype') === 'html';
	}.property('type', 'subtype'),
	isTypeTextPlain: function () {
		return this.get('type') === 'text' && this.get('subtype') === 'plain';
	}.property('type', 'subtype')
});