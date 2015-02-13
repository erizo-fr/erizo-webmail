Client.HtmlEditorComponent = Ember.Component.extend({
	value: '',

	didInsertElement: function () {
		//Init CKEditor
		var editor = this.$('.html-editor')[0];
		var instance = CKEDITOR.replace(editor, {
			customConfig: '../../js/thread-editor-config.js'
		});
		instance.setData(this.get('value'));

		//Update the value when CKEditor content change
		var self = this;
		instance.on('change', function () {
			var data = instance.getData();
			Ember.Logger.debug('CKEditor onBlur event fired: ' + data);
			self.set('value', data);
		});
	}
});