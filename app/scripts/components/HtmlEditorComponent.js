Client.HtmlEditorComponent = Ember.Component.extend({
	htmlValue: '',
	textValue: '',

	didInsertElement: function () {
		//Init CKEditor
		var editor = this.$('.html-editor')[0];
		var instance = CKEDITOR.replace(editor, {
			customConfig: '../../js/thread-editor-config.js'
		});
		instance.setData(this.get('htmlValue'));

		//Update the value when CKEditor content change
		var self = this;
		instance.on('change', function () {
			var htmlValue = instance.getData();
			var textValue = ''; //TODO: Convert HTML content to formatted text
			Ember.Logger.debug('CKEditor onBlur event fired: ' + htmlValue);
			self.set('htmlValue', htmlValue);
			self.set('textValue', textValue);
		});
	}
});