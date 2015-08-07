import Ember from "ember"

export default Ember.Component.extend({

	didInsertElement: function () {
		this._super()
		Ember.run.scheduleOnce("afterRender", this, function () {
			// Get iframe
			let model = this.get("model")
			let iframe = this.$("iframe")
			let iframeContent = iframe.contents()

			// Set BODY
			iframeContent.find("body").html(model)

			// Set HEAD
			let head = "<link rel='stylesheet' href='assets/vendor.css'>\n"
			head += "<link rel='stylesheet' href='assets/erizo-webmail.css'>\n"
			iframeContent.find("head").append(head)

			// Resize
			Ember.Logger.debug("Resizing iframe: " + iframe)
			var iframBodyHeight = iframeContent.find("html").height() + 10
			Ember.Logger.debug("iframe content height: " + iframBodyHeight)
			iframe.height(iframBodyHeight)
		})
	},

})
