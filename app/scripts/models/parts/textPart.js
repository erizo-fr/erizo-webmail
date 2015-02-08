require('scripts/models/parts/bodyPart');

Client.Model.TextPart = Client.Model.BodyPart.extend({
    decodedContent: function() {
        var content = this.get('content');
        var charset = (this.get('params').charset || '').toLowerCase();
        var encoding = this.get('encoding').toLowerCase();

        if(content == null) {
            return null;
        }

        //Decode the content
        var decodedContent = content;
        try {
            if(encoding === 'quoted-printable') {
                decodedContent = quotedPrintable.decode(content);
            } else if(encoding === 'base64') {
                decodedContent = window.atob(content);
            }
        } catch(e) {
            Ember.Logger.warn('Failed to decode content: ' + content + '\n' + e);
        }

        //Convert the charset
        var result = decodedContent;
        if(charset === 'utf-8') {
            try {
                result = utf8.decode(decodedContent);
            } catch(e) {
                Ember.Logger.warn('Failed to convert the utf8 charset : ' + decodedContent + '\n' + e);
            }
        }

        return result;
    }.property('encoding', 'content'),
	
	displayParts: function() {
        return [this];
    }.property('content'),
});
