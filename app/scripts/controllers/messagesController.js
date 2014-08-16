Client.MessagesController = Ember.ObjectController.extend({
	queryParams: ['page'],
	page: 1,
	
	actions: {
		gotoNextPage: function() {
			console.log('Action gotoNextPage');
			this.set('page', this.get('page') + 1);
		},
		gotoPreviousPage: function() {
			console.log('Action gotoPreviousPage');
			this.set('page', this.get('page') - 1);
		}
	}
});