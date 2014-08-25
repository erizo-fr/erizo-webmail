Client.Router.map(function () {
	this.route('login');
	this.route('logout');
	this.resource('boxes', {path: '/boxes'}, function() {
		this.resource('box', {path: '/:box'}, function() {
			this.resource('messages', {path: '/messages'}, function() {
				this.resource('message', {path: '/:id'}, function() {
				});
			});
		});
	});
});
