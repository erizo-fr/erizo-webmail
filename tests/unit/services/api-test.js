import {
	moduleFor,
	test
} from "ember-qunit"

moduleFor("service:api", {
})

test("it exposes the right methods", function (assert) {
	let service = this.subject()
	assert.ok(service)
	assert.ok(service.getUserData)
	assert.ok(service.getBoxes)
	assert.ok(service.getBox)
	assert.ok(service.getBoxOrder)
	assert.ok(service.getMessagesBySeqsRange)
	assert.ok(service.getMessagesByIds)
	assert.ok(service.getMessage)
	assert.ok(service.downloadBodyPartContent)
	assert.ok(service.getPartContentUrl)
	assert.ok(service.login)
	assert.ok(service.sendMessage)
	assert.ok(service.deleteMessage)
	assert.ok(service.moveMessage)
	assert.ok(service.moveMessageByUid)
	assert.ok(service.getContactsEmails)
})
