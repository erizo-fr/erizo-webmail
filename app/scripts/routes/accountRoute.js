Client.AccountRoute = Ember.Route.extend({
    model: function () {
        return Client.ApiHelper.getUserData();
    },

    actions: {
        createNewMessage: function () {
            this.get('controller').createNewMessage();
        }
    }
});