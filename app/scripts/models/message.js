require('scripts/models/part');

Client.Model.Message = function(json) {
	this.part = null;
	if(json.attrs && json.attrs.struct) {
		this.part = Client.Model.Part.createPart(json.attrs.struct);
	}

	this.envelope = null;
	if(json.attrs && json.attrs.envelope) {
		this.envelope = json.attrs.envelope;
	}

	this.date = null;
	if(json.attrs && json.attrs.date) {
		this.date = json.attrs.date;
	}

	this.uid = null;
	if(json.attrs && json.attrs.uid) {
		this.uid = json.attrs.uid;
	}

	this.seq = null;
	if(json.attrs && json.attrs.modseq) {
		this.seq = json.attrs.modseq;
	}

	this.flags = null;
	if(json.attrs && json.attrs.flags) {
		this.flags = json.attrs.flags;
	}
};

Client.Model.Message.prototype.hasAttachment = function() {
	if(!this.part) {
		return null; //Struct element has not been fetched
	}
	return this.part.hasAttachments();
};

Client.Model.Message.prototype.isSeen = function() {
	if(!this.flags) {
		return null; //flags element has not been fetched
	}
	return this.flags.indexOf('\\Seen') !== -1;
};
