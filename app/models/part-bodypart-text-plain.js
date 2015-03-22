import TextPart from "erizo-webmail/models/part-bodypart-text";

export default TextPart.extend({
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
