Client.BoxRoute = Ember.Route.extend({
	model: function (param) {
		Ember.Logger.debug('Box param: ' + JSON.stringify(param));
		if(! param.box) {
			Ember.Logger.warn('Bad box value: Redirect to boxes');
			this.transitionTo('boxes');
			return;
		}
		
		return Ember.$.ajax({
			url: Client.REST_SERVER + '/boxes/' + param.box,
			type: 'GET',
			dataType: 'json'
		});
	}
});
