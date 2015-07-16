import Ember from "ember"
import {initialize} from "../../../initializers/api"
import {module, test} from "qunit"

var container, application

module("ApiInitializer", {
	beforeEach: function () {
		Ember.run(function () {
			application = Ember.Application.create()
			container = application.__container__
			application.deferReadiness()
		})
	},
})

test("it register the API service", function (assert) {
	initialize(container, application)

	let apiService = application.__container__.lookup("service:api")
	assert.ok(apiService)
})
