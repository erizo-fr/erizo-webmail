import Ember from "ember"

export default Ember.Component.extend({

	instance: null,

	htmlValue: "",
	textValue: "",

	htmlValueObserver: function () {
		if (this.get("instance").getData() !== this.get("htmlValue")) {
			this.get("instance").setData(this.get("htmlValue"))
		}
	}.observes("htmlValue"),

	didInsertElement: function () {
		// Init CKEditor
		var editor = this.$(".html-editor")[0]
		var instance = CKEDITOR.replace(editor, {
			// Define changes to default configuration here.
			// For complete reference see:
			// http:// docs.ckeditor.com/#!/api/CKEDITOR.config

			// The toolbar groups arrangement, optimized for a single toolbar row.
			toolbarGroups: [
				{
					name: "document",
					groups: ["mode", "document", "doctools"],
				}, {
					name: "editing",
					groups: ["find", "selection"],
				}, {
					name: "forms",
				}, {
					name: "basicstyles",
					groups: ["basicstyles", "cleanup"],
				}, {
					name: "paragraph",
					groups: ["list", "indent", "blocks", "align", "bidi"],
				}, {
					name: "links",
				}, {
					name: "insert",
				}, {
					name: "styles",
				}, {
					name: "colors",
				}, {
					name: "others",
				},
			],

			// The default plugins included in the basic setup define some buttons that
			// are not needed in a basic editor. They are removed here.
			removeButtons: "Cut,Copy,Paste,Undo,Redo,Anchor,Underline,Strike,Subscript,Superscript",

			// Dialog windows are also simplified.
			removeDialogTabs: "link:advanced",

			skin: "bootstrapck,/assets/bootstrapck/",

			toolbarLocation: "bottom",
			removePlugins: "elementspath",
		})
		instance.setData(this.get("htmlValue"))
		// Update the value when CKEditor content change
		var self = this
		instance.on("change", function () {
			var htmlValue = instance.getData()
			var textValue = Ember.$(htmlValue).text()
			Ember.Logger.debug("CKEditor onBlur event fired: " + htmlValue)
			self.set("htmlValue", htmlValue)
			self.set("textValue", textValue)
		})

		this.set("instance", instance)
	},
})
