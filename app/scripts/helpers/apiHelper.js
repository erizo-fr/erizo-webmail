Client.ApiHelper = {};


//#####################################################
// Get user data
// URL: GET /userdata
//#####################################################

Client.ApiHelper.getUserData = function () {
    Ember.Logger.debug('getUserData()');
    return Ember.$.ajax({
        url: Client.REST_SERVER + '/account/userdata',
        type: 'GET',
        dataType: 'json'
    });
};

//#####################################################
// Get boxes
// URL: GET /boxes
//#####################################################

Client.ApiHelper.getBoxes = function () {
    Ember.Logger.debug('getBoxes()');
    return Ember.$.ajax({
            url: Client.REST_SERVER + '/boxes',
            type: 'GET',
            dataType: 'json'
        }).then(function (boxes) {
            return Client.ApiHelper.getBoxesAdapter(boxes);
        }).then(Client.ApiHelper.getBoxesSorter)
        .then(Client.ApiHelper.getBoxesResultLogger);
};

Client.ApiHelper.getBoxesAdapter = function (boxes, path) {
    //Transform object to array
    var adaptedBoxes = [];
    if (boxes) {
        for (var boxName in boxes) {
            if (boxes.hasOwnProperty(boxName)) {
                var box = boxes[boxName];
                box.name = boxName;
                box.path = path === undefined ? box.name : path + box.name;
                box.children = Client.ApiHelper.getBoxesAdapter(box.children, box.path + box.delimiter);

                adaptedBoxes.push(box);
            }
        }
    }
    return adaptedBoxes;
};

Client.ApiHelper.getBoxesSorter = function (boxes) {
    var sortedBoxes = boxes.sort(function (box1, box2) {
        if (box1 === null && box2 === null) {
            return 0;
        }
        if (box1 === null || box2 === null) {
            return box1 === null ? 1 : -1;
        }

        if (box1.name === box2.name) {
            return 0;
        }

        //Inbox first
        if (box1.name === 'INBOX') {
            return -1;
        }
        if (box2.name === 'INBOX') {
            return 1;
        }

        //Special attributes then
        if (box1.special_use_attrib && box2.special_use_attrib) {
            return box1.special_use_attrib > box2.special_use_attrib ? 1 : -1;
        }
        if (box1.special_use_attrib) {
            return -1;
        }
        if (box2.special_use_attrib) {
            return 1;
        }

        //Others
        return box1.name > box2.name ? 1 : -1;
    });

    return sortedBoxes;
};

Client.ApiHelper.getBoxesResultLogger = function (boxes) {
    Ember.Logger.debug('boxes=' + JSON.stringify(boxes));
    return boxes;
};



//#####################################################
// Get box
// URL: GET /boxes/:boxPath
//#####################################################

Client.ApiHelper.getBox = function (boxPath) {
    Ember.Logger.debug('getBox(' + boxPath + ')');
    Ember.Logger.assert(boxPath);

    return Ember.$.ajax({
        url: Client.REST_SERVER + '/boxes/' + boxPath,
        type: 'GET',
        dataType: 'json'
    }).then(function (box) {
        box.path = boxPath;
        return box;
    }).then(Client.ApiHelper.getBoxResultLogger);
};

Client.ApiHelper.getBoxResultLogger = function (box) {
    Ember.Logger.debug('box=' + JSON.stringify(box));
    return box;
};


//#####################################################
// Get messages
// URL: GET /boxes/:boxPath/messages
//#####################################################

Client.ApiHelper.getMessages = function (boxPath, seqMin, seqMax) {
    Ember.Logger.debug('getMessages(' + boxPath + ', ' + seqMin + ', ' + seqMax + ')');
    Ember.Logger.assert(boxPath);
    Ember.Logger.assert(seqMin);
    Ember.Logger.assert(seqMax);

    return Ember.$.ajax({
            url: Client.REST_SERVER + '/boxes/' + boxPath + '/messages?seqs=' + seqMin + ':' + seqMax + '&fetchEnvelope=true',
            type: 'GET',
            dataType: 'json'
        }).then(Client.ApiHelper.getMessagesAdapter)
        .then(Client.ApiHelper.getMessagesResultLogger);
};

Client.ApiHelper.getMessagesAdapter = function (messages) {
    var adaptedMessages = [];
    for (var i = 0; i < messages.length; i++) {
        adaptedMessages.push(new Client.Model.Message(messages[i]));
    }
    return adaptedMessages;
};

Client.ApiHelper.getMessagesResultLogger = function (messages) {
    Ember.Logger.debug('messages=' + JSON.stringify(messages));
    return messages;
};


//#####################################################
// Get message
// URL: GET /boxes/:boxPath/messages/:messageId
//#####################################################

Client.ApiHelper.getMessage = function (boxPath, messageId) {
    Ember.Logger.debug('getMessage(' + boxPath + ', ' + messageId + ')');
    Ember.Logger.assert(boxPath);
    Ember.Logger.assert(messageId);

    return Ember.$.ajax({
        url: Client.REST_SERVER + '/boxes/' + boxPath + '/messages/' + messageId + '?fetchStruct=true&fetchEnvelope=true&markSeen=true',
        type: 'GET',
        dataType: 'json'
    }).then(function (result) {
        //Download the parts displayed
        var message = new Client.Model.Message(result);
        return Client.ApiHelper.downloadNeededParts(boxPath, messageId, message.part).then(function (result) {
            return message;
        });
    });
};

Client.ApiHelper.downloadPartContent = function (boxPath, messageId, part) {
    var partId = part.info.partID;
    Ember.Logger.assert(partId);

    //Ask the server for the part content
    part.content = null;
    part.decodedContent = null;
    Ember.Logger.info('Ask the server for part#' + partId + ' of message#' + messageId + ' in box#' + boxPath);
    return Ember.$.ajax({
        url: Client.REST_SERVER + '/boxes/' + boxPath + '/messages/' + messageId + '?&markSeen=true&bodies=' + partId,
        type: 'GET',
        dataType: 'json'
    }).then(function (result) {
        Ember.Logger.assert(result.bodies[partId]);

        part.content = result.bodies[partId];
        Ember.Logger.debug('Part#' + partId + ' of message#' + messageId + ' in box#' + boxPath + ' received. Length: ' + part.content.length);
        return part.content;
    });
};

Client.ApiHelper.downloadNeededParts = function (boxPath, messageId, part) {
    Ember.Logger.assert(boxPath);
    Ember.Logger.assert(messageId);
    Ember.Logger.assert(part);

    var neededParts = [];
    if (part.isNeeded()) {
        var downloadPromise = Client.ApiHelper.downloadPartContent(boxPath, messageId, part);
        neededParts.push(downloadPromise);
    }

    for (var i = 0; i < part.subParts.length; i++) {
        var neededSubparts = Client.ApiHelper.downloadNeededParts(boxPath, messageId, part.subParts[i]);
        neededParts = neededParts.concat(neededSubparts);
    }

    return Ember.RSVP.all(neededParts);
};


//#####################################################
// Login
// URL: POST /login
//#####################################################

Client.ApiHelper.login = function (username, password) {
    Ember.Logger.debug('login(' + username + ', ***********)');
    Ember.Logger.assert(username);
    Ember.Logger.assert(password);

    return Ember.$.ajax({
        url: Client.REST_SERVER + '/login',
        type: 'POST',
        data: {
            username: username,
            password: password
        },
    });
};

//#####################################################
// Send message
// URL: POST /messages
//#####################################################

Client.ApiHelper.sendMessage = function (message) {
    Ember.Logger.debug('sendMessage(' + message + ')');
    Ember.Logger.assert(message);

    return Ember.$.ajax({
        url: Client.REST_SERVER + '/messages',
        type: 'POST',
        data: message,
    });
};

//#####################################################
// Delete message
// URL: DELETE /boxes/:boxPath/messages/:messageId
//#####################################################

Client.ApiHelper.deleteMessage = function (boxPath, messageId) {
    Ember.Logger.debug('deleteMessage(' + boxPath + ', ' + messageId + ')');
    Ember.Logger.assert(boxPath);
    Ember.Logger.assert(messageId);

    return Ember.$.ajax({
        url: Client.REST_SERVER + '/boxes/' + boxPath + '/messages/' + messageId,
        type: 'DELETE'
    });
};
