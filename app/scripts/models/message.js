Client.Model.Message = function(json) {
	this.part = null;
	if(this.attrs && this.attrs.struct) {
		this.part = new Client.Model.Part(this.attrs.struct);
	}
}

Client.Model.Message.prototype.hasAttachment = function() {
	if(!this.part) {
		return null; //Struct element has not been fetched
	}
	
	return this.part.isAttachment() || this.part.hasAttachment();
};