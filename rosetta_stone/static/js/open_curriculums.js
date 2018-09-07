var search = ' ';
var start = 0;
var limit = 5;

function retrieveCurriculums(search, start, limit, insert) {

    if (! insert) {
        $('#curriculums-list').empty();
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
        url: 'SearchCurriculums',
        data: ajaxData,
        success: function (data) {
            if (data.success) {
                console.log(data);

                var dl = $('#curriculums-list');

                for (var i = 0; i < data.rows.length; ++ i) {
                    var row = data.rows[i];
                    // console.log(row);

                    var li = "<li><h2>" + row.name + "</h2>";
                    li += ("<p>" + row.cost + "</p>");
                    li += ("<p>" + row.startdate + " ~ ");
                    li += ( row.enddate + "</p>");
                    li += ("<p>" + row.discription + "</p>");
                    li += "</li>";
                    dl.append(li);
                }
                
                dl.listview('refresh');
                dl.trigger('create');
                
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

$(function() {
    retrieveCurriculums(search, start, limit, false);

    $('#rich-autocomplete-input').bind('input change propertychange', function() {
        var v = $(this).val(); // .trim();
        if (v != search) {
            search = v;
            start = 0;
            retrieveCurriculums(search, start, limit, false);
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