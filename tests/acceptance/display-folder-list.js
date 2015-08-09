import Ember from "ember"
import {
	module,
	test
} from "qunit"
import startApp from "erizo-webmail/tests/helpers/start-app"

var application

module("Acceptance: Display folder list", {
	beforeEach: function () {
		application = startApp()
		visit("/account/boxes/INBOX/messages")
	},

	afterEach: function () {
		Ember.run(application, "destroy")
	},
})

test("Folder list is displayed", function (assert) {
	assert.equal(currentPath(), "/account/boxes/INBOX/messages")
	var rootElement = find("#left-panel .box-list")
	assert.ok(rootElement.text().indexOf("INBOX") !== -1)
	assert.ok(rootElement.text().indexOf("FEATURE_DisplayFolderList") !== -1)
	assert.ok(rootElement.text().indexOf("Folder1") !== -1)
	assert.ok(rootElement.text().indexOf("Folder2") !== -1)
})
