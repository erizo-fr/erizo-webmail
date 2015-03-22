import TextPart from "erizo-webmail/models/part-bodypart-text";

export default TextPart.extend({
    htmlMessage: function() {
        return this.get('decodedContent');
    }.property('decodedContent')
});
