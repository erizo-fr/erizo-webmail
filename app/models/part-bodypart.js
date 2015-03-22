import Part from "erizo-webmail/models/part";


export default Part.extend({
	content: null,
	encoding: null,
	params: null,

	partID: function () {
		var data = this.get('data');
		return data == null ? null : data.partID;
	}.property('data')
});