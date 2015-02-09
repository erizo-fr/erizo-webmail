Client.ThreadMessageHtmlComponent = Ember.Component.extend({

	didInsertElement: function () {
		this._super();
		Ember.run.scheduleOnce('afterRender', this, function () {
			var model = this.get('model');
			this.$('iframe').contents().find('html').html(model);
		});
	}

});