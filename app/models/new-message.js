import Ember from "ember";

export default Ember.Object.extend({
    from: null,
    to: null,
    cc: null,
    bcc: null,
    subject: null,
    htmlBody: null,
    textBody: null,

    init: function () {
        this._super();

        if (!this.cc) {
            this.cc = [];
        }
        if (!this.bcc) {
            this.bcc = [];
        }
        if (!this.to) {
            this.to = [];
        }
    }
});