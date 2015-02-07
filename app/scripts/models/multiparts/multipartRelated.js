require('scripts/models/multiparts/multipart');

Client.Model.MultiPartRelated = Client.Model.MultiPart.extend({
    htmlMessage: function() {
        var subparts = this.get('subparts')
        if(subparts === null || subparts.length < 1) {
            return null;
        }

        var rootContent = subparts[0].get('htmlMessage');
        for(var i=1; i<subparts.length; i++) {
            //TODO: Inject the related part into the root content
        }
        return rootContent;
    }.property('subparts', 'subparts.@each.htmlMessage'),

    textMessage: function() {
        var subparts = this.get('subparts')
        if(subparts === null || subparts.length < 1) {
            return null;
        }

        return subparts[0].getTextMessage();
    }.property('subparts', 'subparts.@each.textMessage')
});
