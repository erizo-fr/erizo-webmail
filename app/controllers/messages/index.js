import Ember from "ember"

import DateUtil from "erizo-webmail/utils/date"
import MessagesCategoryFactory from "erizo-webmail/models/factories/messages-category"

export default Ember.Controller.extend({
	boxes: Ember.inject.controller(),
	box: Ember.inject.controller(),
	messages: Ember.inject.controller(),

	currentPage: -1,
	pageSize: 10,
	isMessagesLoading: false,
	hasMorePages: false,

	messagesControllers: [],
	selectedMessagesControllers: Ember.computed.filterBy("messagesControllers", "isSelected", true),
	selectedMessageCount: Ember.computed.alias("selectedMessagesControllers.length"),
	hasSelectedMessages: Ember.computed.gt("selectedMessageCount", 0),

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
			this.get("messagesControllers").addObject(messageRow)
		},
		unregisterMessageRow: function (messageRow) {
			this.get("messagesControllers").removeObject(messageRow)
		},

		loadMoreMessages: function () {
			this.loadMoreMessages()
		},

		deleteSelectedMessages: function () {
			Ember.Logger.debug("Action received: Delete selected messages")

			let box = this.get("box.model")
			let self = this
			this.get("selectedMessagesControllers").forEach(function (controller) {
				var message = controller.get("model")
				self.api.deleteMessage(box, message)
					.done(function () {
						self.unloadMessage(message)
						Ember.$.snackbar({
							content: "Message deleted",
							timeout: 3000,
						})
					}).fail(function (jqXHR, textStatus) {
						Ember.Logger.error("Failed to delete the message: " + textStatus)
						Ember.$.snackbar({
							content: "The server can not delete the message: " + textStatus,
							style: "error",
							timeout: 3000,
						})
					})
			})
		},

		moveSelectedMessages: function (newBox) {
			Ember.Logger.debug("Action received: Move selected messages")
			let currentBox = this.get("box.model")
			let self = this
			this.get("selectedMessagesControllers").forEach(function (controller) {
				var message = controller.get("model")
				self.api.moveMessage(currentBox, message, newBox).then(function () {
					Ember.$.snackbar({
						content: "Message moved to " + newBox.get("name") + " !",
						timeout: 3000,
					})
				}, function () {
					Ember.$.snackbar({
						content: "Failed to move the message :(<br/>Maybe you should try to move it later",
						style: "error",
						timeout: 3000,
					})
				})
			})

			// Update the page
			this.transitionToRoute("box")
		},
	},

	updatePageSize: function () {
		var windowHeight = Ember.$(window).height()
		Ember.Logger.debug("Windows height: " + windowHeight)
		var pageSize = Math.floor((windowHeight - 150) / 45)
		Ember.Logger.debug("pageSize: " + pageSize)
		this.set("pageSize", pageSize)
	},

	loadMessage: function (message) {
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

	unloadMessage: function (message) {
		let categories = this.get("model")
		for (let i = 0; i < categories.length; i++) {
			if (categories[i].get("messages").contains(message)) {
				// Remove the message from the category
				Ember.Logger.debug("Message#" + message.get("uid") + " removed from controller list")
				categories[i].get("messages").removeObject(message)

				// Remove the category if empty
				if (categories[i].get("messages").length === 0) {
					categories.removeObject(categories[i])
				}
				return
			}
		}
		Ember.Logger.warn("The Message#" + message.get("uid") + " can not be found in the controller list")

	},

	loadMoreMessages: function () {
		if (this.get("isMessagesLoading")) {
			return
		} else {
			this.set("isMessagesLoading", true)
		}

		// Get variables
		var messagesOrder = this.get("messages.model")
		let box = this.get("box.model")
		var pageSize = this.get("pageSize")
		var currentPage = this.get("currentPage")
		var nextPage = currentPage + 1
		var totalElements = box.get("messageCount")
		var lastPage = Math.ceil(totalElements / pageSize) - 1
		if (currentPage >= lastPage) {
			Ember.Logger.info("Try to load more message (page#" + nextPage + ") but no more pages are available (lastPage: " + lastPage + ")")
			this.set("hasMorePages", false)
			this.set("isMessagesLoading", false)
			return
		}

		// Load the initial messages
		Ember.Logger.debug("Getting the message page#" + nextPage + "[" + pageSize + "] of box#" + box.get("path"))
		var idMin = Math.max(0, nextPage * pageSize)
		var idMax = Math.min(totalElements - 1, idMin + pageSize) + 1
		var self = this
		var ids = messagesOrder.slice(idMin, idMax)
		this.api.getMessagesByIds(box, ids).then(function (newMessages) {
			self.api.downloadMessagesPreview(box, newMessages).then(function () {

				// Insert the messages
				var newMessagesReversed = newMessages.reverse()
				Ember.$.each(newMessagesReversed, function (index, message) {
					self.loadMessage(message)
				})

				// Update var
				self.set("hasMorePages", nextPage < lastPage)
				self.set("currentPage", nextPage)
				self.set("isMessagesLoading", false)
			})
		})
	},
})
