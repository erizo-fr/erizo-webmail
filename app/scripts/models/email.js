Client.Model.Email = Ember.Object.extend({

    name: null,
    mailbox: null,
    host: null,

    address: function () {
        var mailbox = this.get('mailbox');
        var host = this.get('host');
        if (!mailbox || !host) {
            return null;
        } else {
            return mailbox + '@' + host;
        }
    }.property('mailbox', 'host'),

    displayName: function () {
        var name = this.get('name');
        if (name) {
            return name;
        } else {
            return this.get('address');
        }
    }.property('address', 'name'),

    toJSON: function () {
        return {
            name: this.get('name'),
            mailbox: this.get('mailbox'),
            host: this.get('host'),
            address: this.get('address'),
            displayName: this.get('displayName')
        };
    }
});