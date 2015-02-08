Client.MessageRoute = Ember.Route.extend({
	model: function (param) {
		var box = this.modelFor('box');
        Ember.Logger.assert(box);
		var messageId = param.id;
        Ember.Logger.assert(messageId);
        
        return Client.ApiHelper.getMessage(box.path, messageId).then(function (message) {
            return Client.ApiHelper.downloadMessageDisplayContent(box.path, message).then(function () {
				return message;
			});
        });
	}
});