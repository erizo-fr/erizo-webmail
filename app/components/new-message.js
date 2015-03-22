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
            Api.sendMessage(this.get('newMessage'));

            //TODO: Handle errors

            //Close the new message
            this.sendAction('delete', this.get('newMessage'));
        },
        close: function () {
            this.sendAction('delete', this.get('newMessage'));
        }
    },
});