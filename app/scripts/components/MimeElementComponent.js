Client.MimeElementComponent = Ember.Component.extend({
	model: null,

	type: function () {
		var part = this.get('model');
		if (!part) {
			return null;
		} else {
			return part.info.type;
		}
	}.property('model'),
	
	subtype: function () {
		var part = this.get('model');
		if (!part) {
			return null;
		} else {
			return part.info.subtype;
		}
	}.property('model'),

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