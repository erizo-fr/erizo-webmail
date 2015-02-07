require('scripts/models/parts/textPart');

Client.Model.TextPlainPart = Client.Model.TextPart.extend({
    textMessage: function() {
        return this.get('decodedContent');
    }.property('decodedContent'),

    previewParts: function() {
        return this;
    }.property('decodedContent'),

    previewMessage: function() {
        var content = this.get('decodedContent');
        if(content == null) {
            return null;
        } else {
            return content.replace('/[\n\r]/g', ' ');
        }
    }.property('decodedContent'),
});
