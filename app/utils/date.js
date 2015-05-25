import Ember from "ember"

export default Ember.Object.extend({
	isToday: function (date) {
		let now = moment()
		return date.isSame(now, "day")
	},

	isYesterday: function (date) {
		let lastDay = moment().subtract(1, "day")
		return date.isSame(lastDay, "day")
	},

	isThisWeek: function (date) {
		let now = moment()
		return date.isSame(now, "week")
	},

	isLastWeek: function (date) {
		let lastWeek = moment().subtract(7, "day")
		return date.isSame(lastWeek, "week")
	},

	isThisMonth: function (date) {
		let now = moment()
		return date.isSame(now, "month")
	},

	isLastMonth: function (date) {
		let lastMonth = moment().subtract(1, "month")
		return date.isSame(lastMonth, "month")
	},
}).create()
