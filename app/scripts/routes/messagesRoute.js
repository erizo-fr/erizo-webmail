Client.MessagesRoute = Ember.Route.extend({
	model: function (param) {
		var self = this;
		return Ember.$.ajax({
			url: Client.REST_SERVER + '/boxes/' + param.box + '/messages?ids=1:3&bodies=TEXT&fetchEnvelope=true',
			type: 'GET',
			dataType: 'json'
		});
	},
	
	actions: {
		loading: function (transition, originRoute) {
			return true;
		}
	}
});