Client.ThreadMessageComposerComponent = Ember.Component.extend({
    isWriteMode: false,
    isWriteModeReply: false,
    isWriteModeForward: false,
    isSubjectVisible: false,
    isCcVisible: false,
    isBccVisible: false,

    lastMessage: null,

    newMessage: null,

    actions: {
        goToWriteModeReply: function () {
            var lastMessage = this.get('lastMessage');
            var newMessage = this.get('newMessage');
            newMessage.set('subject', 'RE: ' + lastMessage.envelope.subject);
            newMessage.set('to', Client.Model.Email.createEmailArray(lastMessage.envelope.from));
            this.set('isWriteMode', true);
            this.set('isWriteModeReply', true);
            this.set('isWriteModeForward', false);
        },
        goToWriteModeForward: function () {
            var lastMessage = this.get('lastMessage');
            var newMessage = this.get('newMessage');
            newMessage.set('subject', 'FWD: ' + lastMessage.envelope.subject);
            newMessage.set('to', []);
            this.set('isWriteMode', true);
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