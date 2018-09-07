var search = '';
var start = 0;
var limit = 5;

function oncheckbox(id) {
    console.log('oncheckbox:' + id);
    console.log($('#'+id).prop('checked'));

    $.ajax({
        dataType: "json",
        type: 'POST',
        url: 'SelectCurriculum',
        data: 'curriculum=' + id + '&selected=' + $('#'+id).prop('checked'),
        complete: function (data) {
            retrieveChoicedCurriculums();
            retrieveNotChoicedCurriculums(search, start, limit, false);
        }
    });
}

function retrieveChoicedCurriculums() {
    var ccl = $('#choiced-curriculums-list');
    ccl.empty();

    $.ajax({
        dataType: "json",
        type: 'POST',
        url: 'ChoicedCurriculums',
        data: '',
        success: function (data) {
            // console.log(data);

            if (data.success) {

                for (var i = 0; i < data.rows.length; ++ i) {
                    var row = data.rows[i];

                    var li = "<li><h2>" + row.name + "</h2>";
                    li += ("<p>" + row.cost + "</p>");
                    li += ("<p>" + row.startdate + "</p>");
                    li += ("<p>" + row.enddate + "</p>");
                    li += ("<p>" + row.discription + "</p>");
                    li += ("<p>" + (row.paid ? "已付款" : "未付款") + "</p>");
                    li += ('<label for="' + row.uuid + '">'+ '选课' + '</label>');
                    li += ('<input type="checkbox" '+ (row.paid ? 'disabled="true"' : '' ) +' checked="checked" name="'+ row.uuid +'" id="' + row.uuid +'" onclick="oncheckbox(\''+ row.uuid +'\');" data-mini="false" />');
                    li += "</li>";
                    ccl.append(li);
                }
                
                ccl.listview('refresh');
                ccl.trigger('create');
            }
        }
    });
}

function retrieveNotChoicedCurriculums(search, start, limit, insert) {

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
        url: 'SearchNotChoicedCurriculums',
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
                    li += ("<p>" + row.startdate + "</p>");
                    li += ("<p>" + row.enddate + "</p>");
                    li += ("<p>" + row.discription + "</p>");
                    li += ('<label for="' + row.uuid + '">'+ '选课' + '</label>');
                    li += ('<input type="checkbox" name="'+ row.uuid +'" id="' + row.uuid +'" onclick="oncheckbox(\''+ row.uuid +'\');" data-mini="false" />');
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
    retrieveChoicedCurriculums();
    retrieveNotChoicedCurriculums(search, start, limit, false);

    $('#rich-autocomplete-input').bind('input change propertychange', function() {
        var v = $(this).val(); // .trim();
        if (v != search) {
            search = v;
            start = 0;
            retrieveChoicedCurriculums();
            retrieveNotChoicedCurriculums(search, start, limit, false);
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