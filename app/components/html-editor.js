import Ember from "ember"

export default Ember.Component.extend({

	instance: null,

	htmlValue: "",
	textValue: "",

	formattedHtmlValue: function () {
		return this.get("htmlValue") ? this.get("htmlValue") : ""
	}.property("htmlValue"),

	htmlValueObserver: function () {
		if (this.get("instance").getHTML() !== this.get("htmlValue")) {
			this.get("instance").setHTML(this.get("formattedHtmlValue"))
		}
	}.observes("htmlValue"),

	didInsertElement: function () {
		// Init
		let id = this.elementId
		var instance = new Quill("#" + id + " .erizo-htmlEditor-editor", {
			styles: false,
		})
		instance.setHTML(this.get("formattedHtmlValue"))

		// Update the value when content change
		var self = this
		instance.on("text-change", function () {
			var htmlValue = instance.getHTML()
			var textValue = Ember.$(htmlValue).text()
			self.set("htmlValue", htmlValue)
			self.set("textValue", textValue)
		})

		this.set("instance", instance)
	},
})
