import Ember from "ember"
import UserDataFactory from "erizo-webmail/models/factories/user-data"
import ContactFactory from "erizo-webmail/models/factories/contact"
import MessageFactory from "erizo-webmail/models/factories/message"
import BoxFactory from "erizo-webmail/models/factories/box"
import OpenBoxFactory from "erizo-webmail/models/factories/openBox"
import DataCacheUtil from "erizo-webmail/utils/dataCache"

var REST_SERVER = ""

export default Ember.Object.extend({

	// #####################################################
	// Get user data
	// URL: GET /userdata
	// #####################################################

	getUserData: function () {
		Ember.Logger.debug("getUserData()")
		return Ember.$.ajax({
			url: REST_SERVER + "/account/data",
			type: "GET",
			dataType: "json",
		}).then(function (result) {
			return UserDataFactory.createUserData(result)
		})
	},

	// #####################################################
	// Get boxes
	// URL: GET /boxes
	// #####################################################

	getBoxes: function () {
		Ember.Logger.debug("getBoxes()")
		let self = this
		return Ember.$.ajax({
				url: REST_SERVER + "/boxes",
				type: "GET",
				dataType: "json",
			}).then(function (boxes) {
				return self.getBoxesAdapter(boxes)
			}).then(self.getBoxesResultLogger)
	},

	getBoxesAdapter: function (boxes) {
		return BoxFactory.createArray(boxes)
	},

	getBoxesResultLogger: function (boxes) {
		Ember.Logger.debug("boxes=" + Ember.inspect(boxes))
		return boxes
	},

	// #####################################################
	// Get box
	// URL: GET /boxes/:boxPath
	// #####################################################

	getBox: function (box) {
		Ember.Logger.assert(box)
		let boxPath = box.get("path")
		Ember.Logger.debug("getBox(" + boxPath + ")")
		let self = this
		return Ember.$.ajax({
			url: REST_SERVER + "/boxes/" + boxPath,
			type: "GET",
			dataType: "json",
		}).then(function (openBoxDetail) {
			return OpenBoxFactory.create(openBoxDetail, box)
		}).then(self.getBoxResultLogger)
	},

	getBoxResultLogger: function (box) {
		Ember.Logger.debug("box=" + Ember.inspect(box))
		return box
	},

	// #####################################################
	// Get box order
	// URL: GET /boxes/:boxPath/order
	// #####################################################

	getBoxOrder: function (box) {
		Ember.Logger.assert(box)
		let boxPath = box.get("path")
		Ember.Logger.assert(boxPath)
		Ember.Logger.debug("getBoxOrder(" + boxPath + ")")

		let self = this
		return Ember.$.ajax({
			url: REST_SERVER + "/boxes/" + boxPath + "/order",
			type: "GET",
			dataType: "json",
		}).then(self.getBoxOrderResultLogger)
	},

	getBoxOrderResultLogger: function (order) {
		Ember.Logger.debug("boxOrder=" + JSON.stringify(order))
		return order
	},

	// #####################################################
	// Get messages
	// URL: GET /boxes/:boxPath/messages
	// #####################################################

	getMessagesBySeqsRange: function (box, seqMin, seqMax) {
		Ember.Logger.assert(box)
		let boxPath = box.get("path")
		Ember.Logger.debug("getMessagesBySeqsRange(" + boxPath + ", " + seqMin + ", " + seqMax + ")")
		Ember.Logger.assert(boxPath)
		Ember.Logger.assert(seqMin)
		Ember.Logger.assert(seqMax)
		if (seqMin > seqMax) {
			return new Ember.RSVP.Promise(function (resolve) {
				resolve([])
			})
		}

		let self = this
		return Ember.$.ajax({
				url: REST_SERVER + "/boxes/" + boxPath + "/messages?seqs=" + seqMin + ":" + seqMax + "&fetchStruct=true&fetchEnvelope=true",
				type: "GET",
				dataType: "json",
			}).then(self.getMessagesAdapter)
			.then(self.getMessagesResultLogger)
	},

	getMessagesByIds: function (box, ids) {
		Ember.Logger.assert(box)
		let boxPath = box.get("path")
		Ember.Logger.debug("getMessagesByIds(" + boxPath + ", " + ids + ")")
		Ember.Logger.assert(boxPath)
		Ember.Logger.assert(ids)
		if (ids.length === 0) {
			return new Ember.RSVP.Promise(function (resolve) {
				resolve([])
			})
		}

		let self = this
		return Ember.$.ajax({
			url: REST_SERVER + "/boxes/" + boxPath + "/messages?ids=" + ids.join("&ids=") + "&fetchStruct=true&fetchEnvelope=true",
			type: "GET",
			dataType: "json",
		}).then(self.getMessagesAdapter).then(self.getMessagesResultLogger)
	},

	getMessagesAdapter: function (messages) {
		var adaptedMessages = []
		for (var i = 0; i < messages.length; i++) {
			adaptedMessages.push(MessageFactory.createMessage(messages[i]))
		}
		return adaptedMessages
	},

	getMessagesResultLogger: function (messages) {
		Ember.Logger.debug("messages=" + JSON.stringify(messages))
		return messages
	},

	// #####################################################
	// Get message
	// URL: GET /boxes/:boxPath/messages/:messageId
	// #####################################################

	getMessage: function (box, messageId) {
		Ember.Logger.assert(box)
		let boxPath = box.get("path")
		Ember.Logger.debug("getMessage(" + boxPath + ", " + messageId + ")")
		Ember.Logger.assert(boxPath)
		Ember.Logger.assert(messageId)
		return Ember.$.ajax({
			url: REST_SERVER + "/boxes/" + boxPath + "/messages/" + messageId + "?fetchStruct=true&fetchEnvelope=true&markSeen=true",
			type: "GET",
			dataType: "json",
		}).then(function (result) {
			return MessageFactory.createMessage(result)
		})
	},

	downloadBodyPartContent: function (box, message, bodyPart) {
		Ember.Logger.assert(box)
		let boxPath = box.get("path")
		var partId = bodyPart.get("partID")
		Ember.Logger.assert(partId)
		// Get part promise
		let promise
		let cacheKey = boxPath + "." + message.get("uid") + "." + partId
		let part = DataCacheUtil.getData("part", cacheKey)
		if (part) {
			// Cache version
			promise = new Ember.RSVP.Promise(function (resolve) {
				Ember.Logger.debug("Part#" + partId + " of message#" + message.get("seq") + " in box#" + boxPath + " found in cache")
				resolve(part)
			})
		} else {
			// Server version
			Ember.Logger.debug("Ask the server for part#" + partId + " of message#" + message.get("uid") + " in box#" + boxPath)
			promise = Ember.$.ajax({
				url: REST_SERVER + "/boxes/" + boxPath + "/messages/" + message.get("uid") + "?&markSeen=true&bodies=" + partId,
				type: "GET",
				dataType: "json",
			}).then(function (result) {
				Ember.Logger.debug("Part#" + partId + " of message#" + message.get("seq") + " in box#" + boxPath + " receive")
				DataCacheUtil.storeData("part", cacheKey, result)
				return result
			})
		}

		// Return promise
		return promise.then(function (result) {
			Ember.Logger.assert(result.bodies[partId])
			bodyPart.set("content", result.bodies[partId])
		})
	},

	downloadPartsContent: function (box, message, parts) {
		Ember.Logger.assert(box)
		let boxPath = box.get("path")
		Ember.Logger.assert(boxPath)
		Ember.Logger.assert(message)
		Ember.Logger.assert(parts)
		var promises = []
		for (var i = 0; i < parts.length; i++) {
			var promise = this.downloadBodyPartContent(box, message, parts[i])
			promises.push(promise)
		}

		return Ember.RSVP.all(promises)
	},

	downloadMessagesPreview: function (box, messages) {
		Ember.Logger.assert(box)
		let boxPath = box.get("path")
		Ember.Logger.assert(boxPath)
		Ember.Logger.assert(messages)
		var promises = []
		for (var i = 0; i < messages.length; i++) {
			var promise = this.downloadMessagePreview(box, messages[i])
			promises.push(promise)
		}

		return Ember.RSVP.all(promises)
	},

	downloadMessagePreview: function (box, message) {
		Ember.Logger.assert(box)
		let boxPath = box.get("path")
		Ember.Logger.assert(boxPath)
		Ember.Logger.assert(message)
		Ember.Logger.assert(message.get("part"))
		Ember.Logger.debug("Ask the server for preview parts of message#" + message.get("seq") + " in box#" + boxPath)
		var parts = message.get("part").get("previewParts")
		return this.downloadPartsContent(box, message, parts)
	},

	downloadMessagesDisplayContent: function (box, messages) {
		Ember.Logger.assert(box)
		let boxPath = box.get("path")
		Ember.Logger.assert(boxPath)
		Ember.Logger.assert(messages)
		var promises = []
		for (var i = 0; i < messages.length; i++) {
			var promise = this.downloadMessageDisplayContent(box, messages[i])
			promises.push(promise)
		}

		return Ember.RSVP.all(promises)
	},

	downloadMessageDisplayContent: function (box, message) {
		Ember.Logger.assert(box)
		let boxPath = box.get("path")
		Ember.Logger.assert(boxPath)
		Ember.Logger.assert(message)
		Ember.Logger.assert(message.get("part"))
		Ember.Logger.debug("Ask the server for displayable parts of message#" + message.get("seq") + " in box#" + boxPath)
		var parts = message.get("part").get("displayParts")
		return this.downloadPartsContent(box, message, parts)
	},

	// #####################################################
	// Login
	// URL: POST /login
	// #####################################################

	login: function (username, password) {
		Ember.Logger.debug("login(" + username + ", ***********)")
		Ember.Logger.assert(username)
		Ember.Logger.assert(password)
		return Ember.$.ajax({
			url: REST_SERVER + "/login",
			type: "POST",
			data: {
				username: username,
				password: password,
			},
		})
	},

	// #####################################################
	// Send message
	// URL: POST /messages
	// #####################################################

	sendMessage: function (message) {
		Ember.Logger.debug("sendMessage(" + message + ")")
		Ember.Logger.assert(message)
		var data = {
			from: this.sendMessageEmailFormatter(message.get("from")),
			to: this.sendMessageEmailFormatter(message.get("to")),
			cc: this.sendMessageEmailFormatter(message.get("cc")),
			bcc: this.sendMessageEmailFormatter(message.get("bcc")),
			subject: message.get("subject"),
			html: message.get("htmlBody"),
			text: message.get("textBody"),
		}
		var stringData = JSON.stringify(data)
		Ember.Logger.debug("Api Message : " + stringData + "")
		return Ember.$.ajax({
			url: REST_SERVER + "/messages",
			type: "POST",
			contentType: "application/json",
			data: stringData,
		})
	},

	sendMessageEmailFormatter: function (emails) {
		var result
		if (emails instanceof Array) {
			result = []
			let self = this
			emails.forEach(function (email) {
				result.push(self.sendMessageEmailFormatter(email))
			})
		} else {
			if (!emails) {
				return null
			}

			result = {}
			if (emails.get("name")) {
				result.name = emails.get("name")
			}
			if (emails.get("address")) {
				result.address = emails.get("address")
			}
		}

		return result
	},

	// #####################################################
	// Delete message
	// URL: DELETE /boxes/:boxPath/messages/:messageId
	// #####################################################

	deleteMessage: function (box, message) {
		Ember.Logger.assert(box)
		Ember.Logger.assert(message)
		let boxPath = box.get("path")
		Ember.Logger.info("Delete message#" + message.get("uid") + " in box#" + boxPath)
		return Ember.$.ajax({
			url: REST_SERVER + "/boxes/" + boxPath + "/messages/" + message.get("uid"),
			type: "DELETE",
		})
	},

	// #####################################################
	// Get contacts
	// URL: GET /contacts?criteria=:criteria&limit=:limit
	// #####################################################

	getContacts (criteria, limit) {
		Ember.Logger.debug("getContacts(" + criteria + ", " + limit + ")")
		Ember.Logger.assert(criteria)
		let self = this
		return Ember.$.ajax({
			url: REST_SERVER + "/contacts?criteria=" + criteria + (limit ? "&limit=" + limit : ""),
			type: "GET",
		}).then(self.getContactsAdapter)
	},

	getContactsAdapter: function (vcards) {
		let adaptedResult = []
		Ember.$.each(vcards, function (index, vcard) {
			adaptedResult.push(ContactFactory.createContactFromVCard(vcard))
		})
		return adaptedResult
	},

	getContactsEmails (criteria, limit) {
		return this.getContacts(criteria, limit).then(function (contacts) {
			let emails = []
			for (let i = 0; i < contacts.length; i++) {
				let contact = contacts[i]
				for (let j = 0; j < contact.email.length; j++) {
					if (emails.length < limit) {
						emails.push(contact.email[j])
					}
				}
			}

			return emails
		})
	},
}).create()
