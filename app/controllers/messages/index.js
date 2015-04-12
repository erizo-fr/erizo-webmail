import Ember from "ember";
import Api from "erizo-webmail/utils/api";

export default Ember.ObjectController.extend({
	needs: ['messages', 'box'],

	messageCategories: [],

	currentPage: -1,
	pageSize: 10,
	isMessagesLoading: false,
	hasMorePages: false,

	init: function () {
		this._super.apply(this, arguments);

		var windowHeight = Ember.$(window).height();
		Ember.Logger.debug('Windows height: ' + windowHeight);
		var pageSize = Math.floor((windowHeight - 150) / 35);
		Ember.Logger.debug('pageSize: ' + pageSize);
		this.set('pageSize', pageSize);
	},

	actions: {
		loadMoreMessages: function () {
			this.loadMoreMessages();
		},
		deleteSelectedMessages: function () {
			Ember.Logger.debug('Action received: Delete selected messages');

			Ember.Logger.warn('TODO');
		}
	},

	loadMoreMessages: function () {
		if (this.get('isMessagesLoading')) {
			return;
		} else {
			this.set('isMessagesLoading', true);
		}

		//Get variables
		var messagesOrder = this.get('controllers.messages.model');
		var box = this.get('controllers.box.model');
		var pageSize = this.get('pageSize');
		var currentPage = this.get('currentPage');
		var nextPage = currentPage + 1;
		var totalElements = box.messages.total;
		var lastPage = Math.ceil(totalElements / pageSize) - 1;

		if (currentPage >= lastPage) {
			Ember.Logger.info('Try to load more message (page#' + nextPage + ') but no more pages are available (lastPage: ' + lastPage + ')');
			this.set('hasMorePages', false);
			this.set('isMessagesLoading', false);
			return;
		}

		//Load the initial messages
		Ember.Logger.debug('Getting the message page#' + nextPage + '[' + pageSize + '] of box#' + box.path);
		var idMin = Math.max(0, nextPage * pageSize);
		var idMax = Math.min(totalElements - 1, idMin + pageSize) + 1;
		var self = this;
		var ids = messagesOrder.slice(idMin, idMax);
		Api.getMessagesByIds(box.path, ids).then(function (newMessages) {
			Api.downloadMessagesPreview(box.path, newMessages).then(function () {
				var messageCategories = self.get('model');

				var getCategory = function (categoryKey) {
					var i;
					for (i = 0; i < messageCategories.length; i++) {
						if (messageCategories[i].key === categoryKey) {
							return messageCategories[i];
						}
					}

					//Create category
					var category = {
						key: categoryKey,
						messages: []
					};
					if (categoryKey === 'TODAY') {
						category.label = 'Today';
					} else if (categoryKey === 'LAST_DAY') {
						category.label = 'Yesterday';
					} else if (categoryKey === 'WEEK') {
						category.label = 'This week';
					} else if (categoryKey === 'LAST_WEEK') {
						category.label = 'Last week';
					} else if (categoryKey === 'MONTH') {
						category.label = 'This month';
					} else if (categoryKey === 'LAST_MONTH') {
						category.label = 'Last month';
					} else {
						category.label = categoryKey;
					}

					messageCategories.pushObject(category);
					return category;
				};

				var getMessageDateCategory = function (message) {
					var messageDate = moment(message.date);
					var now = moment();
					var lastDay = moment().subtract(1, 'day');
					var lastWeek = moment().subtract(7, 'day');
					var lastMonth = moment().subtract(1, 'month');

					if (messageDate.isSame(now, 'day')) {
						return 'TODAY';
					} else if (messageDate.isSame(lastDay, 'day')) {
						return 'LAST_DAY';
					} else if (messageDate.isSame(now, 'week')) {
						return 'WEEK';
					} else if (messageDate.isSame(lastWeek, 'week')) {
						return 'LAST_WEEK';
					} else if (messageDate.isSame(now, 'month')) {
						return 'MONTH';
					} else if (messageDate.isSame(lastMonth, 'month')) {
						return 'LAST_MONTH';
					} else {
						return messageDate.format('MMM YYYY');
					}
				};

				var insertMessage = function (message) {
					var messageDateCategory = getMessageDateCategory(message);
					var messageCategory = getCategory(messageDateCategory);
					messageCategory.messages.pushObject(message);
				};

				//Insert the messages
				var newMessagesReversed = newMessages.reverse();
				Ember.$.each(newMessagesReversed, function (index, value) {
					insertMessage(value);
				});

				//Update var
				self.set('model', messageCategories);
				self.set('hasMorePages', nextPage < lastPage);
				self.set('currentPage', nextPage);
				self.set('isMessagesLoading', false);
			});
		});
	}
});