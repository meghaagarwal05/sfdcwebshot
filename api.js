var fs = require('fs');
var temp = require('temp');
var webshot = require('webshot');

/**
 * Generates a PNG image for a URL
 *
 * @param  {String}     url                 The URL for which to generate a PNG image
 * @param  {Object}     [options]           A set of options that manipulate the image
 * @param  {Number}     [options.width]     The desired width (in pixels) for the generated image, default: 1024
 * @param  {Number}     [options.height]    The desired height (in pixels) for the generated image, default 768
 * @param  {Number}     [options.delay]     The delay (in milliseconds) before the screenshot, default 0, maximum 10000
 * @param  {String}     [options.userAgent] An optional user agent, defaults to an empty string
 * @param  {Boolean}    [options.full]      If specified, the entire webpage will be screenshotted and the `options.height` property will be ignored
 * @param  {Function}   callback            A standard callback function
 * @param  {Object}     callback.err        An error object (if any)
 * @param  {String}     callback.path       The path on disk where the image is stored
 */
var generate = module.exports.generate = function(url, options, callback) {
    options = options || {};
    options.width = options.width || 1024;
    options.height = options.height || 768;
    options.delay = options.delay || 0;
    options.userAgent = options.userAgent || '';

    if (options.delay > 10000) {
        options.delay = 10000;
    }

    screengrab(url, options, callback);
};

/**
 * Take a screenshot of url
 *
 * @param  {String}     url             The URL for which to generate a PNG image
 * @param  {Object}     options         A set of options that manipulate the page
 * @param  {Function}   callback        A standard callback function
 * @param  {Object}     callback.err    An error object (if any)
 * @param  {String}     callback.path   The path on disk where the image is stored
 * @api private
 */
var screengrab = function(url, options, callback) {
    var tempPath = temp.path({suffix: '.png'});

    var webshotOptions = {
        'renderDelay': options.delay,
        'windowSize': {
            'width': options.width,
            'height': options.height
        },
        'shotSize': {
            'width': 'window',
            'height': (options.full === true) ? 'all' : 'window'
        },
        'userAgent': options.userAgent,
        'phantomConfig': {
            'ignore-ssl-errors': true,
            'ssl-protocol': 'any'
        }
    };

    webshot(url, tempPath, webshotOptions, function(err) {
        if (err) {
            return callback({'code': 500, 'msg': 'Unable to take a screenshot'});
        }

        return callback(null, tempPath);
    });
};
