Client.ApiHelper = {};


//#####################################################
// Get user data
// URL: GET /userdata
//#####################################################

Client.ApiHelper.getUserData = function () {
    Ember.Logger.debug('getUserData()');
    return Ember.$.ajax({
        url: Client.REST_SERVER + '/account/data',
        type: 'GET',
        dataType: 'json'
    }).then(function (result) {
        return Client.Model.UserData.createUserData(result);
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

    if (seqMin > seqMax) {
        return [];
    }

    return Ember.$.ajax({
            url: Client.REST_SERVER + '/boxes/' + boxPath + '/messages?seqs=' + seqMin + ':' + seqMax + '&fetchStruct=true&fetchEnvelope=true',
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
        return new Client.Model.Message(result);
    });
};

Client.ApiHelper.downloadBodyPartContent = function (boxPath, message, bodyPart) {
    var partId = bodyPart.get('partID');
    Ember.Logger.assert(partId);

    //Ask the server for the part content
    Ember.Logger.debug('Ask the server for part#' + partId + ' of message#' + message.seq + ' in box#' + boxPath);
    return Ember.$.ajax({
        url: Client.REST_SERVER + '/boxes/' + boxPath + '/messages/' + message.uid + '?&markSeen=true&bodies=' + partId,
        type: 'GET',
        dataType: 'json'
    }).then(function (result) {
        Ember.Logger.assert(result.bodies[partId]);
        bodyPart.set('content', result.bodies[partId]);
        Ember.Logger.debug('Part#' + partId + ' of message#' + message.seq + ' in box#' + boxPath + ' received. Length: ' + bodyPart.get('content').length);
    });
};

Client.ApiHelper.downloadPartsContent = function (boxPath, message, parts) {
    Ember.Logger.assert(boxPath);
    Ember.Logger.assert(message);
    Ember.Logger.assert(parts);

    var promises = [];
    for (var i = 0; i < parts.length; i++) {
        var promise = Client.ApiHelper.downloadBodyPartContent(boxPath, message, parts[i]);
        promises.push(promise);
    }

    return Ember.RSVP.all(promises);
};

Client.ApiHelper.downloadMessagesPreview = function (boxPath, messages) {
    Ember.Logger.assert(boxPath);
    Ember.Logger.assert(messages);

    var promises = [];
    for (var i = 0; i < messages.length; i++) {
        var promise = Client.ApiHelper.downloadMessagePreview(boxPath, messages[i]);
        promises.push(promise);
    }

    return Ember.RSVP.all(promises);
};

Client.ApiHelper.downloadMessagePreview = function (boxPath, message) {
    Ember.Logger.assert(boxPath);
    Ember.Logger.assert(message);
    Ember.Logger.assert(message.part);

    Ember.Logger.debug('Ask the server for preview parts of message#' + message.seq + ' in box#' + boxPath);
    var parts = message.part.get('previewParts');
    return Client.ApiHelper.downloadPartsContent(boxPath, message, parts);
};

Client.ApiHelper.downloadMessageDisplayContent = function (boxPath, message) {
    Ember.Logger.assert(boxPath);
    Ember.Logger.assert(message);
    Ember.Logger.assert(message.part);

    Ember.Logger.debug('Ask the server for displayable parts of message#' + message.seq + ' in box#' + boxPath);
    var parts = message.part.get('displayParts');
    return Client.ApiHelper.downloadPartsContent(boxPath, message, parts);
};

Client.ApiHelper.downloadMessagesDisplayContent = function (boxPath, messages) {
    Ember.Logger.assert(boxPath);
    Ember.Logger.assert(messages);

    var promises = [];
    for (var i = 0; i < messages.length; i++) {
        var promise = Client.ApiHelper.downloadMessageDisplayContent(boxPath, messages[i]);
        promises.push(promise);
    }

    return Ember.RSVP.all(promises);
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

    var data = {
        from: Client.ApiHelper.sendMessageEmailFormatter(message.get('from')),
        to: Client.ApiHelper.sendMessageEmailFormatter(message.get('to')),
        cc: Client.ApiHelper.sendMessageEmailFormatter(message.get('cc')),
        bcc: Client.ApiHelper.sendMessageEmailFormatter(message.get('bcc')),
        subject: message.get('subject'),
        html: message.get('htmlBody'),
        text: message.get('textBody'),
    };
    var stringData = JSON.stringify(data);
    Ember.Logger.debug('API Message : ' + stringData + '');

    return Ember.$.ajax({
        url: Client.REST_SERVER + '/messages',
        type: 'POST',
        contentType: 'application/json',
        data: stringData,
    });
};

Client.ApiHelper.sendMessageEmailFormatter = function (emails) {
    if (emails instanceof Array) {
        var result = [];
        emails.forEach(function (email) {
            result.push(Client.ApiHelper.sendMessageEmailFormatter(email));
        });
        return result;
    } else {
        if (!emails) {
            return;
        }

        var result = {};
        if (emails.get('name')) {
            result.name = emails.get('name');
        }
        if (emails.get('address')) {
            result.address = emails.get('address');
        }
        return result;
    }
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