import Ember from "ember";
import UserDataFactory from "erizo-webmail/models/factories/user-data";
import Message from "erizo-webmail/models/message";
import DataCacheUtil from "erizo-webmail/utils/dataCache";

var REST_SERVER = '';

export default Ember.Object.extend({

	//#####################################################
	// Get user data
	// URL: GET /userdata
	//#####################################################

	getUserData: function () {
		Ember.Logger.debug('getUserData()');
		return Ember.$.ajax({
			url: REST_SERVER + '/account/data',
			type: 'GET',
			dataType: 'json'
		}).then(function (result) {
			return UserDataFactory.createUserData(result);
		});
	},

	//#####################################################
	// Get boxes
	// URL: GET /boxes
	//#####################################################

	getBoxes: function () {
		Ember.Logger.debug('getBoxes()');
		let self = this;
		return Ember.$.ajax({
				url: REST_SERVER + '/boxes',
				type: 'GET',
				dataType: 'json'
			}).then(function (boxes) {
				return self.getBoxesAdapter(boxes);
			}).then(self.getBoxesSorter)
			.then(self.getBoxesResultLogger);
	},

	getBoxesAdapter: function (boxes, path) {
		//Transform object to array
		var adaptedBoxes = [];
		if (boxes) {
			for (var boxName in boxes) {
				if (boxes.hasOwnProperty(boxName)) {
					var box = boxes[boxName];
					box.name = boxName;
					box.path = path === undefined ? box.name : path + box.name;
					box.children = this.getBoxesAdapter(box.children, box.path + box.delimiter);

					adaptedBoxes.push(box);
				}
			}
		}
		return adaptedBoxes;
	},

	getBoxesSorter: function (boxes) {
		var sortedBoxes = boxes.sort(function (box1, box2) {
			if (box1 === null && box2 === null) {
				return 0;
			}
			if (box1 === null || box2 === null) {
				return box1 === null ? 1 : -1;
			}

			if (box1.name === box2.name) {
				return 0;
			}

			//Inbox first
			if (box1.name === 'INBOX') {
				return -1;
			}
			if (box2.name === 'INBOX') {
				return 1;
			}

			//Special attributes then
			if (box1.special_use_attrib && box2.special_use_attrib) {
				return box1.special_use_attrib > box2.special_use_attrib ? 1 : -1;
			}
			if (box1.special_use_attrib) {
				return -1;
			}
			if (box2.special_use_attrib) {
				return 1;
			}

			//Others
			return box1.name > box2.name ? 1 : -1;
		});

		return sortedBoxes;
	},

	getBoxesResultLogger: function (boxes) {
		Ember.Logger.debug('boxes=' + JSON.stringify(boxes));
		return boxes;
	},



	//#####################################################
	// Get box
	// URL: GET /boxes/:boxPath
	//#####################################################

	getBox: function (boxPath) {
		Ember.Logger.debug('getBox(' + boxPath + ')');
		Ember.Logger.assert(boxPath);
		let self = this;

		return Ember.$.ajax({
			url: REST_SERVER + '/boxes/' + boxPath,
			type: 'GET',
			dataType: 'json'
		}).then(function (box) {
			box.path = boxPath;
			return box;
		}).then(self.getBoxResultLogger);
	},

	getBoxResultLogger: function (box) {
		Ember.Logger.debug('box=' + JSON.stringify(box));
		return box;
	},


	//#####################################################
	// Get box order
	// URL: GET /boxes/:boxPath/order
	//#####################################################

	getBoxOrder: function (boxPath) {
		Ember.Logger.debug('getBoxOrder(' + boxPath + ')');
		Ember.Logger.assert(boxPath);
		let self = this;

		return Ember.$.ajax({
			url: REST_SERVER + '/boxes/' + boxPath + '/order',
			type: 'GET',
			dataType: 'json'
		}).then(self.getBoxOrderResultLogger);
	},

	getBoxOrderResultLogger: function (order) {
		Ember.Logger.debug('boxOrder=' + JSON.stringify(order));
		return order;
	},


	//#####################################################
	// Get messages
	// URL: GET /boxes/:boxPath/messages
	//#####################################################

	getMessagesBySeqsRange: function (boxPath, seqMin, seqMax) {
		Ember.Logger.debug('getMessagesBySeqsRange(' + boxPath + ', ' + seqMin + ', ' + seqMax + ')');
		Ember.Logger.assert(boxPath);
		Ember.Logger.assert(seqMin);
		Ember.Logger.assert(seqMax);

		if (seqMin > seqMax) {
			return new Ember.RSVP.Promise(function (resolve) {
				resolve([]);
			});
		}

		let self = this;
		return Ember.$.ajax({
				url: REST_SERVER + '/boxes/' + boxPath + '/messages?seqs=' + seqMin + ':' + seqMax + '&fetchStruct=true&fetchEnvelope=true',
				type: 'GET',
				dataType: 'json'
			}).then(self.getMessagesAdapter)
			.then(self.getMessagesResultLogger);
	},

	getMessagesByIds: function (boxPath, ids) {
		Ember.Logger.debug('getMessagesByIds(' + boxPath + ', ' + ids + ')');
		Ember.Logger.assert(boxPath);
		Ember.Logger.assert(ids);

		if (ids.length === 0) {
			return new Ember.RSVP.Promise(function (resolve) {
				resolve([]);
			});
		}


		let self = this;
		return Ember.$.ajax({
			url: REST_SERVER + '/boxes/' + boxPath + '/messages?ids=' + ids.join('&ids=') + '&fetchStruct=true&fetchEnvelope=true',
			type: 'GET',
			dataType: 'json'
		}).then(self.getMessagesAdapter).then(self.getMessagesResultLogger);
	},

	getMessagesAdapter: function (messages) {
		var adaptedMessages = [];
		for (var i = 0; i < messages.length; i++) {
			adaptedMessages.push(new Message(messages[i]));
		}
		return adaptedMessages;
	},

	getMessagesResultLogger: function (messages) {
		Ember.Logger.debug('messages=' + JSON.stringify(messages));
		return messages;
	},


	//#####################################################
	// Get message
	// URL: GET /boxes/:boxPath/messages/:messageId
	//#####################################################

	getMessage: function (boxPath, messageId) {
		Ember.Logger.debug('getMessage(' + boxPath + ', ' + messageId + ')');
		Ember.Logger.assert(boxPath);
		Ember.Logger.assert(messageId);

		return Ember.$.ajax({
			url: REST_SERVER + '/boxes/' + boxPath + '/messages/' + messageId + '?fetchStruct=true&fetchEnvelope=true&markSeen=true',
			type: 'GET',
			dataType: 'json'
		}).then(function (result) {
			return new Message(result);
		});
	},

	downloadBodyPartContent: function (boxPath, message, bodyPart) {
		var partId = bodyPart.get('partID');
		Ember.Logger.assert(partId);

		//Get part promise
		let promise;
		let cacheKey = boxPath + '.' + message.uid + '.' + partId;
		let part = DataCacheUtil.getData('part', cacheKey);
		if (part) {
			//Cache version
			promise = new Ember.RSVP.Promise(function (resolve) {
				Ember.Logger.debug('Part#' + partId + ' of message#' + message.seq + ' in box#' + boxPath + ' found in cache');
				resolve(part);
			});
		} else {
			//Server version
			Ember.Logger.debug('Ask the server for part#' + partId + ' of message#' + message.uid + ' in box#' + boxPath);
			promise = Ember.$.ajax({
				url: REST_SERVER + '/boxes/' + boxPath + '/messages/' + message.uid + '?&markSeen=true&bodies=' + partId,
				type: 'GET',
				dataType: 'json'
			}).then(function (result) {
				Ember.Logger.debug('Part#' + partId + ' of message#' + message.seq + ' in box#' + boxPath + ' receive');
				DataCacheUtil.storeData('part', cacheKey, result);
				return result;
			});
		}

		//Return promise
		return promise.then(function (result) {
			Ember.Logger.assert(result.bodies[partId]);
			bodyPart.set('content', result.bodies[partId]);
		});
	},

	downloadPartsContent: function (boxPath, message, parts) {
		Ember.Logger.assert(boxPath);
		Ember.Logger.assert(message);
		Ember.Logger.assert(parts);

		var promises = [];
		for (var i = 0; i < parts.length; i++) {
			var promise = this.downloadBodyPartContent(boxPath, message, parts[i]);
			promises.push(promise);
		}

		return Ember.RSVP.all(promises);
	},

	downloadMessagesPreview: function (boxPath, messages) {
		Ember.Logger.assert(boxPath);
		Ember.Logger.assert(messages);

		var promises = [];
		for (var i = 0; i < messages.length; i++) {
			var promise = this.downloadMessagePreview(boxPath, messages[i]);
			promises.push(promise);
		}

		return Ember.RSVP.all(promises);
	},

	downloadMessagePreview: function (boxPath, message) {
		Ember.Logger.assert(boxPath);
		Ember.Logger.assert(message);
		Ember.Logger.assert(message.part);

		Ember.Logger.debug('Ask the server for preview parts of message#' + message.seq + ' in box#' + boxPath);
		var parts = message.part.get('previewParts');
		return this.downloadPartsContent(boxPath, message, parts);
	},

	downloadMessagesDisplayContent: function (boxPath, messages) {
		Ember.Logger.assert(boxPath);
		Ember.Logger.assert(messages);

		var promises = [];
		for (var i = 0; i < messages.length; i++) {
			var promise = this.downloadMessageDisplayContent(boxPath, messages[i]);
			promises.push(promise);
		}

		return Ember.RSVP.all(promises);
	},

	downloadMessageDisplayContent: function (boxPath, message) {
		Ember.Logger.assert(boxPath);
		Ember.Logger.assert(message);
		Ember.Logger.assert(message.part);

		Ember.Logger.debug('Ask the server for displayable parts of message#' + message.seq + ' in box#' + boxPath);
		var parts = message.part.get('displayParts');
		return this.downloadPartsContent(boxPath, message, parts);
	},



	//#####################################################
	// Login
	// URL: POST /login
	//#####################################################

	login: function (username, password) {
		Ember.Logger.debug('login(' + username + ', ***********)');
		Ember.Logger.assert(username);
		Ember.Logger.assert(password);

		return Ember.$.ajax({
			url: REST_SERVER + '/login',
			type: 'POST',
			data: {
				username: username,
				password: password
			},
		});
	},

	//#####################################################
	// Send message
	// URL: POST /messages
	//#####################################################

	sendMessage: function (message) {
		Ember.Logger.debug('sendMessage(' + message + ')');
		Ember.Logger.assert(message);

		var data = {
			from: this.sendMessageEmailFormatter(message.get('from')),
			to: this.sendMessageEmailFormatter(message.get('to')),
			cc: this.sendMessageEmailFormatter(message.get('cc')),
			bcc: this.sendMessageEmailFormatter(message.get('bcc')),
			subject: message.get('subject'),
			html: message.get('htmlBody'),
			text: message.get('textBody'),
		};
		var stringData = JSON.stringify(data);
		Ember.Logger.debug('Api Message : ' + stringData + '');

		return Ember.$.ajax({
			url: REST_SERVER + '/messages',
			type: 'POST',
			contentType: 'application/json',
			data: stringData
		});
	},

	sendMessageEmailFormatter: function (emails) {
		var result;
		if (emails instanceof Array) {
			result = [];
			let self = this;
			emails.forEach(function (email) {
				result.push(self.sendMessageEmailFormatter(email));
			});
		} else {
			if (!emails) {
				return;
			}

			result = {};
			if (emails.get('name')) {
				result.name = emails.get('name');
			}
			if (emails.get('address')) {
				result.address = emails.get('address');
			}
		}

		return result;
	},

	//#####################################################
	// Delete message
	// URL: DELETE /boxes/:boxPath/messages/:messageId
	//#####################################################

	deleteMessage: function (boxPath, messageId) {
		Ember.Logger.debug('deleteMessage(' + boxPath + ', ' + messageId + ')');
		Ember.Logger.assert(boxPath);
		Ember.Logger.assert(messageId);

		return Ember.$.ajax({
			url: REST_SERVER + '/boxes/' + boxPath + '/messages/' + messageId,
			type: 'DELETE'
		});
	}

}).create();