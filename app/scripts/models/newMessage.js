Client.Model.NewMessage = Ember.Object.extend({
    from: null,
    to: null,
    cc: null,
    bcc: null,
    subject: null,
    htmlBody: null,
    textBody: null,
	
	init: function() {
		this._super();
		this.set('to', []);
		this.set('cc', []);
		this.set('bcc', []);
	}
});