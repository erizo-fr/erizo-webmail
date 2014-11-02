var MESSAGE_PAGE_SIZE = 10;
var PAGINATION_MAX_PAGE_NUMBER = 5;

Client.MessagesIndexRoute = Ember.Route.extend({
	queryParams: {
		page: {
			refreshModel: true
		}
	},

	model: function (param) {
		//Get box
		var box = this.modelFor('box');
        Ember.Logger.assert(box);

		//Get page
        var pageNumber = param.page;
		Ember.Logger.debug('Page param: ' + pageNumber);
		if (!pageNumber || pageNumber < 1) {
			Ember.Logger.warn('Bad page value: Redirect to page 1');
			this.transitionTo({
				queryParams: {
					page: 1
				}
			});
			return;
		}

		//Compute numbers
		Ember.Logger.debug('Getting messages in box#' + box.path + ' page#' + pageNumber);
		var totalElements = box.messages.total;
		if (totalElements === 0) {
			return [];
		}
		var seqMax = Math.max(1, totalElements - MESSAGE_PAGE_SIZE * (pageNumber - 1));
		var seqMin = Math.max(1, seqMax - MESSAGE_PAGE_SIZE);
		
		//Request messages
		return Client.ApiHelper.getMessages(box.path, seqMin, seqMax).then(function (messages) {
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
				return key === 'messages' ? '[' + value.length + ']' : value;
			}, '\t'));
			return page;
		});
	},
});