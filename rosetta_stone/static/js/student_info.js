function retrieve() {
    $.ajax({
        dataType: "json",
        type: 'POST',
        url: 'StudentInfo',
        data: '',
        success: function (data) {
            // console.log(data);

            if (data.success) {
                // console.log($('#gender').val());
                // console.log($('#gender'));
                $('#email').val(data.email);
                $('#name').val(data.name);
                $('#gender').val(data.gender).selectmenu('refresh', true);
                $('#yob').val(data.yob);
                $('#education').val(data.education);
                $('#contracts').val(data.contracts);
                $('#address').val(data.address);
                $('#address').val(data.address);
                $('#private').prop('checked', data.private).checkboxradio("refresh");
                // console.log($('#gender').val());

                $('#infoform').trigger('create');
            } else {
                //
            }
        }
    });
}

$(function() {

    retrieve();

    $('#ok-button').bind('click', function() {
        $('#info-dialog').popup('close');
        // $.mobile.changePage('sign_in.html');
    });

    $('#submit-button').click(function() {
        var valid = true;
        
        var email = $('#email').val().trim();
        if(0 >= email.length) {
            $('#email-info').html(' 必需的信息');
            $('#email-info').show();
            valid = false;
        } else {
            var emailreg = /\w+[@]{1}\w+[.]\w+/;
            if (! emailreg.test(email)) {
                $('#email-info').html(' email格式不正确');
                $('#email-info').show();
                valid = false;
            } else {
                $('#email-info').hide();
            }
        }
        
        var name = $('#name').val().trim();
        if(0 >= name.length) {
            $('#name-info').html(' 必需的信息');
            $('#name-info').show();
            valid = false;
        } else {
            $('#name-info').hide();
        }
        
        var gender = $("#gender").val();
        
        var yob = 0;
        var strYob = $('#yob').val().trim();
        if(0 < strYob.length) {
            var reg = /^[0-9]*[1-9][0-9]*$/;
            if (! reg.test(strYob)) {
                $('#yob-info').show();
                valid = false;
            } else {
                yob = parseInt(strYob);
                $('#yob-info').hide();
            }
        } else {
            $('#yob-info').hide();
        }
        
        
        var education = $('#education').val().trim();
        var contracts = $('#contracts').val().trim();
        var address = $('#address').val().trim();
        
        var vPrivate = $('#private').prop('checked');
        
        if (! valid) {
            return;
        }
        
        // go sign in
        var ajaxData = 'email=' + email + 
            '&name=' + name + 
            '&gender=' + gender + 
            '&yob=' + yob + 
            '&education=' + education +
            '&contracts=' + contracts +
            '&address=' + address +
            '&private=' + vPrivate;
        
        console.log(ajaxData);

        $.ajax({
            dataType: "json",
            type: 'POST',
            url: 'ChangeStudentInfo',
            data: ajaxData,
            success: function (data) {
                if (data.success) {
                    $('#info-dialog').popup({
                     afterclose: function (event, ui) {
                            // console.log('! close !');
                            // $.mobile.changePage(data.url);
                        }
                    });

                    $('#info-title').html('成功！');
                    $('#info').html('');
                    $('#info-dialog').popup('open');
                } else {
                    if (data.name && 0 < data.name.length) {
                        $('#' + data.name + "-info").html(data.errmsg);
                        $('#' + data.name + "-info").show();
                        $('#' + data.name).focus();
                    } else {
                        $('#info-title').html('失败！');
                        $('#info').html('请稍后重试');
                        $('#info-dialog').popup('open');
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#info-title').html('失败！');
                $('#info').html('请稍后重试');
                $('#info-dialog').popup('open');
            },
            complete: function() {
                retrieve();
            }
        });
    });
});