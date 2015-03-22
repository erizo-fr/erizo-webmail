import Ember from "ember";
import EmailFactory from "erizo-webmail/models/factories/email";

export default Ember.Component.extend({
    addresses: [],
    placeholder: '',

    magicSuggestInstance: null,

    addressesChanged: function () {
        var addresses = this.get('addresses');
        Ember.Logger.debug('Addresses property changed: ' + JSON.stringify(addresses));
        var instance = this.get('magicSuggestInstance');

        //Set selection
        var elements = [];
        addresses.forEach(function (address) {
            elements.push(address.toJSON());
        });
        instance.clear(true);
        instance.setSelection(elements);
    }.observes('addresses'),

    didInsertElement: function () {
        //Get var
        var placeholder = this.get('placeholder');
        var addresses = this.get('addresses');

        //Init auto complete addresses
        var instance = this.$('.ms-instance').magicSuggest({
            selectFirst: true,
            allowFreeEntries: true,
            allowDuplicates: false,
            hideTrigger: true,
            minChars: 1,
            maxSuggestions: 5,
            placeholder: placeholder,
            displayField: 'displayName',
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
        instance.empty();
        instance.clear(true);
        instance.setSelection(addresses);

        //Update the value when addresses field change
        var self = this;
        $(instance).on('blur', function () {
            var records = instance.getSelection();
            Ember.Logger.debug('Addresses component blur event fired: ' + JSON.stringify(records));

            //Convert records into model objects
            var addresses = EmailFactory.createEmailArray(records);
            self.set('addresses', addresses);
        });

        //Save the instance
        this.set('magicSuggestInstance', instance);
    }
});