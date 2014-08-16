Client.BoxesRoute = Ember.Route.extend({
	model: function () {
		var self = this;
		return Ember.$.ajax({
			url: Client.REST_SERVER + '/boxes',
			type: 'GET',
			dataType: 'json'
		}).then(function(data) {
			var adaptedResult = self.adaptResult(data);
			return adaptedResult;
		});
	},
	
	adaptResult : function(result) {
		//Transform object to array
		var adaptedResult = [];
		for (var key in result) {
    		if (result.hasOwnProperty(key)) {
				var box = result[key];
				box.name = key;
				if(box.children !== null) {
					box.children = this.adaptResult(box.children);
				} else {
					delete box.chilren;
				}
				adaptedResult.push(box);
			}
		}
		return adaptedResult;
	},
	
	actions: {
		loading: function (transition, originRoute) {
			return true;
		}
	}
});