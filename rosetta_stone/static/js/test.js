$(function() {
    $('#info-button').bind('click', function() {
        $('#info').popup('open');
    });

    $('#ok-button').bind('click', function() {

        // Ref: http://www.wglong.com/main/artical!details?id=4#q7
        // $.mobile.ajaxEnabled = false;

        $.mobile.changePage('sign_in.html');
        /*
        $.mobile.changePage('sign_in.html', {
            'allowSamePageTransition' : true,
            'reloadPage' : true,
            'transition' : 'none',
            'reloadPage' : true
        }); */
        // $.mobile.changePage('sign_in.html', "fade", false, false);
        // window.location.href = '/student/sign_in.html'; // + Math.random(); // chrome : Provisional headers are shown
        // window.open('sign_in.html');
        return false;
    });
});