var MESSAGE_PAGE_SIZE = 10;
var PAGINATION_MAX_PAGE_NUMBER = 5;

Client.MessagesRoute = Ember.Route.extend({
	queryParams: {
		page: {
			refreshModel: true
		}
	},

	model: function (param) {
		Ember.Logger.debug('Message param: ' + JSON.stringify(param));
		if(! param.page || param.page < 1) {
			Ember.Logger.warn('Bad page value: Redirect to page 1');
			this.transitionTo({queryParams: {page: 1}});
			return;
		}
		var totalElements = 0;

		var self = this;
		Ember.Logger.debug('Getting messages in box#' + param.box + ' page#' + param.page);
		return Ember.$.ajax({
			url: Client.REST_SERVER + '/boxes/' + param.box,
			type: 'GET',
			dataType: 'json'
		}).then(function (data) {
			totalElements = data.messages.total;
			if (totalElements === 0) {
				return [];
			}

			var seqMax = Math.max(1, totalElements - MESSAGE_PAGE_SIZE * (param.page - 1));
			var seqMin = Math.max(1, seqMax - MESSAGE_PAGE_SIZE);
			return Ember.$.ajax({
				url: Client.REST_SERVER + '/boxes/' + param.box + '/messages?ids=' + seqMax + ':' + seqMin + '&bodies=TEXT&fetchEnvelope=true',
				type: 'GET',
				dataType: 'json'
			});
		}).then(function (data) {
			var totalPages = Math.ceil(totalElements / MESSAGE_PAGE_SIZE);
			var page = {
				totalElements: totalElements,
				totalPages: totalPages,
				pageNumber: param.page,
				messages: data.reverse(),
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