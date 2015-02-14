Client.ThreadMessageComposerAddressesComponent = Ember.Component.extend({
    addresses: [],
    placeholder: '',

    magicSuggestInstance: null,

    addressesChanged: function () {
        var addresses = this.get('addresses');
        Ember.Logger.debug('Addresses property changed: ' + JSON.stringify(addresses));
        var instance = this.get('magicSuggestInstance');
        instance.setSelection(addresses);
    }.observes('addresses'),

    didInsertElement: function () {
        //Get var
        var placeholder = this.get('placeholder');
        var addresses = this.get('addresses');

        //Init auto complete addresses
        var instance = this.$('input').magicSuggest({
            data: [{
                "name": "Person 1",
                "address": "person1@test.com",
                "mailbox": "person1",
                "host": "test.com"
            }, {
                "name": "Person 2",
                "address": "person2@test.com",
                "mailbox": "person2",
                "host": "test.com"
            }, {
                "name": "Person 3",
                "address": "person3@test.com",
                "mailbox": "person3",
                "host": "test.com"
            }, {
                "name": "Person 4",
                "address": "person4@test.com",
                "mailbox": "person4",
                "host": "test.com"
            }],
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
                    data.name + '</p> \
            </div> \
            </div>';
                return result;
            }
        });
        instance.setSelection(addresses);


        //Update the value when CKEditor content change
        var self = this;
        $(instance).on('selectionchange', function (e, m, records) {
            Ember.Logger.debug('Addresses component onSelectionChange event fired: ' + JSON.stringify(records));
            self.set('addresses', records);
        });

        //Save the instance
        this.set('magicSuggestInstance', instance);
    }
});