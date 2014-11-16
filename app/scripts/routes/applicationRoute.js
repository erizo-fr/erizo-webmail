Client.ApplicationRoute = Ember.Route.extend({
    renderTemplate: function () {
        this.render('application');
        this.render('popup', {
            into: 'application',
            outlet: 'popup'
        });
    },

    actions: {
        error: function (error, transition) {
            if (error && error.status === 401) {
                Ember.Logger.warn('The user is not authenticated. Redirection to login route');
                return this.transitionTo('login');
            }
        },

        /*
         * Error popup
         */
        showPopup: function (title, message) {
            Ember.Logger.warn('showPopup(' + title +', ' + message + ')');
            this.controllerFor('popup').set('model', {title: title, message: message});
            Ember.$('#popup').foundation('reveal', 'open');
        },
        hidePopup: function () {
            Ember.$('#popup').foundation('reveal', 'close');
        }
    }
});