require('scripts/models/email');

//Factory
Client.Model.Email.createEmail = function (email) {
	if (typeof email === 'string') {
		var emailParts = Client.Model.Email.splitEmailString(email);
		var data = {
			mailbox: emailParts[0],
			host: emailParts[1]
		};
		return Client.Model.Email.create(data);
	} else {
		if(email.address) {
			var emailParts = Client.Model.Email.splitEmailString(email.address);
			email.mailbox = emailParts[0];
			email.host = emailParts[1];
		}
		return Client.Model.Email.create(email);
	}
};

Client.Model.Email.splitEmailString = function (email) {
	var emailParts = email.split('@');
	if (emailParts.length !== 2) {
		throw 'An email address should contain one @ char';
	}
	return emailParts;

};