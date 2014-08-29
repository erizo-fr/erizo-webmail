Client.Model.Part = function (part, content) {
	if (part.length < 1) {
		throw new Error('The expected object is a array with at least 1 element');
	}

	//Create attributes
	this.info = part[0];
	this.content = content || null;
	this.subParts = [];

	//Create child sub parts
	var rawSubParts = part.slice(1);
	for (var i = 0; i < rawSubParts.length; i++) {
		var subPart = new Client.Model.Part(rawSubParts[i]);
		this.subParts.push(subPart);
	}
};

Client.Model.Part.prototype.isAttachment = function () {
	return this.info.disposition && this.info.disposition.type === 'attachment';
};

Client.Model.Part.prototype.hasAttachment = function () {
	for (var i = 0; i < this.subParts.length; i++) {
		if (this.subParts[i].isAttachment() || this.subParts[i].hasAttachment()) {
			return true;
		}
	}
	return false;
};

Client.Model.Part.prototype.isMultipart = function () {
	return this.type === 'mixed' || this.type === 'alternative' || this.type === 'related';
};

Client.Model.Part.prototype.isNeeded = function () {
	var type = this.info.type;
	var subtype = this.info.subtype;
	if (type === 'text' && subtype === 'html') {
		return true;
	} else if (type === 'text' && subtype === 'plain') {
		return true;
	}
	return false;
};

Client.Model.Part.prototype.decodeContent = function () {
	var result = this.content;

	//Decode specials MIME encoding
	if (this.info && this.info.encoding) {
		var encoding = this.info.encoding.toLowerCase();
		if (encoding === 'quoted-printable') {
			result = quotedPrintable.decode(this.content);
		} else if (encoding === 'base64') {
			result = window.atob(this.content);
		}
	}

	//Clear special characters
	try {
		result = decodeURIComponent(escape(result));
	} catch (err) {
		Ember.Logger.error('Failed to decode result: ' + err);
	}

	return result;
};