$(function() {

    $('#ok-button').bind('click', function() {
        $('#info-dialog').popup('close');
        // $.mobile.changePage('sign_in.html');
    });

    $('#change-button').click(function() {
        var valid = true;
        
        var oldpassword = $('#old-password').val().trim();
        if(0 >= oldpassword.length) {
            $('#old-password-info').html('! It is necessary');
            $('#old-password-info').show();
            valid = false;
        } else {
            $('#old-password-info').hide();
        }

        var password = $('#password').val().trim();
        if(0 >= password.length) {
            $('#password-info').html('! It is necessary');
            $('#password-info').show();
            valid = false;
        } else {
            $('#password-info').hide();
        }
        
        var repassword = $('#repassword').val().trim();
        if(0 >= repassword.length) {
            $('#repassword-info').html('! It is necessary');
            $('#repassword-info').show();
            valid = false;
        } else {
            $('#repassword-info').hide();
            if (password != repassword) {
                $('#password-info').hide();
                $('#repassword-info').html('! Your enter different passwords');
                $('#repassword-info').show();
                valid = false;
            }
        }
        
        if (! valid) {
            return;
        }
        
        var ajaxData = 'old-password=' + oldpassword + 
            '&password=' + password + 
            '&repassword=' + repassword;
        
        $.ajax({
            dataType: "json",
            type: 'POST',
            url: 'ChangePassword',
            data: ajaxData,
            success: function (data) {
                if (data.success) {
                    $('#info-dialog').popup({
                     afterclose: function (event, ui) {
                            // console.log('! close !');
                            $.mobile.changePage(data.url);
                        }
                    });

                    $('#info-title').html('Successful!');
                    $('#info').html('');
                    $('#info-dialog').popup('open');
                } else {
                    if (data.name && 0 < data.name.length) {
                        $('#' + data.name + "-info").html(data.errmsg);
                        $('#' + data.name + "-info").show();
                        $('#' + data.name).focus();
                    } else {
                        $('#info-title').html('Failed!');
                        $('#info').html('Please try again later');
                        $('#info-dialog').popup('open');
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#info-title').html('Failed!');
                $('#info').html('Please try again later!');
                $('#info-dialog').popup('open');
            }
        });
    });
});