require('scripts/components/MimeMultipartComponent');

Client.MimeMultipartAlternativeComponent = Client.MimeMultipartComponent.extend({
	displayedPart: function () {
		var part = this.get('model');
		if (part == null) {
			return null;
		}
		if (part.subParts.length < 1) {
			return null;
		}

		//Sort by preference and return the first part
		return part.subParts.sort(function (partA, partB) {
			var partAType = partA.info.type;
			var partBType = partB.info.type;
			var partASubtype = partA.info.subtype;
			var partBSubtype = partB.info.subtype;
			
			var partATypeWeight = Client.conf.alternative.typeWeight[partAType] || 0;
			var partBTypeWeight = Client.conf.alternative.typeWeight[partBType] || 0;
			var partASubtypeWeight = Client.conf.alternative.subtypeWeight[partASubtype] || 0;
			var partBSubtypeWeight = Client.conf.alternative.subtypeWeight[partBSubtype] || 0;
			
			//Compare types
			if (partAType && !partBType) {
				return -1;
			}
			if (!partAType && partBType) {
				return 1;
			}
			
			if(partATypeWeight > partBTypeWeight) {
				return -1;
			} else if(partATypeWeight < partBTypeWeight) {
				return 1;
			}
			
			//Compare subtypes
			if (partASubtype && !partBSubtype) {
				return -1;
			}
			if (!partASubtype && partBSubtype) {
				return 1;
			}
			
			if(partASubtypeWeight > partBSubtypeWeight) {
				return -1;
			} else if(partASubtypeWeight < partBSubtypeWeight) {
				return 1;
			}
			
			return 0;
		})[0];
	}.property('parts'),
});