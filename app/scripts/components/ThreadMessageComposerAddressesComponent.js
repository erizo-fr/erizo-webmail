Client.ThreadMessageComposerAddressesComponent = Ember.Component.extend({
    addresses: [],
    placeholder: '',

    didInsertElement: function () {
        //Get var
        var placeholder = this.get('placeholder');

        //Init auto complete addresses
        var instance = this.$('input').magicSuggest({
            data: ['Paris', 'New York', 'London', 'Roma'],
            selectFirst: true,
            allowFreeEntries: true,
            allowDuplicates: false,
            minChars: 1,
            maxSuggestions: 5,
            placeholder: placeholder,
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


        //Update the value when CKEditor content change
        var self = this;
        $(instance).on('selectionchange', function (e, m, records) {
            Ember.Logger.debug('Addresses component onSelectionChange event fired: ' + records);
            self.set('addresses', records);
        });
    }
});