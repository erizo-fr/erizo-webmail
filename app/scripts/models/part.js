Client.Model.Part = Ember.Object.extend({
	data: null,
	htmlMessage: null,
	textMessage: null,
	previewMessage: null,
	previewParts: null,
	displayParts: null,
	
	init: function() {
		this._super();
		this.set('previewParts', []);
		this.set('displayParts', []);
	},

	type: function() {
		var data = this.get('data');
		return data == null ? null : data.type;
	}.property('data'),

	disposition: function() {
		var data = this.get('data');
		return data == null ? null : data.disposition;
	}.property('data'),

	language: function() {
		var data = this.get('data');
		return data == null ? null : data.language;
	}.property('data'),

	location: function() {
		var data = this.get('data');
		return data == null ? null : data.location;
	}.property('data'),

	param: function() {
		var data = this.get('data');
		return data == null ? null : data.param;
	}.property('data'),

	isAttachment: function() {
		var disposition = this.get('disposition');
		return disposition && disposition.type === 'attachment';
	}.property('disposition'),

	hasAttachments: function() {
		var disposition = this.get('disposition');
		return disposition && disposition.type === 'attachment';
	}.property('disposition'),

	attachmentParts: function() {
		var isAttachment = this.get('isAttachment');
		if(isAttachment()) {
			return [this];
		} else {
			return [];
		}
	}.property('isAttachment')

});
