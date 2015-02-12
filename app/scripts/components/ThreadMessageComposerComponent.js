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
			this.set('subject', 'RE: ' + this.get('lastMessage').envelope.subject);
			this.set('isWriteMode', true);
			this.set('isWriteModeReply', true);
			this.set('isWriteModeForward', false);
		},
		goToWriteModeForward: function () {
			this.set('subject', 'FWD: ' + this.get('lastMessage').envelope.subject);
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