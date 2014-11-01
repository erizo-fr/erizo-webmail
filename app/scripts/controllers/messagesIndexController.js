Client.MessagesIndexController = Ember.ObjectController.extend({
	queryParams: ['page'],
	page: 1,

	actions: {
		gotoNextPage: function () {
			var pageMax = this.get('model').totalPages;
			var newPage = Math.min(this.get('page') + 1, pageMax);
			this.set('page', newPage);
		},
		gotoPreviousPage: function () {
			var pageMin = 1;
			var newPage = Math.max(this.get('page') - 1, pageMin);
			this.set('page', newPage);
		},
        deleteSelectedMessages: function() {
            Ember.Logger.debug('Action received: Delete selected messages');
            
            Ember.Logger.warn('TODO');
        }
	}
});