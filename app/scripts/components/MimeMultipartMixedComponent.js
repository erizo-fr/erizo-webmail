require('scripts/components/MimeMultipartComponent');

Client.MimeMultipartMixedComponent = Client.MimeMultipartComponent.extend({
	messageParts: function () {
		var part = this.get('model');
		if(part == null) {
			return null;
		}
		
		var messageParts = [];
		for(var i=0; i<part.subParts.length; i++) {
			var subPart = part.subParts[i];
			if(! subPart.isAttachment()) {
				messageParts.push(subPart);
			}
		}
		return messageParts;
	}.property('model'),
	
	attachmentParts: function () {
		var part = this.get('model');
		if(part.subParts == null) {
			return null;
		}
		
		var attachmentParts = [];
		for(var i=0; i<part.subParts.length; i++) {
			var subPart = part.subParts[i];
			if(subPart.isAttachment()) {
				attachmentParts.push(subPart);
			}
		}
		return attachmentParts;
	}.property('model'),
});