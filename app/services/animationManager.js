import Ember from "ember"

export default Ember.Service.extend({

	animate: function (element, animation) {
		Ember.Logger.assert(element)
		element.addClass("animated " + animation)
		element.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
			element.removeClass("animated " + animation)
		})
	},

	shake: function (element) {
		this.animate(element, "shake")
	},

})
