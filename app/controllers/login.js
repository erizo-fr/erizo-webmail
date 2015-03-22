import Ember from "ember";
import Api from "erizo-webmail/utils/api";

export default Ember.ObjectController.extend({
	username: '',
	password: '',
	errorMessage: '',
	requestRunning: false,

	actions: {
		login: function () {
			this.beginRequestEvent();

			var self = this;
            Api.login(this.get('username'), this.get('password'))
            .always(function () {
				self.endRequestEvent();
			}).done(function () {
				self.transitionToRoute('boxes');
			}).fail(function (jqXHR) {
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