import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
	this.route('login');
	this.route('logout');


    this.resource('account', {path: '/account'}, function() {
        this.resource('boxes', {path: '/boxes'}, function() {
            this.resource('box', {path: '/:box'}, function() {
                this.resource('messages', {path: '/messages'}, function() {
                    this.resource('message', {path: '/:id'}, function() {
                    });
                });
            });
            this.resource('settings', {path: '/settings'}, function() {
            
            });
        });
    });
});

export default Router;
