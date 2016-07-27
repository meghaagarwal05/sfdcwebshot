/*
  AppXpress Orderbot:  Order processor for AppXpress.com

  config library

  (c) Appirio 2015
*/

var Q = require('q');
var winston = require('winston');

var jsforce = require('jsforce');

/*
  Load configuration parameters
*/
var config = {};


var options = {
  useCache: true
};

var cache = {};


config.getCredentials = function( userId ) {
  var deferred = Q.defer();

  // if ( !process.env.hasOwnProperty('ENVIRONMENT') ) {
  //   deferred.reject('ENVIRONMENT is not set.  Try setting to production or stage');
  //   return deferred.promise;
  // }

  if ( options.useCache && cache.hasOwnProperty(userId) ) {
    winston.debug('getConfig Found setting in cache for ', userId);
    deferred.resolve(cache[userId]);
    return deferred.promise;
  }
  winston.info('Asking for configuration from Salesforce for setting ', userId);

  var conn = new jsforce.Connection({
    loginUrl: process.env.SFDC_CREDENTIALS_KEEPER_LOGINURL
  });
  conn.login(
    process.env.SFDC_CREDENTIALS_KEEPER_USERNAME,
    process.env.SFDC_CREDENTIALS_KEEPER_PASSWORD,
    function(err, res) {
      if (err) {
        deferred.reject(err);
        console.error(err);
      }
      console.log('Successfully logged into credentials keeper');
      console.log('Retrieving information on userId: ' + userId);

      conn.sobject('User').retrieve(userId, function(err, userRecord) {
        if (err) {
          deferred.reject(err);
          console.error(err);
        }
        var savedCredentials = {
          loginUrl    : process.env.SFDC_LOGINURL,
          accessToken : userRecord.AccessToken__c,
          refreshToken: userRecord.RefreshToken__c,
          instanceUrl : userRecord.InstanceUrl__c
        };
        console.log(savedCredentials);
        deferred.resolve(savedCredentials);
      });
    });

    return deferred.promise;
};


config.storeCredentials = function(credentials) {
  winston.log(credentials);
};

module.exports = config;
