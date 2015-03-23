/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');

var app = new EmberApp();

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

app.import('bower_components/animate.css/animate.min.css');
app.import('bower_components/moment/moment.js');
app.import('bower_components/moment-timezone/builds/moment-timezone-with-data.min.js');
app.import('bower_components/quoted-printable/quoted-printable.js');
app.import('bower_components/utf8/utf8.js');

//Magicsuggest
app.import('bower_components/magicsuggest/magicsuggest-min.js');

//Arrive.js
app.import('bower_components/arrive/minified/arrive.min.js');

//Bootstrap
app.import('bower_components/bootstrap/dist/css/bootstrap.min.css');
app.import('bower_components/bootstrap/dist/js/bootstrap.min.js');
app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', {
    destDir: 'fonts'
});

//Bootstrap - jasny
app.import('bower_components/jasny-bootstrap/dist/css/jasny-bootstrap.min.css');
app.import('bower_components/jasny-bootstrap/dist/js/jasny-bootstrap.min.js');

//Bootstrap - Material design
app.import('bower_components/bootstrap-material-design/dist/css/ripples.min.css');
app.import('bower_components/bootstrap-material-design/dist/css/ripples.min.css.map', {
    destDir: 'assets'
});
app.import('bower_components/bootstrap-material-design/dist/js/ripples.min.js');
app.import('bower_components/bootstrap-material-design/dist/js/ripples.min.js.map', {
    destDir: 'assets'
});
app.import('bower_components/bootstrap-material-design/dist/js/material.min.js');
app.import('bower_components/bootstrap-material-design/dist/fonts/Material-Design-Icons.woff', {
    destDir: 'fonts'
});

//CKEditor
var ckeditor = pickFiles('bower_components/ckeditor', {
   srcDir: '/',
   destDir: '/assets/ckeditor'
});

//CKEditor Bootstrap skin
var ckeditorSkin = pickFiles('bower_components/bootstrapck4-skin/skins/bootstrapck', {
   srcDir: '/',
   destDir: '/assets/bootstrapck'
});


// Merge the app tree and our new font assets.
module.exports = mergeTrees([app.toTree(), ckeditor, ckeditorSkin]);