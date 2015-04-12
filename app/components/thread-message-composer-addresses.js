import Ember from "ember";
import Api from "erizo-webmail/utils/api";
import EmailFactory from "erizo-webmail/models/factories/email";


let REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
	'(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';


export default Ember.Component.extend({
	addresses: [],
	placeholder: '',

	instance: null,

	addressesChanged: function () {
		var addresses = this.get('addresses');
		Ember.Logger.debug('Addresses property changed: ' + JSON.stringify(addresses));
		var instance = this.get('instance');

		//Set selection
		instance.clear(true);
		Ember.$.each(addresses, function (index, value) {
			instance.addOption(value.toJSON());
			instance.addItem(value.get('address'), true);

		});
	}.observes('addresses'),

	didInsertElement: function () {
		//Init auto complete addresses instance
		let self = this;
		let instance;
		let element = this.$('.address-component-instance').selectize({
			persist: false,
			maxItems: 10,
			maxOptions: 10,
			valueField: 'address',
			optgroupField: 'displayName',
			openOnFocus: false,
			searchField: ['address', 'displayName'],
			hideSelected: true,
			closeAfterSelect: true,
			create: function (input) {
				Ember.Logger.debug('Create new option from input: ' + input);
				return EmailFactory.createEmail(input).toJSON();
			},
			createFilter: function (input) {
				// email@address.com
				let regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
				let match = input.match(regex);
				if (match) {
					return !this.options.hasOwnProperty(match[0]);
				}

				// name <email@address.com>
				regex = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
				match = input.match(regex);
				if (match) {
					return !this.options.hasOwnProperty(match[2]);
				}

				Ember.Logger.info('The input does not match the email pattern: ' + input);
				return false;
			},
			render: {
				item: function (item, escape) {
					return '<div>' +
						(item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
						(item.address ? ' <span class="email">' + escape(item.address) + '</span>' : '') +
						'</div>';
				},
				option: function (item, escape) {
					if (item.name) {
						return '<div class="media"><div class="media-left"><div class="avatar"><i class="mdi-social-person"></i></div></div><div class="media-body"><strong>' + escape(item.name) + '</strong> <span class="email text-muted">' + escape(item.address) + '</span>' + '</div></div>';
					} else {
						return '<div class="media"><div class="media-left"><div class="avatar"><i class="mdi-social-person"></i></div></div><div class="media-body"><strong>' + escape(item.address) + '</strong></div></div>';
					}

				}
			},
			load: function (query, callback) {
				if (!query.length) {
					return callback();
				}
				Api.getContactsEmails(query, 10).then(function (emails) {
					let res = [];
					Ember.$.each(emails, function (index, email) {
						res.push(email.toJSON());
					});
					callback(res);
				});
			},
			onItemAdd: function (value) {
				Ember.Logger.debug('onItemAdd event fired: ' + JSON.stringify(value));

				//Convert records into model objects
				let option = instance.options[value];
				let address = EmailFactory.createEmail(option);
				self.get('addresses').pushObject(address);
			},
			onItemRemove: function (value) {
				Ember.Logger.debug('onItemRemove event fired: ' + JSON.stringify(value));

				//Convert records into model objects
				let option = instance.options[value];
				let address = EmailFactory.createEmail(option);
				self.get('addresses').removeObject(address);
			}
		});
		instance = element[0].selectize;


		//Save the instance
		this.set('instance', instance);
	}
});