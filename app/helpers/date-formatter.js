import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function (value, input, output) {
    var date;
    if (input) {
        date = moment(value, input);
    } else {
        date = moment(value);
    }
    if (! date.isValid()) {
        return 'Invalid date';
    }

    
    var now = moment();
    if(! output) {
        if (date.isSame(lastDay, 'day')) {
            output = 'LT'; //8:30 PM
        } else {
            output = 'll'; //Sep 4 1986
        }
    } else if (output === 'message-list') {
        var lastDay = moment().subtract(1, 'day');
        if (date.isSame(lastDay, 'day') || date.isSame(now, 'day')) {
            output = 'LT'; //8:30 PM
        } else {
            output = 'll'; //Sep 4 1986
        }
    }
    
    return date.format(output);
});