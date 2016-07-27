var URL_REGEX = /^(?:(?:https?):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*    [a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?/i;

$(document).ready(function() {
    $('.js-generate').submit(function(e) {
        e.preventDefault();
        var url = $('#url').val();
        var width = $('#width').val();
        var height = $('#height').val();
        var delay = $('#delay').val();
        var userAgent = $('#userAgent').val();
        var full = $('#full').is(':checked');

        // Validate if "something" was provided as a URL
        if (!url || url === '') {
            $('#url').parent().addClass('error');
            return;
        }

        if (url.indexOf('http') !== 0) {
            url = 'http://' + url;
        }

        // Validate that the "something" that was provided is in fact a URL
        if (!URL_REGEX.test(url)) {
            $('#url').parent().addClass('error');
            return;
        }

        url = encodeURIComponent(url);

        $('#url').parent().removeClass('error');

        var src = '/api/generate?url=' + url + '&width=' + width + '&height=' + height + '&delay=' + delay + '&full=' + full + '&userAgent=' + userAgent;

        $('.js-generate-btn').html('<i class="fa fa-spinner fa-spin"></i> Generating - this should only take a moment ...');

        $('#results img#webshot').load(function() {
          $('#results').show();
          $('.js-generate-btn').html('Generate');
          // scroll to results section
          $('html, body').animate({
              scrollTop: $('#results').offset().top - 30
          }, 'slow');
        });
        $('#results #url').text(src).attr('href', src);

        $('#results img#webshot').attr('src', '');
        $('#results img#webshot').attr('src', src);
        $('#results img#webshot').attr('width', width);
        $('#results img#webshot').attr('height', height);
    });
});
