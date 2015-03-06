require('scripts/models/email');

//Factory
Client.Model.Email.createEmail = function (email) {
    var data = {};
    if (typeof email === 'string') {
        var emailParts = Client.Model.Email.splitEmailString(email);
        data.mailbox = emailParts[0];
        data.host = emailParts[1];
        data.name = email;
    } else {
        data.name = email.name;
        if (email.address) {
            var emailParts = Client.Model.Email.splitEmailString(email.address);
            data.mailbox = emailParts[0];
            data.host = emailParts[1];
        } else {
            data.mailbox = email.mailbox;
            data.host = email.host;
        }
    }
    return Client.Model.Email.create(data);
};

Client.Model.Email.createEmailArray = function (input) {
    if (input instanceof Array) {
        var result = [];
        input.forEach(function (element) {
            result.push(Client.Model.Email.createEmail(element));
        });
        return result;
    } else {
        return [Client.Model.Email.createEmail(input)];
    }
};

Client.Model.Email.splitEmailString = function (email) {
    var emailParts = email.split('@');
    if (emailParts.length !== 2) {
        throw 'An email address should contain one @ char';
    }
    return emailParts;

};