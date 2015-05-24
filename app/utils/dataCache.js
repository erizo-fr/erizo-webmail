import Ember from "ember"

export default Ember.Object.extend({

	getDataKey: function (type, id) {
		return "data_" + type + "_" + id
	},

	getData: function (type, id) {
		Ember.Logger.assert(type)
		Ember.Logger.assert(id)
		// Test the store
		if (!sessionStorage) {
			Ember.Logger.debug("Session storage is disable")
			return null
		}

		// Get the data
		let dataKey = this.getDataKey(type, id)
		let data
		try {
			let rawData = sessionStorage[dataKey]
			if (!rawData) {
				return null
			}
			data = JSON.parse(rawData)
		} catch (e) {
			Ember.Logger.warn("Failed to read dataCache#" + dataKey, e)
			return null
		}

		// Return the data
		Ember.Logger.debug("Get dataCache#" + dataKey + ": " + data)
		return data
	},

	storeData: function (type, id, data) {
		Ember.Logger.assert(type)
		Ember.Logger.assert(id)
		Ember.Logger.assert(data)
		// Test the store
		if (!sessionStorage) {
			Ember.Logger.debug("Session storage is disable")
			return
		}

		// Set data
		let dataKey = this.getDataKey(type, id)
		Ember.Logger.debug("Set dataCache#" + dataKey + ": " + data)
		try {
			sessionStorage[dataKey] = JSON.stringify(data)
		} catch (e) {
			Ember.Logger.warn("Failed to write dataCache#" + dataKey, e)
		}
	},
}).create()
