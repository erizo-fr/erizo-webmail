var MESSAGE_PAGE_SIZE = 10;
var PAGINATION_MAX_PAGE_NUMBER = 5;

Client.MessagesRoute = Ember.Route.extend({
	queryParams: {
		page: {
			refreshModel: true
		}
	},

	model: function (param) {
		var pageNumber = param.page;
		var totalElements = 0;

		var self = this;
		return Ember.$.ajax({
			url: Client.REST_SERVER + '/boxes/' + param.box,
			type: 'GET',
			dataType: 'json'
		}).then(function (data) {
			var totalElements = data.messages.total;
			if (totalElements === 0) {
				return [];
			}

			var messageSeqMin = totalElements - MESSAGE_PAGE_SIZE;
			if (messageSeqMin < 0) {
				messageSeqMin = 1;
			}
			return Ember.$.ajax({
				url: Client.REST_SERVER + '/boxes/' + param.box + '/messages?ids=' + totalElements + ':' + messageSeqMin + '&bodies=TEXT&fetchEnvelope=true',
				type: 'GET',
				dataType: 'json'
			});
		}).then(function (data) {
			var totalPages = Math.floor(totalElements / MESSAGE_PAGE_SIZE);
			return {
				totalElements: totalElements,
				totalPages: totalPages,
				pageNumber: pageNumber,
				messages: data.reverse(),
				isFirst: pageNumber === 1,
				isLast: pageNumber === totalPages

			};
		});
	}
});