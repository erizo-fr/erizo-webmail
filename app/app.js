import Ember from "ember"
import Resolver from "ember/resolver"
import loadInitializers from "ember/load-initializers"
import config from "./config/environment"

Ember.MODEL_FACTORY_INJECTIONS = true

// Setup logger on promise error
Ember.RSVP.on("error", function (error) {
	Ember.Logger.assert(false, error)
})

var App = Ember.Application.extend({
	modulePrefix: config.modulePrefix,
	podModulePrefix: config.podModulePrefix,
	Resolver: Resolver,

	ready: function () {
		// Init material design
		Ember.$(function () {
			Ember.$.material.init()
		})
	},
})
loadInitializers(App, config.modulePrefix)
export default App
