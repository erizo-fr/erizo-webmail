Client.LoginController = Ember.ObjectController.extend({
	username: '',
	password: '',
	errorMessage: '',

	actions: {
		login: function() {
			this.set('errorMessage', '');

			var self = this;
			Ember.$.ajax({
				url: Client.REST_SERVER + '/login',
				type: 'POST',
				data : {username : this.get('username'), password : this.get('password')},
			}).done(function(data, textStatus, jqXHR) {
				self.transitionToRoute('boxes');
			}).fail(function(jqXHR, textStatus, errorThrown) {
				self.set('errorMessage', jqXHR.responseText);
			});
		}
	}
});
