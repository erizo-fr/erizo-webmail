require('scripts/models/part');

Client.Model.BodyPart = Client.Model.Part.extend({
	content: null,
	encoding: null,
	params: null,

	init: function () {
		this._super();
		this.set('encoding', '7bit');
		this.set('params', {});
	},

	partID: function () {
		var data = this.get('data');
		return data == null ? null : data.partID;
	}.property('data')
});