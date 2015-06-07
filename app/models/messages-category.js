import Ember from "ember"

export default Ember.Object.extend({
	name: null,
	messages: null,
	acceptanceFunction: null,

	accepts: function (message) {
		let messageDate = moment(message.date)
		let acceptanceFunction = this.get("acceptanceFunction")
		return acceptanceFunction(messageDate)
	},
})
