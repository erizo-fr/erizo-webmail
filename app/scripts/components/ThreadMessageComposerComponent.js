Client.ThreadMessageComposerComponent = Ember.Component.extend({
    isWriteMode: false,
    isWriteModeReply: false,
    isWriteModeForward: false,
    isSubjectVisible: false,
    isCcVisible: false,
    isBccVisible: false,

    lastMessage: null,

    to: [],
    cc: [],
    bcc: [],
    subject: '',
    body: '',
    attachments: [],

    actions: {
        goToWriteModeReply: function () {
            var lastMessage = this.get('lastMessage');
            this.set('subject', 'RE: ' + lastMessage.envelope.subject);
            this.set('to', lastMessage.envelope.from);
            this.set('isWriteMode', true);
            this.set('isWriteModeReply', true);
            this.set('isWriteModeForward', false);
        },
        goToWriteModeForward: function () {
            var lastMessage = this.get('lastMessage');
            this.set('subject', 'FWD: ' + lastMessage.envelope.subject);
            this.set('to', []);
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
        },
        sendMessage: function () {
            var to = this.get('to');
            var cc = this.get('cc');
            var bcc = this.get('bcc');
            var subject = this.get('subject');
            var body = this.get('body');
            var attachments = this.get('attachments');

            Ember.Logger.info('Sending message: to=' + to + '\nsubject=' + subject + '\nbody=' + body);
            alert('Not implemented yet !');
        }
    }
});