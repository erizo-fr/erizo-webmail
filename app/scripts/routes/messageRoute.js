Client.MessageRoute = Ember.Route.extend({
	id: null,

	model: function (param) {
		//Get parent model
		var box = this.modelFor('box');
		this.set('id', param.id);

		var self = this;
		return Ember.$.ajax({
			url: Client.REST_SERVER + '/boxes/' + box.name + '/messages?fetchStruct=true&fetchEnvelope=true&markSeen=true&ids=' + param.id,
			type: 'GET',
			dataType: 'json'
		}).then(function (result) {
            //Extract the first message result
			if (result.length < 1) {
				Ember.Logger.warn('The server returns no result for message id#' + param.id + ' in box#' + box.name);
				return null;
			}
            
			//Download the parts displayed
			var message = new Client.Model.Message(result[0]);
			var neededParts = self.getNeededParts.call(self, message.part);
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
		var neededParts = [];
		if(part.isNeeded()) {
			Ember.Logger.debug('Needed part#' + part.info.partID);
			var downloadPromise = this.downloadPart(part);
			neededParts.push(downloadPromise);
		}
		
		for(var i=0; i<part.subParts.length; i++) {
			var neededSubparts = this.getNeededParts(part.subParts[i]);
			neededParts = neededParts.concat(neededSubparts);
		}
		return neededParts;
	},

	downloadPart: function (part) {
		if (!part.info.partID) {
			Ember.Logger.warn('No partID defined');
			return null;
		}
		//Get parent model
		var box = this.modelFor('box');
		var messageId = this.get('id');

        //Ask the server for the part content
		var self = this;
		part.content = null;
        part.decodedContent = null;
        Ember.Logger.info('Ask the server for part#' + part.info.partID + ' message#' + messageId + ' in box#' + box.name);
		return Ember.$.ajax({
			url: Client.REST_SERVER + '/boxes/' + box.name + '/messages?&markSeen=true&bodies=' + part.info.partID + '&ids=' + messageId,
			type: 'GET',
			dataType: 'json'
		}).then(function (result) {
			if (result.length < 1) {
				Ember.Logger.warn('The server returns no result for part#' + part.info.partID + ' message#' + messageId + ' in box#' + box.name);
				return null;
			}
			if (!result[0].bodies || !result[0].bodies[part.info.partID]) {
				Ember.Logger.warn('No bodies part for part#' + part.info.partID + ' message#' + messageId + ' in box#' + box.name);
				return null;
			}
            
            //Store the part in the model object
			part.content = result[0].bodies[part.info.partID];
			Ember.Logger.debug('Part#' + part.info.partID + ' message#' + messageId + ' in box#' + box.name + ' received. Length: ' + part.content.length);
			return part.content;
		});
	}
});