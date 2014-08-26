Client.MessageRoute = Ember.Route.extend({
	id: null,

	model: function (param) {
		//Get parent model
		var box = this.modelFor('box');
		this.set('id', param.id);

		var self = this;
		return Ember.$.ajax({
			url: Client.REST_SERVER + '/boxes/' + box.name + '/messages?fetchStruct=true&fetchEnvelope=true&ids=' + param.id,
			type: 'GET',
			dataType: 'json'
		}).then(function (result) {
			//Extract the first message result
			if (result.length < 1) {
				Ember.Logger.warn('The server returns no result for message id#' + param.id + ' in box#' + box.name);
				return null;
			}
			return result[0];
		}).then(function (message) {
			//Download the parts displayed
			var neededParts = self.getNeededParts.call(self, message.attrs.struct);
			Ember.Logger.debug('Needed parts: ' + JSON.stringify(neededParts));
			return Ember.RSVP.all(neededParts).then(function (results) {
				Ember.Logger.debug('All needed part has been received (' + results.length + ')');
				return message;
			});
		});
	},

	afterModel: function (model) {
		if (model === null) {
			Ember.Logger.debug('Model is null: Transition to messages');
			this.transitionTo('messages');
		}
	},


	getNeededParts: function getNeededParts(part) {
		if (part instanceof Array) {
			var promises = [];
			for (var i = 0; i < part.length; i++) {
				var subPromises = getNeededParts.call(this, part[i]);
				promises = promises.concat(subPromises);
			}
			return promises;
		} else {
			if (this.isNeededPart(part)) {
				Ember.Logger.debug('Needed part#' + part.partID);
				return [this.downloadPart(part)];
			} else {
				return [];
			}
		}
	},

	isNeededPart: function (part) {
		if (part.type === 'text' && part.subtype === 'html') {
			return true;
		}
		return false;
	},

	downloadPart: function (part) {
		if (!part.partID) {
			Ember.Logger.warn('No partID defined');
			return null;
		}
		//Get parent model
		var box = this.modelFor('box');
		var id = this.get('id');

		var self = this;
		part.content = null;
		return Ember.$.ajax({
			url: Client.REST_SERVER + '/boxes/' + box.name + '/messages?bodies=' + part.partID + '&ids=' + id,
			type: 'GET',
			dataType: 'json'
		}).then(function (result) {
			if (result.length < 1) {
				Ember.Logger.warn('The server returns no result for part#' + part.partID + ' message#' + id + ' in box#' + box.name);
				return null;
			}
			if (!result[0].bodies || !result[0].bodies[part.partID]) {
				Ember.Logger.warn('No bodies part for part#' + part.partID + ' message#' + id + ' in box#' + box.name);
				return null;
			}
			part.content = result[0].bodies[part.partID];
			part.decodedContent = self.decodePartContent(part);

			Ember.Logger.debug('Part#' + part.partID + ' message#' + id + ' in box#' + box.name + ' received. Length: ' + part.content.length);
			return part.content;
		});
	},

	decodePartContent: function (part) {
		var result;
		//TODO: make an object with methods rather than this ugly pile of functions ;)
		if (part.encoding === 'quoted-printable') {
			result = quotedPrintable.decode(part.content);
		}

		if (part.params.charset === "UTF-8") {
			//TODO: Handler other charset
			result = decodeURIComponent(escape(result));
		}

		return result;
	}
});