Client.MessagesIndexController = Ember.ObjectController.extend({
	needs: "box",

	currentPage: -1,
	pageSize: 10,
	isMessagesLoading: false,
	hasMorePages: false,

	actions: {
		loadMoreMessages: function() {
			this.loadMoreMessages();
		},
		deleteSelectedMessages: function() {
			Ember.Logger.debug('Action received: Delete selected messages');

			Ember.Logger.warn('TODO');
		}
	},

	loadMoreMessages: function() {
		if(this.get('isMessagesLoading')) {
			return;
		} else {
			this.set('isMessagesLoading', true);
		}

		//Get variables
		var box = this.get("controllers.box").get('model');
		var pageSize = this.get('pageSize');
		var currentPage = this.get('currentPage');
		var nextPage = currentPage + 1;
		var totalElements = box.messages.total;
		var totalPages = Math.ceil(totalElements / pageSize);

		if(currentPage >= totalPages) {
			Ember.Logger.info('Try to load more message (page#' + nextPage + ') but no more pages are available (totalPages: ' + totalPages + ')');
			this.set('hasMorePages', false);
			this.set('isMessagesLoading', false);
			return;
		}

		//Load the initial messages
		Ember.Logger.debug('Getting the message page#' + nextPage + '[' + pageSize + '] of box#' + box.path);
		var seqMax = Math.max(1, totalElements - pageSize * nextPage);
		var seqMin = Math.max(1, seqMax - pageSize + 1);
		var self = this;
		Client.ApiHelper.getMessages(box.path, seqMin, seqMax).then(function (newMessages) {
			//Concat the messages
			var messages = self.get('model');
			var newMessagesReversed = newMessages.reverse();
			self.set('model', messages.concat(newMessagesReversed));

			//Update var
			self.set('hasMorePages', nextPage < totalPages);
			self.set('currentPage', nextPage);
			self.set('isMessagesLoading', false);
		});
	}
});
