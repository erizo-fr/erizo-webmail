import Ember from "ember";
import Message from "erizo-webmail/models/message";
import PartFactory from "erizo-webmail/models/factories/part";

//Factory
export default Ember.Object.extend({

	createMessage: function (json) {
		let data = {};
		if (json.attrs && json.attrs.struct) {
			data.part = PartFactory.createPart(json.attrs.struct);
		}

		if (json.attrs && json.attrs.envelope) {
			data.envelope = json.attrs.envelope;
		}

		if (json.attrs && json.attrs.date) {
			data.date = json.attrs.date;
		}

		if (json.attrs && json.attrs.uid) {
			data.uid = json.attrs.uid;
		}

		if (json.attrs && json.attrs.modseq) {
			data.seq = json.attrs.modseq;
		}

		if (json.attrs && json.attrs.flags) {
			data.flags = json.attrs.flags;
		}

		return Message.create(data);
	},

}).create();