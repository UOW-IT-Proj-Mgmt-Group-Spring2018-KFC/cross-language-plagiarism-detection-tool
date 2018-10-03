$(function() {
    $.FormValidator.init('sign-in-form');

    $('#verification-image').click(function() {
        $(this).attr('src', 'VerificationCodes' + '?' + Math.random()); // random!
    });

    $('#sign-in-button').click(function() {

        $('#error-info').hide();

        var r = $.FormValidator.validate('sign-in-form');
        if (false == r) {
            // !!!
            // $.mobile.changePage('file_list.html');

            return;
        }
        
        var email = $('#email').val().trim();
        // var username = $('#username').val().trim();
        var password = $('#password').val().trim();
        // var verificationCodes = $('#verification-codes').val().trim();
        
        // go sign in
        var ajaxData = 'email=' + email +
            // 'username=' + username +
            '&password=' + password + 
            // '&verification-codes=' + verificationCodes +
            '&remember-me=' + $('#remember-me').prop('checked');

        $.ajax({
            dataType: "json",
            type: 'POST',
            url: 'signin',
            data: ajaxData,
            success: function (data) {

                if (data.wantVerificationCodes) {
                    $('#verification').show();
                    $('#verification-codes').addClass('auto-validate');
                }

                if (data.success) {
                    $.mobile.changePage(data.url);
                } else {
                    $('#verification-image').trigger('click');
                    
                    if (data.errmsg == "verification code is incorrect") {
                        $('#verification-codes-info').html(data.errmsg);
                        $('#verification-codes-info').show();
                        $('#verification-codes').focus();
                    } else {
                        $('#error-info').html(data.errmsg);
                        $('#error-info').show();
                        $('#email').focus();
                    }
                }
            }
        });
    });
});