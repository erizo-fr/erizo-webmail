import Ember from "ember";
import EmailFactory from "erizo-webmail/models/factories/email";

export default Ember.Component.extend({
    classNames: ['media-body'],
    
    isWriteModeReply: false,
    isWriteModeForward: false,
    isSubjectVisible: false,
    isCcVisible: false,
    isBccVisible: false,

    lastMessage: null,
    newMessage: null,

    isWriteMode: function() {
        if(this.get('isNewMessage')) {
            return true;
        } else {
            return this.get('isWriteModeReply') || this.get('isWriteModeForward');
        }
    }.property('isWriteModeReply', 'isWriteModeForward', 'isNewMessage'),
    
    isNewMessage: function () {
        return !this.get('lastMessage');
    }.property('lastMessage'),

    actions: {
        goToWriteModeReply: function () {
            var lastMessage = this.get('lastMessage');
            var newMessage = this.get('newMessage');
            newMessage.set('subject', 'RE: ' + lastMessage.envelope.subject);
            newMessage.set('to', EmailFactory.createEmailArray(lastMessage.envelope.from));
            this.set('isWriteModeReply', true);
            this.set('isWriteModeForward', false);
        },
        goToWriteModeForward: function () {
            var lastMessage = this.get('lastMessage');
            var newMessage = this.get('newMessage');
            newMessage.set('subject', 'FWD: ' + lastMessage.envelope.subject);
            newMessage.set('to', []);
            this.set('isWriteModeReply', false);
            this.set('isWriteModeForward', true);
        },
        showSubject: function () {
            this.set('isSubjectVisible', true);
        },
        showCc: function () {
            this.set('isCcVisible', true);
        },
        showBcc: function () {
            this.set('isBccVisible', true);
        }
    }
});