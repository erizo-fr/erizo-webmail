Client.Model.Email = Ember.Object.extend({

	name: null,
	mailbox: null,
	host: null,

	address: function () {
		var mailbox = this.get('mailbox');
		var host = this.get('host');
		if (mailbox === null || host === null) {
			return null;
		} else {
			return mailbox + '@' + host;
		}
	}.property('mailbox', 'host'),

	displayName: function () {
		var name = this.get('name');
		if (name !== null) {
			return name;
		} else {
			return this.get('address');
		}
	}.property('address', 'name'),
});