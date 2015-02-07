require('scripts/models/part');

Client.Model.BodyPart = Client.Model.Part.extend({

    content: null,
    encoding: '7bit',
    params: {},

    partID: function() {
        var data = this.get('data');
        return data == null ? null : data.partID;
    }.property('data')
});
