var accountData = {"defaultIdentity": "bart@localhost"}

var boxes = {
	"Sent": {
		"attribs": [
			"\\HasNoChildren", "\\Sent",
		],
		"delimiter": ".",
		"children": null,
	},
	"Trash": {
		"attribs": [
			"\\HasNoChildren", "\\Trash",
		],
		"delimiter": ".",
		"children": null,
	},
	"INBOX": {
		"attribs": [
			"\\HasNoChildren",
		],
		"delimiter": ".",
		"children": null,
	},
	"FEATURE_DisplayFolderList": {
		"attribs": [],
		"delimiter": ".",
		"children": {
			"Folder1": {
				"attribs": [
					"\\HasNoChildren",
				],
				"delimiter": ".",
				"children": null,
			},
			"Folder2": {
				"attribs": [
					"\\HasNoChildren",
				],
				"delimiter": ".",
				"children": null,
			},
		},
	},
}

var messages = {
	"INBOX": [
		{
			"id": 1,
			"data": "[{'bodies':{},'attrs':{'struct':[{'type':'alternative','params':{'boundary':'----sinikael-?=_1-14391197324180.3487680375110358'},'disposition':null,'language':null,'location':null},[{'partID':'1','type':'text','subtype':'plain','params':{'charset':'us-ascii'},'id':null,'description':null,'encoding':'7bit','size':41,'lines':0,'md5':null,'disposition':null,'language':null,'location':null}],[{'partID':'2','type':'text','subtype':'html','params':{'charset':'us-ascii'},'id':null,'description':null,'encoding':'7bit','size':52,'lines':0,'md5':null,'disposition':null,'language':null,'location':null}]],'envelope':{'date':'2015-08-09T11:28:52.000Z','subject':'Feature[View message list] Scenario[Unseen message]','from':[{'name':null,'mailbox':'maggie','host':'localhost'}],'sender':[{'name':null,'mailbox':'maggie','host':'localhost'}],'replyTo':[{'name':null,'mailbox':'maggie','host':'localhost'}],'to':[{'name':'M. Bart Simpson','mailbox':'bart','host':'localhost'}],'cc':null,'bcc':null,'inReplyTo':null,'messageId':'<1439119732459-ce0fcc5f-6e3b75ad-5acf073e@localhost>'},'date':'2015-08-09T11:28:52.000Z','flags':[],'uid':1,'modseq':'1'}}]",
			"parts": {
				"1": {
					"data": "{'content':'This message should not be marked as seen','attributes':{'partID':'1','type':'text','subtype':'plain','params':{'charset':'us-ascii'},'id':null,'description':null,'encoding':'7bit','size':41,'lines':0,'md5':null,'disposition':null,'language':null,'location':null}}",
				},
				"2": {
					"data": "{'content':'<div>This message should not be marked as seen</div>','attributes':{'partID':'2','type':'text','subtype':'html','params':{'charset':'us-ascii'},'id':null,'description':null,'encoding':'7bit','size':52,'lines':0,'md5':null,'disposition':null,'language':null,'location':null}}",
				},
			},
		},
	],
}

var boxDetails = {}
function createBoxDetail (boxPath, boxName) {
	var messageNumber = messages[boxPath] ? messages[boxPath].length : 0
	boxDetails[boxPath] = {
		"name": boxName,
		"flags": [
			"\\Answered",
			"\\Flagged",
			"\\Deleted",
			"\\Seen",
			"\\Draft",
		],
		"readOnly": true,
		"uidvalidity": 1438434815,
		"uidnext": messageNumber + 1,
		"permFlags": [],
		"keywords": [],
		"newKeywords": true,
		"persistentUIDs": true,
		"nomodseq": false,
		"messages": {
			"total": messageNumber,
			"new": 0,
		},
		"highestmodseq": messageNumber,
	}
}
createBoxDetail("INBOX", "INBOX")
createBoxDetail("Trash", "Trash")
createBoxDetail("Sent", "Sent")
createBoxDetail("FEATURE_DisplayFolderList", "FEATURE_DisplayFolderList")
createBoxDetail("FEATURE_DisplayFolderList.Folder1", "Folder1")
createBoxDetail("FEATURE_DisplayFolderList.Folder2", "Folder2")

export default {
	"boxes": boxes,
	"boxDetails": boxDetails,
	"messages": messages,
	"accountData": accountData,
}

