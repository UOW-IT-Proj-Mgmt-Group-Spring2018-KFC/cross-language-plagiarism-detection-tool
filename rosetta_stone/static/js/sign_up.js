$(function() {
    $.FormValidator.init('signup-form');

    $('#verification-image').click(function() {
        $(this).attr('src', 'VerificationCodes' + '?' + Math.random()); // random! 强制刷新
    });
    
    $('#ok-button').bind('click', function() {
        $('#info-dialog').popup('close');
        // $.mobile.changePage('sign_in.html');
    });

    $('#sign-up-button').click(function() {
        if (false == $.FormValidator.validate('signup-form')) {
            return;
        }

        var email = $('#email').val().trim();
        var password = $('#password').val().trim();
        var repassword = $('#repassword').val().trim();
        if (password != repassword) {
            $('#password-info').hide();
            $('#repassword-info').html('! You enter different password');
            $('#repassword-info').show();
            return;
        }
        
        var name = $('#name').val().trim();
        var gender = $("#gender").val();
        
        var yob = 0;
        var strYob = $('#yob').val().trim();
        try {
            yob = parseInt(strYob);
        } catch (exception) {
            console.log(exception);
        } finally {
            //
        }
        
        console.log(yob);

        var vPrivate = $('#private').prop('checked');
        var verificationCodes = $('#verification-codes').val().trim();
        
        // go sign in
        var ajaxData = 'email=' + email + 
            '&password=' + password + 
            '&repassword=' + repassword + 
            '&name=' + name + 
            '&gender=' + gender + 
            '&yob=' + yob + 
            '&private=' + vPrivate + 
            '&verification-codes=' + verificationCodes;
        
        $.ajax({
            dataType: "json",
            type: 'POST',
            url: 'SignUp',
            data: ajaxData,
            success: function (data) {
                if (data.success) {
                    $('#info-dialog').popup({
                     afterclose: function (event, ui) {
                            // console.log('! close !');
                            $.mobile.changePage(data.url);
                        }
                    });
                    $('#info-title').html('Successful');
                    $('#into').html('Register code has been sent to your email box. Please use the link to active your account.');
                    $('#info-dialog').popup('open');
                } else {
                    /*
                    
                    */
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#info-dialog').popup({
                     afterclose: function (event, ui) {
                            // console.log('! close !');
                            $.mobile.changePage(data.url);
                        }
                    });
                    $('#info-title').html('Successful');
                    $('#into').html('Register code has been sent to your email box. Please use the link to active your account.');
                    $('#info-dialog').popup('open');
            }
        });
    });
});