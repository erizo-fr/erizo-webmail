Client.BoxRoute = Ember.Route.extend({
	model: function (param) {
		var boxPath = param.box;
        Ember.Logger.assert(boxPath);
        
        return Client.ApiHelper.getBox(boxPath);
	}
});
