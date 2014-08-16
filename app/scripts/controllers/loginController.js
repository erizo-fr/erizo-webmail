Client.LoginController = Ember.ObjectController.extend({
	username: '',
	password: '',
	errorMessage: '',
	requestRunning: false,

	actions: {
		login: function () {
			this.beginRequestEvent();

			var self = this;
			Ember.$.ajax({
				url: Client.REST_SERVER + '/login',
				type: 'POST',
				data: {
					username: this.get('username'),
					password: this.get('password')
				},
			}).always(function () {
				self.endRequestEvent();
			}).done(function (data, textStatus, jqXHR) {
				self.transitionToRoute('boxes');
			}).fail(function (jqXHR, textStatus, errorThrown) {
				self.setErrorMessage(jqXHR.responseText);
			});
		}
	},

	beginRequestEvent: function () {
		this.setErrorMessage('');
		this.set('requestRunning', true);
		Ember.$('#loadingAnimation').removeClass().addClass('animated fadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
			Ember.$(this).removeClass();
		});
	},

	endRequestEvent: function () {
		Ember.$('#loadingAnimation').removeClass().addClass('animated fadeOut').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
			Ember.$(this).removeClass();
		});
		this.set('requestRunning', false);

	},

	setErrorMessage: function (errorMessage) {
		if (!errorMessage || errorMessage === '') {
			this.set('errorMessage', '');
			Ember.$(this).removeClass();
		} else {
			this.set('errorMessage', errorMessage);
			Ember.$('#errorMessage').removeClass().addClass('animated shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
				Ember.$(this).removeClass();
			});
		}
	}
});