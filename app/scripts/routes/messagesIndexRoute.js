var MESSAGE_PAGE_SIZE = 10;
var PAGINATION_MAX_PAGE_NUMBER = 5;

Client.MessagesIndexRoute = Ember.Route.extend({
	queryParams: {
		page: {
			refreshModel: true
		}
	},

	model: function (param) {
		//Get parent model
		var box = this.modelFor('box');

		//Get param
		Ember.Logger.debug('Messages param: ' + JSON.stringify(param));
		if (!param.page || param.page < 1) {
			Ember.Logger.warn('Bad page value: Redirect to page 1');
			this.transitionTo({
				queryParams: {
					page: 1
				}
			});
			return;
		}

		//Compute numbers
		Ember.Logger.debug('Getting messages in box#' + box.name + ' page#' + param.page);
		var totalElements = box.messages.total;
		if (totalElements === 0) {
			return [];
		}
		var seqMax = Math.max(1, totalElements - MESSAGE_PAGE_SIZE * (param.page - 1));
		var seqMin = Math.max(1, seqMax - MESSAGE_PAGE_SIZE);
		
		//Request messages
		return Ember.$.ajax({
			url: Client.REST_SERVER + '/boxes/' + box.name + '/messages?seqs=' + seqMin + ':' + seqMax + '&fetchEnvelope=true',
			type: 'GET',
			dataType: 'json'
		}).then(function(data) {
			var messages = [];
			for(var i=0; i<data.length; i++) {
				messages.push(new Client.Model.Message(data[i]));
			}
			return messages;
		}).then(function (messages) {
			var totalPages = Math.ceil(totalElements / MESSAGE_PAGE_SIZE);
			var page = {
				totalElements: totalElements,
				totalPages: totalPages,
				pageNumber: param.page,
				messages: messages.reverse(),
				isFirst: param.page === 1,
				isLast: param.page >= totalPages

			};
			Ember.Logger.debug('Returning message page: ' + JSON.stringify(page, function (key, value) {
				return key === 'messages' ? 'Omitted' : value;
			}, '\t'));
			return page;
		});
	},
});