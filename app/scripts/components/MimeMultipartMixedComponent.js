require('scripts/components/MimeMultipartComponent');

Client.MimeMultipartMixedComponent = Client.MimeMultipartComponent.extend({
	messageParts: function () {
		var parts = this.get('parts');
		if(parts == null) {
			return null;
		}
		
		var messagesParts = [];
		for(var i=0; i<parts.length; i++) {
			var partInfo = parts[i][0];
			if(!partInfo.disposition || partInfo.disposition.type !== 'attachment') {
				messagesParts.push(parts[i]);
			}
		}
		return messagesParts;
	}.property('parts'),
	
	attachmentParts: function () {
		var parts = this.get('parts');
		if(parts == null) {
			return null;
		}
		
		var attachmentParts = [];
		for(var i=0; i<parts.length; i++) {
			var partInfo = parts[i][0];
			if(partInfo.disposition && partInfo.disposition.type === 'attachment') {
				attachmentParts.push(parts[i]);
			}
		}
		return attachmentParts;
	}.property('parts'),
});