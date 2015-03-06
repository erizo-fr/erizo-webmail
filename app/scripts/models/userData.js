Client.Model.UserData = Ember.Object.extend({
	displayName: 'Me',
	identities: [],
	preferences: null,

	defaultIdentity: function () {
		var identities = this.get('identities');
		if (!identities || identities.length === 0) {
			return null;
		} else {
			return identities[0];
		}
	}.property('identities'),
});