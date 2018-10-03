$(function() {
    $.FormValidator.init('changepassword-form');

    $('#ok-button').bind('click', function() {
        $('#info-dialog').popup('close');
        // $.mobile.changePage('sign_in.html');
    });

    $('#change-button').click(function() {
        var valid = true;
        
        var password = $('#password').val().trim();
        if(0 >= password.length) {
            $('#password-info').html('Password please');
            $('#password-info').show();
            valid = false;
        } else {
            $('#password-info').hide();
        }

        var new_password = $('#new-password').val().trim();
        if(0 >= new_password.length) {
            $('#new-password-info').html('New password please');
            $('#new-password-info').show();
            valid = false;
        } else {
            $('#new-password-info').hide();
        }
        
        var re_new_password = $('#re-new-password').val().trim();
        if(0 >= re_new_password.length) {
            $('#re-new-password-info').html('Repeat new password please');
            $('#re-new-password-info').show();
            valid = false;
        } else {
            $('#re-new-password-info').hide();
            if (new_password != re_new_password) {
                $('#re-new-password-info').hide();
                $('#re-new-password-info').html('Your input different passwords');
                $('#re-new-password-info').show();
                valid = false;
            }
        }
        
        if (! valid) {
            return;
        }
        
        var ajaxData = 'password=' + password +
            '&new-password=' + new_password;
        
        $.ajax({
            dataType: "json",
            type: 'POST',
            url: 'changepassword',
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
                    $('#info').html(data.errmsg);
                    $('#info-dialog').popup('open');
                } else {
                    if (data.name && 0 < data.name.length) {
                        $('#' + data.name + "-info").html(data.errmsg);
                        $('#' + data.name + "-info").show();
                        $('#' + data.name).focus();
                    } else {
                        $('#info-title').html('Failed!');
                        $('#info').html(data.errmsg);
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