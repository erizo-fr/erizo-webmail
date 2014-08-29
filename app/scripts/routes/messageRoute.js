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
            
			//Download the parts displayed
			var message = result[0];
			var neededParts = self.getNeededParts.call(self, message.attrs.struct);
			return Ember.RSVP.all(neededParts).then(function (results) {
				Ember.Logger.debug('All needed part has been received (' + results.length + ')');
				return message;
			});
		});
	},

	afterModel: function (model) {
		if (model === null) {
			Ember.Logger.debug('Model is null: Transition to messages route');
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
		} else if (part.type === 'text' && part.subtype === 'plain') {
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

        //Ask the server for the part content
		var self = this;
		part.content = null;
        part.decodedContent = null;
        Ember.Logger.info('Ask the server for part#' + part.partID + ' message#' + id + ' in box#' + box.name);
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
            
            //Store the part in the model object
			part.content = result[0].bodies[part.partID];
			part.decodedContent = self.decodePartContent(part);
			Ember.Logger.debug('Part#' + part.partID + ' message#' + id + ' in box#' + box.name + ' received. Length: ' + part.content.length);
			return part.content;
		});
	},

	decodePartContent: function (part) {
		var result = part.content;

        //Decode specials MIME encoding
        if(part.encoding) {
            var encoding = part.encoding.toLowerCase();
            if (encoding === 'quoted-printable') {
                result = quotedPrintable.decode(part.content);
            } else if(encoding === 'base64') {
                result = window.atob(part.content);
            }
        }

        //Clear special characters
		try {
        	result = decodeURIComponent(escape(result));
		} catch(err) {
			Ember.Logger.error('Failed to decode result: ' + err);
		}

		return result;
	}
});