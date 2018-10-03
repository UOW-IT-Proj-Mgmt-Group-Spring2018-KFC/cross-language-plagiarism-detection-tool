$(function() {
    $('#submit-file-button').click(function() {
        $.mobile.changePage('submit_file.html');
    });

    $('#text-file-button').click(function() {
        $.mobile.changePage('type_text.html');
    });
});