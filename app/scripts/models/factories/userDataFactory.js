require('scripts/models/userData');
require('scripts/models/email');


//Factory
Client.Model.UserData.createUserData = function (data) {
	if (!data) {
		data = {};
	}
	if (data.identities) {
		data.identities = Client.Model.Email.createEmailArray(data.identities);
	}

	return Client.Model.UserData.create(data);
};