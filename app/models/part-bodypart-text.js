import Ember from "ember";
import BodyPart from "erizo-webmail/models/part-bodypart";

export default BodyPart.extend({
    decodedContent: function() {
        let content = this.get('content');
        let charset = (this.get('params').charset || '').toLowerCase();
        let encoding = this.get('encoding').toLowerCase();

        if(content == null) {
            return null;
        }
		
        //Decode model content
        content = window.atob(content);
		
		//Decode part
		try {
            if(encoding === 'quoted-printable') {
                content = quotedPrintable.decode(content);
            } else if(encoding === 'base64') {
                content = window.atob(content);
            }
        } catch(e) {
            Ember.Logger.warn('Failed to decode content: ' + content + '\n' + e);
        }
		
		//Convert the charset
        if(charset === 'utf-8') {
            try {
                content = utf8.decode(content);
            } catch(e) {
                Ember.Logger.warn('Failed to convert the utf8 charset : ' + content + '\n' + e);
            }
        }

        

        return content;
    }.property('encoding', 'content'),
	
	displayParts: function() {
        return [this];
    }.property('content'),
});
