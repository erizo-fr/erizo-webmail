require('scripts/models/part');
require('scripts/models/parts/*');
require('scripts/models/multiparts/*');

//Factory
Client.Model.Part.createPart = function(data) {
    if(data.length === 1) {
        return Client.Model.Part.createBodyPart(data[0]);
    } else {
        return Client.Model.Part.createMultiPart(data[0], data.slice(1));
    }
};


Client.Model.Part.createBodyPart = function(data) {
    if(data.type === 'text' && data.subtype === 'html') {
        return Client.Model.TextHtmlPart.create(data);
    } else if(data.type === 'text' && data.subtype === 'plain') {
        return Client.Model.TextPlainPart.create(data);
    } else {
        return Client.Model.Part.create(data);
    }
};

Client.Model.Part.createMultiPart = function(data, subpartData) {
    var subparts = [];
    for(var i=0; i<subpartData.length; i++) {
        subparts[i] = Client.Model.Part.createPart(subpartData[i]);
    }

    data.subparts = subparts;
    if(data.type === 'related') {
        return Client.Model.MultiPartRelated.create(data);
    } else {
        return Client.Model.MultiPart.create(data);
    }
};
