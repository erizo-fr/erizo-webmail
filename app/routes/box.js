import Ember from "ember";
import Api from "erizo-webmail/utils/api";

export default Ember.Route.extend({
	model: function (param) {
		var boxPath = param.box;
        Ember.Logger.assert(boxPath);
        
        return Api.getBox(boxPath);
	}
});
