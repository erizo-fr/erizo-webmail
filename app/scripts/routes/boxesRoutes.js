Client.BoxesRoute = Ember.Route.extend({
	model: function () {
		var self = this;
		return Ember.$.ajax({
			url: Client.REST_SERVER + '/boxes',
			type: 'GET',
			dataType: 'json'
		}).then(function(result) {
			return self.adaptResult(result);
		}).then(self.sortResult);
	},
	
	adaptResult : function adaptResult(result, path) {
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
					box.children = adaptResult(box.children, box.path);
				} else {
					delete box.chilren;
				}
				adaptedResult.push(box);
			}
		}
		return adaptedResult;
	},
	
	sortResult : function(result) {
		var sortedBoxes = result.sort(function(box1, box2) {
			if(box1 === null && box2 === null) {
				return 0;
			}
			if(box1 === null || box2 === null) {
				return box1 === null ? 1 : -1;
			}
			
			if(box1.name === box2.name) {
				return 0;
			}
			
			//Inbox first
			if(box1.name === 'INBOX') {
				return -1;
			}
			if(box2.name === 'INBOX') {
				return 1;
			}
			
			//Special attributes then
			if(box1.special_use_attrib && box2.special_use_attrib) {
				return box1.special_use_attrib > box2.special_use_attrib ? 1 : -1;
			}
			if(box1.special_use_attrib) {
				return -1;
			}
			if(box2.special_use_attrib) {
				return 1;
			}
			
			//Others
			return box1.name > box2.name ? 1 : -1;
		});
		
		return sortedBoxes;
	}
});