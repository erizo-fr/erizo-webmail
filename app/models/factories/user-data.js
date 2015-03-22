import Ember from "ember";
import UserData from "erizo-webmail/models/user-data";

export default Ember.Object.extend({
    createUserData: function (data) {
        if (!data) {
            data = {};
        }

        return UserData.create(data);
    }
}).create();