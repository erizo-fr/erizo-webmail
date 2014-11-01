Client.MessageController = Ember.ObjectController.extend({
    needs: "box",
    
	actions: {
        deleteMessage: function() {
            Ember.Logger.debug('Action received: Delete message');
            
            //Get the box model
            var box = this.get('controllers.box.model');
            
            //Get the message id
            var message = this.get('model');
            Ember.Logger.info('Delete message#' + message.uid + ' in box#' + box.name);
            Ember.Logger.assert(message.uid !== undefined);
            Ember.Logger.assert(message.uid !== null);
                        
            var self = this;
			Ember.$.ajax({
				url: Client.REST_SERVER + '/boxes/' + box.name + '/messages/' + message.uid,
				type: 'DELETE'
			}).done(function (data, textStatus, jqXHR) {
				self.transitionToRoute('messages');
			}).fail(function (jqXHR, textStatus, errorThrown) {
				Ember.Logger.error('Failed to delete the message: ' + textStatus);
                Ember.Logger.warn('MessageController.deleteMessage failed: TODO');
			});
        }
	}
});