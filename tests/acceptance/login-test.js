import Ember from "ember"
import {
	module,
	test
} from "qunit"
import startApp from "erizo-webmail/tests/helpers/start-app"

var application

module("Acceptance: Login", {
	beforeEach: function () {
		application = startApp()
		visit("/login")
	},

	afterEach: function () {
		Ember.run(application, "destroy")
	},
})

function fillLoginFieldsAndClick (username, password) {
	fillIn("#login-panel #input-username", username)
	fillIn("#login-panel #input-password", password)
	click("#login-panel #btn-login")
}

test("visiting /login", function (assert) {
	andThen(function () {
		assert.equal(currentPath(), "login")
	})
})

test("missing inputs", function (assert) {
	fillLoginFieldsAndClick("", "")
	andThen(function () {
		assert.equal(currentPath(), "login")
	})
})

test("missing login", function (assert) {
	fillLoginFieldsAndClick("", "password")
	andThen(function () {
		assert.equal(currentPath(), "login")
	})
})

test("missing username", function (assert) {
	fillLoginFieldsAndClick("username", "")
	andThen(function () {
		assert.equal(currentPath(), "login")
	})
})

test("bad credentials", function (assert) {
	fillLoginFieldsAndClick("wrong", "password")
	andThen(function () {
		assert.equal(currentPath(), "login")
	})
})

test("valid credentials", function (assert) {
	fillLoginFieldsAndClick("good", "password")
	andThen(function () {
		assert.notEqual(currentPath(), "login")
	})
})
