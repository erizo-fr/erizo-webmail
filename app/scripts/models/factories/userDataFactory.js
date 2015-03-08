require('scripts/models/userData');
require('scripts/models/email');


//Factory
Client.Model.UserData.createUserData = function (data) {
	if (!data) {
		data = {};
	}

	return Client.Model.UserData.create(data);
};