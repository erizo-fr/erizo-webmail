import Ember from "ember";
import Api from "erizo-webmail/utils/api";

export default Ember.Route.extend({
	model: function (param) {
		var box = this.modelFor('box');
        Ember.Logger.assert(box);
		var messageId = param.id;
        Ember.Logger.assert(messageId);
        
        return Api.getMessage(box.path, messageId).then(function (message) {
            return Api.downloadMessageDisplayContent(box.path, message).then(function () {
				return message;
			});
        });
	}
});