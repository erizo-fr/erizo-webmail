Client.AccountController = Ember.ObjectController.extend({
    newMessageIsVisible: false,
    newMessage: {
        from: '',
        to: '',
        subject: '',
        text: ''
    }
});