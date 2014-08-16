Ember.Handlebars.helper('date-formatter', function(value, input, output) {
	var date;
	if(input) {
		date = moment(value, input);
	} else {
		date = moment(value);
	}
	if(date.isValid() !== true) {
		return 'Invalid date';
	}
	
	if(output) {
		return date.format(output);
	} else {
		return date.format('L');
	}
});