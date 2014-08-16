var Client = window.Client = Ember.Application.create({
	REST_SERVER : '/api'
});

/* Order and include as you please. */
require('scripts/helpers/*');
require('scripts/components/*');
require('scripts/controllers/*');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/components/*');
require('scripts/views/*');
require('scripts/router');
