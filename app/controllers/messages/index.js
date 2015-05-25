import Ember from "ember"
import Api from "erizo-webmail/utils/api"
import DateUtil from "erizo-webmail/utils/date"
import MessagesCategoryFactory from "erizo-webmail/models/factories/messagesCategory"

export default Ember.ArrayController.extend({
	needs: ["messages", "box"],

	messageRowElements: [],

	currentPage: -1,
	pageSize: 10,
	isMessagesLoading: false,
	hasMorePages: false,

	allSelectedMessages: Ember.computed.filterBy("messageRowElements", "isSelected", true),
	totalSelectedMessageCount: Ember.computed.alias("allSelectedMessages.length"),
	hasSelectedMessages: Ember.computed.gt("totalSelectedMessageCount", 0),

	init: function () {
		this._super.apply(this, arguments)
		// Init resize event handler to update page size
		let self = this
		Ember.$(window).resize(function () {
			Ember.Logger.debug("Page resized event has been triggered: Updating message page size")
			self.updatePageSize()
		})
		// Update page size
		this.updatePageSize()
	},

	actions: {
		registerMessageRow: function (messageRow) {
			this.get("messageRowElements").addObject(messageRow)
		},
		unregisterMessageRow: function (messageRow) {
			this.get("messageRowElements").removeObject(messageRow)
		},

		loadMoreMessages: function () {
			this.loadMoreMessages()
		},
		deleteSelectedMessages: function () {
			Ember.Logger.debug("Action received: Delete selected messages")
			Ember.Logger.warn("TODO")
		},
		selectMessage: function () {

		},
	},

	updatePageSize: function () {
		var windowHeight = Ember.$(window).height()
		Ember.Logger.debug("Windows height: " + windowHeight)
		var pageSize = Math.floor((windowHeight - 150) / 45)
		Ember.Logger.debug("pageSize: " + pageSize)
		this.set("pageSize", pageSize)
	},

	insertMessage: function (message) {
		// Try to insert the message into existing categories
		let categories = this.get("model")
		for (let i = 0; i < categories.length; i++) {
			if (categories[i].accepts(message)) {
				categories[i].get("messages").pushObject(message)
				return
			}
		}

		// Create a new category
		let messageDate = moment(message.date)
		let newCategoryData = {
			messages: [message],
		}
		if (DateUtil.isToday(messageDate)) {
			newCategoryData.name = "Today"
			newCategoryData.acceptanceFunction = DateUtil.isToday
		} else if (DateUtil.isYesterday(messageDate)) {
			newCategoryData.name = "Yesterday"
			newCategoryData.acceptanceFunction = DateUtil.isYesterday
		} else if (DateUtil.isThisWeek(messageDate)) {
			newCategoryData.name = "This week"
			newCategoryData.acceptanceFunction = DateUtil.isThisWeek
		} else if (DateUtil.isLastWeek(messageDate)) {
			newCategoryData.name = "Last week"
			newCategoryData.acceptanceFunction = DateUtil.isLastWeek
		} else if (DateUtil.isThisMonth(messageDate)) {
			newCategoryData.name = "This month"
			newCategoryData.acceptanceFunction = DateUtil.isThisMonth
		} else if (DateUtil.isLastMonth(messageDate)) {
			newCategoryData.name = "Last month"
			newCategoryData.acceptanceFunction = DateUtil.isLastMonth
		} else {
			newCategoryData.name = messageDate.format("MMM YYYY")
			newCategoryData.acceptanceFunction = function (date) {
				return date.isSame(messageDate, "month")
			}
		}
		this.get("model").pushObject(MessagesCategoryFactory.create(newCategoryData))

	},

	loadMoreMessages: function () {
		if (this.get("isMessagesLoading")) {
			return
		} else {
			this.set("isMessagesLoading", true)
		}

		// Get variables
		var messagesOrder = this.get("controllers.messages.model")
		var box = this.get("controllers.box.model")
		var pageSize = this.get("pageSize")
		var currentPage = this.get("currentPage")
		var nextPage = currentPage + 1
		var totalElements = box.messages.total
		var lastPage = Math.ceil(totalElements / pageSize) - 1
		if (currentPage >= lastPage) {
			Ember.Logger.info("Try to load more message (page#" + nextPage + ") but no more pages are available (lastPage: " + lastPage + ")")
			this.set("hasMorePages", false)
			this.set("isMessagesLoading", false)
			return
		}

		// Load the initial messages
		Ember.Logger.debug("Getting the message page#" + nextPage + "[" + pageSize + "] of box#" + box.path)
		var idMin = Math.max(0, nextPage * pageSize)
		var idMax = Math.min(totalElements - 1, idMin + pageSize) + 1
		var self = this
		var ids = messagesOrder.slice(idMin, idMax)
		Api.getMessagesByIds(box.path, ids).then(function (newMessages) {
			Api.downloadMessagesPreview(box.path, newMessages).then(function () {

				// Insert the messages
				var newMessagesReversed = newMessages.reverse()
				Ember.$.each(newMessagesReversed, function (index, message) {
					self.insertMessage(message)
				})

				// Update var
				self.set("hasMorePages", nextPage < lastPage)
				self.set("currentPage", nextPage)
				self.set("isMessagesLoading", false)
			})
		})
	},
})
