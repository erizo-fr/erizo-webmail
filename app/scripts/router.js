Client.Router.map(function () {
	this.route('login');
	this.route('logout');
	this.resource('boxes', {path: '/boxes'}, function() {
		this.resource('messages', {path: '/:box/messages'}, function() {
			this.resource('message', {path: '/:messageId'}, function() {
			});
		});
	});
});
