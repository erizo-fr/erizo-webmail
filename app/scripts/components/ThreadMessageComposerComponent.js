Client.ThreadMessageComposerComponent = Ember.Component.extend({
	isWriteMode: false,
	isWriteModeReply: false,
	isWriteModeForward: false,

	actions: {
		goToWriteModeReply: function () {
			this.set('isWriteMode', true);
			this.set('isWriteModeReply', true);
			this.set('isWriteModeForward', false);
		},
		goToWriteModeForward: function () {
			this.set('isWriteMode', true);
			this.set('isWriteModeReply', false);
			this.set('isWriteModeForward', true);
		}
	}
});
