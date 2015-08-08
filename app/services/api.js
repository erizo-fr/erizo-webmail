import Ember from "ember"
import Config from "../config/environment"
import UserDataFactory from "erizo-webmail/models/factories/user-data"
import ContactFactory from "erizo-webmail/models/factories/contact"
import MessageFactory from "erizo-webmail/models/factories/message"
import BoxFactory from "erizo-webmail/models/factories/box"
import OpenBoxFactory from "erizo-webmail/models/factories/openBox"
import DataCacheUtil from "erizo-webmail/utils/dataCache"
import ArrayBufferUtil from "erizo-webmail/utils/arrayBuffer"

export default Ember.Service.extend({

	restServer: Config.apiURL || "/api",

	// #####################################################
	// Get user data
	// URL: GET /userdata
	// #####################################################

	getUserData: function () {
		Ember.Logger.debug("getUserData()")
		return Ember.$.ajax({
			url: this.get("restServer") + "/account/data",
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
				url: this.get("restServer") + "/boxes",
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
			url: this.get("restServer") + "/boxes/" + boxPath,
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
			url: this.get("restServer") + "/boxes/" + boxPath + "/order",
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
				url: this.get("restServer") + "/boxes/" + boxPath + "/messages?seqs=" + seqMin + ":" + seqMax + "&fetchStruct=true&fetchEnvelope=true&markSeen=false",
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
			url: this.get("restServer") + "/boxes/" + boxPath + "/messages?ids=" + ids.join("&ids=") + "&fetchStruct=true&fetchEnvelope=true&markSeen=false",
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
			url: this.get("restServer") + "/boxes/" + boxPath + "/messages/" + messageId + "?fetchStruct=true&fetchEnvelope=true&markSeen=true",
			type: "GET",
			dataType: "json",
		}).then(function (result) {
			return MessageFactory.createMessage(result)
		})
	},

	// ###############################################################
	// Get part
	// URL: GET /boxes/:boxPath/messages/:messageId/parts/:partId
	// ###############################################################

	downloadBodyPartContent: function (box, message, bodyPart) {
		Ember.Logger.assert(box)
		let boxPath = box.get("path")
		var partId = bodyPart.get("partID")
		Ember.Logger.assert(partId)
		// Get part promise
		let promise
		let cacheKey = boxPath + "/" + message.get("uid") + "/" + partId
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
				url: this.get("restServer") + "/boxes/" + boxPath + "/messages/" + message.get("uid") + "/parts/" + partId,
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
			Ember.Logger.assert(result)
			Ember.Logger.assert(result.content)
			bodyPart.set("content", result.content)
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

	// #########################################################################
	// Get part content url
	// URL: GET /boxes/:boxPath/messages/:messageId/parts/:partId/content
	// #########################################################################

	getPartContentUrl: function (box, message, part) {
		Ember.Logger.assert(box)
		let boxPath = box.get("path")
		Ember.Logger.assert(boxPath)
		Ember.Logger.assert(message)
		Ember.Logger.assert(part)
		let partId = part.get("partID")
		Ember.Logger.assert(partId)

		return this.get("restServer") + "/boxes/" + boxPath + "/messages/" + message.get("uid") + "/parts/" + partId + "/content"
	},

	// #####################################################
	// Login
	// URL: POST /login
	// #####################################################

	login: function (username, password) {
		Ember.Logger.debug("login(" + username + ", ***********)")
		Ember.Logger.assert(username)
		Ember.Logger.assert(password)

		let self = this
		return new Ember.RSVP.Promise(function (resolve, reject) {
			Ember.$.ajax({
				url: self.get("restServer") + "/login",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({
					username: username,
					password: password,
				}),
			}).done(function (result) {
				Ember.run(null, resolve, result)
			}).fail(function (error) {
				Ember.run(null, reject, error)
			})
		})
	},

	// #####################################################
	// Send message
	// URL: POST /messages
	// #####################################################

	sendMessage: function (message) {
		Ember.Logger.debug("sendMessage(" + message + ")")
		Ember.Logger.assert(message)

		let self = this
		return this.sendMessageAttachmentsFormatter(message.get("attachments")).then(function (attachments) {
			return Ember.$.ajax({
				url: self.get("restServer") + "/messages",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({
					from: self.sendMessageEmailFormatter(message.get("from")),
					to: self.sendMessageEmailFormatter(message.get("to")),
					cc: self.sendMessageEmailFormatter(message.get("cc")),
					bcc: self.sendMessageEmailFormatter(message.get("bcc")),
					subject: message.get("subject"),
					html: message.get("htmlBody"),
					text: message.get("textBody"),
					attachments: attachments,
				}),
			})
		})
	},

	sendMessageAttachmentsFormatter: function (attachments) {
		Ember.Logger.assert(attachments)

		let self = this
		let promises = Ember.$.map(attachments, function (attachment) {
			return self.sendMessageAttachmentFormatter(attachment)
		})

		return Ember.RSVP.Promise.all(promises)
	},

	sendMessageAttachmentFormatter: function (attachment) {
		Ember.Logger.assert(attachment)
		Ember.Logger.debug("Formatting attachment: " + attachment.get("file").name)
		let file = attachment.get("file")

		return new Ember.RSVP.Promise(function (resolve, reject) {
			let reader = new FileReader()

			reader.onerror = function (error) {
				reject(error)
			}

			reader.onload = function () {
				Ember.Logger.debug(reader.result)
				let b64String = ArrayBufferUtil.toBase64(reader.result)
				Ember.Logger.debug("Formatting attachment: " + attachment.get("file").name + " ... done")
				resolve({
					filename: file.name,
					content: b64String,
					encoding: "base64",
				})
			}

			reader.readAsArrayBuffer(file)
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
			url: this.get("restServer") + "/boxes/" + boxPath + "/messages/" + message.get("uid"),
			type: "DELETE",
		})
	},

	// #####################################################
	// Move message
	// URL: PATCH /boxes/:boxPath/messages/:messageId
	// #####################################################

	moveMessage: function (box, message, newBox) {
		Ember.Logger.assert(box)
		Ember.Logger.assert(message)
		Ember.Logger.assert(newBox)

		return this.moveMessageByUid(box, message.get("uid"), newBox)
	},

	moveMessageByUid: function (box, messageUid, newBox) {
		Ember.Logger.assert(box)
		Ember.Logger.assert(messageUid)
		Ember.Logger.assert(newBox)

		let boxPath = box.get("path")
		let newBoxPath = newBox.get("path")
		Ember.Logger.info("Move message#" + messageUid + " in box#" + boxPath + " to box#" + newBoxPath)

		var data = {
			boxPath: newBoxPath,
		}

		return Ember.$.ajax({
			url: this.get("restServer") + "/boxes/" + boxPath + "/messages/" + messageUid,
			type: "PATCH",
			contentType: "application/json",
			data: JSON.stringify(data),
		})
	},

	// #####################################################
	// Get contacts
	// URL: GET /contacts?criteria=:criteria&limit=:limit
	// #####################################################

	getContacts: function (criteria, limit) {
		Ember.Logger.debug("getContacts(" + criteria + ", " + limit + ")")
		Ember.Logger.assert(criteria)
		let self = this
		return Ember.$.ajax({
			url: this.get("restServer") + "/contacts?criteria=" + criteria + (limit ? "&limit=" + limit : ""),
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

	getContactsEmails: function (criteria, limit) {
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
})
