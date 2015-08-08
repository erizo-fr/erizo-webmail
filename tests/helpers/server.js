import Pretender from "pretender"
import serverData from "./server-data"

var apiRootUrl = "/api-static"
var debugServer = false

function findBox (boxPath) {
	return serverData.boxes[boxPath]
}

function findMessages (boxPath, messageIds) {
	if (!serverData.messages[boxPath]) {
		return []
	}

	var result = []
	for (var i = serverData.messages[boxPath].length - 1; i >= 0; i--) {
		if (messageIds.indexOf(serverData.messages[boxPath][i].id) !== -1) {
			result.push(JSON.parse(serverData.messages[boxPath][i].data))
		}
	}

	return result
}

function findMessage (boxPath, messageId) {
	if (!serverData.messages[boxPath]) {
		return null
	}

	for (var i = serverData.messages[boxPath].length - 1; i >= 0; i--) {
		if (serverData.messages[boxPath][i].id === messageId) {
			return JSON.parse(serverData.messages[boxPath][i].data)
		}
	}

	return null
}

function findPart (boxPath, messageId, partId) {
	var message = findMessage(boxPath, messageId)
	if (!message) {
		return null
	}

	return JSON.parse(message[partId].data)
}

function requestHandlers () {
	this.post(apiRootUrl + "/login", function (request) {
		var body = JSON.parse(request.requestBody)
		if (!body.username || body.username === "wrong" || !body.password) {
			return [401, {}, "Bad credentials"]
		} else {
			return [200, {}, "OK"]
		}
	})

	this.get(apiRootUrl + "/account/data", function () {
		return [200, {}, JSON.stringify(serverData.accountData)]
	})

	this.get(apiRootUrl + "/boxes", function () {
		return [200, {}, JSON.stringify(serverData.boxes)]
	})

	this.get(apiRootUrl + "/boxes/:boxPath", function (request) {
		var boxPath = request.params.boxPath
		if (serverData.boxDetails[boxPath]) {
			return [200, {}, JSON.stringify(serverData.boxDetails[boxPath])]
		} else {
			return [404, {}, "The box does not exist"]
		}
	})

	this.get(apiRootUrl + "/boxes/:boxPath/order", function (request) {
		var boxPath = request.params.boxPath
		if (!findBox(boxPath)) {
			return [404, {}, "The box does not exist"]
		}

		var order = []
		for (var i = serverData.messages[boxPath].length - 1; i >= 0; i--) {
			order.push(serverData.messages[boxPath][i].id)
		}
		return [200, {}, JSON.stringify(order)]
	})

	this.get(apiRootUrl + "/boxes/:boxPath/messages", function (request) {
		var boxPath = request.params.boxPath
		var ids = request.queryParams.ids || []
		if (!ids.length) {
			ids = [ids]
		}

		// Test the box
		if (!findBox(boxPath)) {
			return [404, {}, "The box does not exist"]
		}

		var messages = findMessages(boxPath, ids)
		return [200, {}, JSON.stringify(messages)]
	})

	this.get(apiRootUrl + "/boxes/:boxPath/messages/:messageId/parts/:partId", function (request) {
		var boxPath = request.params.boxPath
		var messageId = request.params.messageId
		var partId = request.params.partId

		// Test the box
		if (!findBox(boxPath)) {
			return [404, {}, "The box does not exist"]
		}

		var part = findPart(boxPath, messageId, partId)
		return [200, {}, JSON.stringify(part)]
	})
}

export default {
	init: function () {
		var server = new Pretender(requestHandlers)

		server.unhandledRequest = function (verb, path, request) {
			if (debugServer) {
				console.log("Unhandled request: " + verb + " " + path + ": " + JSON.stringify(request))
			}
		}

		server.handledRequest = function (verb, path, request) {
			if (debugServer) {
				console.log("Server: " + verb + " " + path + ": " + request.responseText)
			}
		}
	},
}
