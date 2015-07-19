import Ember from "ember"

export default Ember.Component.extend({

	instance: null,

	htmlValue: "",
	textValue: "",

	cursorPositionBegin: 0,
	cursorPositionEnd: 0,

	cursorPosition: function () {
		return {
			begin: this.get("cursorPositionBegin"),
			end: this.get("cursorPositionEnd"),
		}
	}.property("cursorPositionBegin", "cursorPositionEnd"),

	formattedHtmlValue: function () {
		return this.get("htmlValue") ? this.get("htmlValue") : ""
	}.property("htmlValue"),

	htmlValueObserver: function () {
		if (this.get("instance").getHTML() !== this.get("htmlValue")) {
			this.get("instance").setHTML(this.get("formattedHtmlValue"))
		}
	}.observes("htmlValue"),

	cursorPositionObserver: function () {
		let cursorPositionBegin = this.get("cursorPositionBegin")
		let cursorPositionEnd = this.get("cursorPositionEnd")
		this.get("instance").setSelection(cursorPositionBegin, cursorPositionEnd)
	}.observes("cursorPosition"),

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

		// Update cursor position on event
		instance.on("selection-change", function (range) {
			Ember.Logger.debug("cursor position changed: " + JSON.stringify(range))
			if (range) {
				self.set("cursorPositionBegin", range.start)
				self.set("cursorPositionEnd", range.end)
			}
		})

		this.set("instance", instance)
	},
})
