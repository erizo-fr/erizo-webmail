Client.MessageRoute = Ember.Route.extend({
	model: function (param) {
		var box = this.modelFor('box');
        Ember.Logger.assert(box);
		var messageId = param.id;
        Ember.Logger.assert(messageId);
        
        return Client.ApiHelper.getMessage(box.path, messageId);
	}
});