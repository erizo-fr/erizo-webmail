Client.ThreadMessageComposerAddressesComponent = Ember.Component.extend({
	addresses: [],
	placeholder: '',

	magicSuggestInstance: null,

	addressesChanged: function () {
		var addresses = this.get('addresses');
		Ember.Logger.debug('Addresses property changed: ' + JSON.stringify(addresses));
		var instance = this.get('magicSuggestInstance');
		instance.removeFromSelection(instance.getSelection(), true);
		instance.setSelection(addresses);
	}.observes('addresses'),

	didInsertElement: function () {
		//Get var
		var placeholder = this.get('placeholder');
		var addresses = this.get('addresses');

		//Init auto complete addresses
		var instance = this.$('input').magicSuggest({
			data: [],
			selectFirst: true,
			allowFreeEntries: true,
			allowDuplicates: false,
			minChars: 1,
			maxSuggestions: 5,
			placeholder: placeholder,
			valueField: 'address',
			renderer: function (data) {
				var result =
					'<div class="media"> \
            <div class="media-left"> \
            <div class="avatar"> \
            <i class="mdi-social-person"></i> \
            </div> \
            </div> \
            <div class="media-body"> \
            <p>' +
					data.displayName + '</p> \
            </div> \
            </div>';
				return result;
			}
		});
		instance.setSelection(addresses);


		//Update the value when addresses field change
		var self = this;
		$(instance).on('blur', function () {
			var records = instance.getSelection();
			Ember.Logger.debug('Addresses component onSelectionChange event fired: ' + JSON.stringify(records));

			//Convert records into model objects
			var addresses = [];
			records.forEach(function (record) {
				addresses.push(Client.Model.Email.createEmail(record));
			});

			self.set('addresses', addresses);
		});

		//Save the instance
		this.set('magicSuggestInstance', instance);
	}
});