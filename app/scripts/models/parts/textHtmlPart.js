require('scripts/models/parts/textPart');


Client.Model.TextHtmlPart = Client.Model.TextPart.extend({
    htmlMessage: function() {
        return this.get('decodedContent');
    }.property('decodedContent')
});
