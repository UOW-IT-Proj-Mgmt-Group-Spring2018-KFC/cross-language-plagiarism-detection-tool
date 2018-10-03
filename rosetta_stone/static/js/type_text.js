$(function() {
    $.FormValidator.init('submit-form');

    //  submit-file-button
    $('#submit-button').click(function() {
        $('#error-info').hide();

        var r = $.FormValidator.validate('submit-form');
        if (false == r) {
            // !!!
            // $.mobile.changePage('file_list.html');

            return false;
        }
    });
});