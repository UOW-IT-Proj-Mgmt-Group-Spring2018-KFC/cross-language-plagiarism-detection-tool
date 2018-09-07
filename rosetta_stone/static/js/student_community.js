$(function() {

    var search = '';
    var start = 0;
    var limit = 5;

    function retrieve(search, start, limit, insert) {
        // console.log('?' + search);

        if (! insert) {
            $('#data-list').empty();
        }

        if (0 == search.length) {
            return;
        }

        var ajaxData = 'search=' + search + 
                '&start=' + start +
                '&limit=' + limit;
            
        $.mobile.loading( "show", {
            text: "",
            textVisible: false,
            theme: "",
            textonly: false,
            html: "" });

        $.ajax({
            dataType: "json",
            type: 'POST',
            url: 'SearchStudents',
            data: ajaxData,
            success: function (data) {
                if (data.success) {
                    // console.log(data.total);

                    var dl = $('#data-list');

                    for (var i = 0; i < data.rows.length; ++ i) {
                        var row = data.rows[i];
                        // console.log(row);

                        var li = "<li><h2>" + row.name + "</h2>";
                        li += ("<p>" + row.email + "</p>");
                        // li += ("<p>" + row.gender + "</p>");
                        li += ("<p>" + row.yob + "</p>");
                        li += ("<p>" + row.education + "</p>");
                        li += ("<p>" + row.contracts + "</p>");
                        li += ("<p>" + row.education + "</p>");
                        li += ("<p>" + row.address + "</p>");
                        li += "</li>";
                        dl.append(li);
                    }
                    
                    dl.listview('refresh');
                    dl.trigger('create');

                    start += data.rows.length;
                    console.log(data.total + " " + start);
                    if (data.total > start) {
                        $('#nextpage').show();
                    } else {
                        $('#nextpage').hide();
                    }
                    
                } else {
                    console.log('success: false !');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error !');
            }
        });

        $.mobile.loading( "hide" );
    }

    $('#rich-autocomplete-input').bind('input change propertychange', function() {
        var v = $(this).val().trim();
        if (v != search) {
            search = v;
            start = 0;

            $('#nextpage').hide();
            retrieve(search, start, limit, false);
        }
    });

    /*
    $('#rich-autocomplete-input').bind('change input propertychange', function() {
        console.log('[' + $(this).val() + ']');
    });
    */
    $('#nextpage').bind('click', function() {
        start += limit;
        retrieve(search, start, limit, true);
    });
});