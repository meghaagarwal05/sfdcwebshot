
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var apiRoutes = require('./routes/api');
var http = require('http');
var path = require('path');

var app = express();

// All environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use('/static', express.static(path.join(__dirname, 'static')));

//Arvind Changes
var winston = require('winston');
winston.level = 'debug';

var jsforce = require('jsforce');
var express = require('express');
var bodyParser = require('body-parser');

var Q = require('q');

var config = require('./routes/Config');
//var viewReport = require('./lib/ViewReport');
//var submitJob = require('./lib/SubmitJob');

var app = express();

/* Template engine */
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

//
// OAuth2 client information can be shared with multiple connections.
//
var oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  //loginUrl    : 'https://fullsb-fullsb-rvision-fullsb.cs51.force.com',
  //clientId    : '3MVG9PbQtiUzNgN5olbMCSLduq260ug3bOrlun8ODxHfOTMZMZ_CbboURKTqS6PtWuSV5asiuvZY9HYE5q6AP',
  //clientSecret: '9151014354907741400',

  //Arvind's Rehrig Partner Dev Org  :Dev8@appirio.com Password: arvind@123
  loginUrl    : process.env.SFDC_LOGINURL,
  clientId    : process.env.SFDC_CLIENTID,
  clientSecret: process.env.SFDC_CLIENTSECRET,
  redirectUri : process.env.SFDC_REDIRECTURL

});



//
// Get authz url and redirect to it.
//
app.get('/oauth2/auth', function(req, res) {
  res.redirect(oauth2.getAuthorizationUrl({
     scope: 'api full refresh_token',
     state: req.params.state
  }));
});


//
// Pass received authz code and get access token
//
app.get('/oauth2/callback', function(req, res) {
  var conn = new jsforce.Connection({ oauth2: oauth2 });
  var code = req.param('code');
  var state = req.param('state');

  winston.debug('code', code);

  conn.authorize(code, function(err, userInfo) {
    if (err) {
      winston.error('Error during callback while trying to authorize code:', err);
      res.redirect('/');
      return;
    }
    // Now you can get the access token, refresh token, and instance URL information.
    // Save them to establish connection next time.
    var savedCredentials = {
      loginUrl    : conn.loginUrl,
      accessToken : conn.accessToken,
      refreshToken: conn.refreshToken,
      instanceUrl : conn.instanceUrl,
      userId      : userInfo.id
    };
    winston.debug(savedCredentials);
    res.redirect('/');

   
});
});
// Development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', function(req, res) {
  if (req.query.url) {
    res.redirect('/api/generate?url=' + req.query.url);
  } else {
    return routes.index(req, res);
  }
});
app.get('/api/generate', apiRoutes.generate);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
