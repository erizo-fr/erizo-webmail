import Ember from "ember";
import Api from "erizo-webmail/utils/api";

export default Ember.Component.extend({
    newMessage: null,
    isOpen: true,

    title: function () {
        var subject = this.get('newMessage').get('subject');

        if (this.get('isOpen')) {
            return 'New message';
        } else {
            return subject ? subject : 'New message';
        }
    }.property('newMessage.subject', 'isOpen'),

    actions: {
        toggleHide: function () {
            this.set('isOpen', !this.get('isOpen'));
        },
        delete: function () {
            //TODO
        },
        sendMessage: function () {
            Ember.Logger.debug('Action received: Send new message');
			let self = this;
            Api.sendMessage(this.get('newMessage')).done(function () {
				//Show success
				Ember.$.snackbar({
					content: "Message sent !",
					timeout: 3000
				});

				//Close the new message
            	self.sendAction('delete', self.get('newMessage'));
			}).fail(function () {
				//Show error
				Ember.$.snackbar({
					content: "Failed to send the message :(<br/>Maybe you should try to send it later",
					style: 'error',
					timeout: 3000
				});
			});
        },
        close: function () {
            this.sendAction('delete', this.get('newMessage'));
        }
    },
});