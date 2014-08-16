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
	
	adaptResult : function(result, path) {
		//Transform object to array
		var adaptedResult = [];
		for (var key in result) {
    		if (result.hasOwnProperty(key)) {
				var box = result[key];
				box.name = key;
				if(path) {
					box.path = path + box.delimiter + box.name;
				} else {
					box.path = box.name;
				}
				if(box.children !== null) {
					box.children = this.adaptResult(box.children, box.path);
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