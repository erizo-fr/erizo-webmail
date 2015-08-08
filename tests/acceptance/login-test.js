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

test("visiting /login", function (assert) {
	andThen(function () {
		assert.equal(currentPath(), "login")
	})
})

test("missing inputs", function (assert) {
	fillIn("#login-panel #input-username", "")
	fillIn("#login-panel #input-password", "")
	click("#login-panel #btn-login")
	andThen(function () {
		assert.equal(currentPath(), "login")
	})
})

test("missing login", function (assert) {
	fillIn("#login-panel #input-username", "")
	fillIn("#login-panel #input-password", "password")
	click("#login-panel #btn-login")
	andThen(function () {
		assert.equal(currentPath(), "login")
	})
})

test("missing username", function (assert) {
	fillIn("#login-panel #input-username", "username")
	fillIn("#login-panel #input-password", "")
	click("#login-panel #btn-login")
	andThen(function () {
		assert.equal(currentPath(), "login")
	})
})

test("bad credentials", function (assert) {
	fillIn("#login-panel #input-username", "wrong")
	fillIn("#login-panel #input-password", "password")
	click("#login-panel #btn-login")
	andThen(function () {
		assert.equal(currentPath(), "login")
	})
})

test("valid credentials", function (assert) {
	fillIn("#login-panel #input-username", "good")
	fillIn("#login-panel #input-password", "password")
	click("#login-panel #btn-login")
	andThen(function () {
		assert.notEqual(currentPath(), "login")
	})
})
