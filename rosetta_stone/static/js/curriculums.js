var search = ' ';
var start = 0;
var limit = 5;

var curriculum = null;

function retrieve(id) {
    $.ajax({
        dataType: "json",
        type: 'POST',
        url: 'CurriculumInfo',
        data: 'curriculum=' + id,
        success: function (data) {

            $('#name').val(data.name);
            $('#cost').val(data.cost);
            $('#startdate').val(data.startdate);
            $('#enddate').val(data.enddate);
            $('#discription').val(data.discription);
            $('#capability').val(data.capability);
            
            var dl = $('#curriculum-one');
            dl.empty();

            var li = "<li><a style='font-size:1.2em;' href=\"#\"><h2>" + data.name + "</h2>";
            li += ("<p>" + data.cost + "");
            li += ("<br/>" + data.startdate + "");
            li += ("&nbsp;&nbsp;" + data.enddate + "");
            li += ("<br/>" + data.discription + "");
            li += ("<br/>" + data.capability + "");
            li += "</p></a>";
            li += '<a style="font-size:1.2em;" href="#" id="'+ id +'">编辑</a>';
            li += '</li>';
            dl.append(li);
                
            dl.listview('refresh');
            dl.trigger('create');
            
            $('#'+id).click(function() {
                $('#curriculums').hide();
                $('#curriculum').hide();
                $('#curriculum-edit').show();
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error !');
        },
        complete: function() {
        }
    });
    
    var sl = $('#students-list');
    sl.empty();
    $.ajax({
        dataType: "json",
        type: 'POST',
        url: 'CurriculumStudents',
        data: 'curriculum=' + id,
        success: function (data) {

            if (data.success) {

                for (var i = 0; i < data.rows.length; ++ i) {
                    var row = data.rows[i];

                    var li = "<li style='font-size:1.2em;'><h2>" + row.email + "</h2>";
                    li += ("<h2>" + row.name + "</h2>");
                    li += ("<p>" + row.gender + "</p>");
                    li += ("<p>" + row.yob + "</p>");
                    li += ("<p>" + row.education + "</p>");
                    li += ("<p>" + row.contracts + "</p>");
                    li += ("<p>" + row.address + "</p>");
                    li += ('<select data-role="slider" email="' + row.email + '" curriculum="'+ id +'" id="slider-' + i + '">');
                    li += ('<option value="off" '+ (row.paid ? '' : 'selected=""') +'">未付</option>');
                    li += ('<option value="on" ' + (row.paid ? 'selected=""' : '') + '">已付</option>');
                    li += ('</select>');
                    li += "</li>";
                    sl.append(li);
                    
                    $('#slider-' + i).change(function() {
                        $.mobile.loading( "show", {
                            text: "",
                            textVisible: false,
                            theme: "",
                            textonly: false,
                            html: "" });

                        var r = false;
                        var me = $(this);
                        $.ajax({
                            timeout : 3000,
                            dataType: "json",
                            type: 'POST',
                            url: 'Paid',
                            data: 'email=' + $(this).attr('email') + "&curriculum=" + $(this).attr('curriculum') + "&paid=" + ($(this).val()=="on" ? true : false),
                            success: function (data) {
                                // r = true;
                                if (false == data.success) {
                                    console.log(me.val());
                                    me.val( me.val() == 'on' ? 'off' : 'on' );
                                    me.slider('refresh');
                                    console.log('> ' + me.val());
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.log(me.val());
                                me.val( me.val() == 'on' ? 'off' : 'on' );
                                me.slider('refresh');
                                console.log('> ' + me.val()); 
                            },
                            complete: function() {
                                $.mobile.loading( "hide" );
                            }
                        });
                    });
                }
                
                sl.listview('refresh');
                sl.trigger('create');
            }
        }
    });
}

function selectCurriculum(id) {
    curriculum = id;

    $('#curriculums').hide();
    $('#curriculum-edit').hide();
    $('#curriculum').show();
    
    retrieve(id);
}

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
        url: 'SearchNotChoicedCurriculums',
        data: ajaxData,
        success: function (data) {
            if (data.success) {

                var dl = $('#curriculums-list');

                for (var i = 0; i < data.rows.length; ++ i) {
                    var row = data.rows[i];

                    var li = "<li><a style='font-size:1.2em;' href='#' onclick=\"selectCurriculum('"+ row.uuid +"')\"><h2>" + row.name + "</h2>";
                    li += ("<p>" + row.cost + "</p>");
                    li += ("<p><br/>" + row.startdate + "");
                    li += ("&nbsp;&nbsp;" + row.enddate + "");
                    li += ("<br/>" + row.discription + "");
                    li += ("<br/>" + row.capability + "");
                    li += "</p></a></li>";

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
    // $.datepicker.setDefault({dateFormat:'yy-mm-dd'});
    // console.log($("#startdate").datepicker());
    // $("#startdate").datepicker()[""].dateFormat = "yy-mm-dd";
    //$("#enddate").datepicker({dateFormat: 'yy-mm-dd'});
    //$("#new-startdate").datepicker({dateFormat: 'yy-mm-dd'});
    //$("#new-enddate").datepicker({dateFormat: 'yy-mm-dd'});
/*
    $("#startdate").datepicker();
    $("#startdate").datepicker( "option", "dateFormat", 'yy-mm-dd');
    
    $("#enddate").datepicker();
    $("#enddate").datepicker( "option", "dateFormat", 'yy-mm-dd');
    
    $("#new-startdate").datepicker();
    $("#new-startdate").datepicker( "option", "dateFormat", 'yy-mm-dd');
    
    $("#new-enddate").datepicker();
    $("#new-enddate").datepicker( "option", "dateFormat", 'yy-mm-dd');
*/
    // console.log($('#startdate').datepicker('option', 'dateFormat'));

    $('.back-button').bind('click', function() {
        $('#curriculums').show();
        $('#curriculum').hide();
        $('#curriculum-edit').hide();
        $('#curriculum-new').hide();
    });

    $('#add-button').bind('click', function() {
        
        $.mobile.loading("show", {text:"", textVisible:false, theme:"", textonly:false, html:""});
        $("[id$='-info']").hide();
        $.ajax({
            timeout : 3000,
            dataType: "json",
            type: 'POST',
            url: 'CreateCurriculum',
            data: 'name=' + $('#new-name').val() + 
                    '&cost=' + $('#new-cost').val() + 
                    '&startdate=' + $('#new-startdate').val() +
                    '&enddate=' + $('#new-enddate').val() +
                    '&discription=' + $('#new-discription').val() + 
                    '&capability=' + $('#new-capability').val() ,
            success: function (data) {
                $('#new-error-info').hide();

                if (data.success) {
                    retrieveCurriculums(search, start, -1, false);
                    $('.back-button').trigger('click');
                } else {
                    if (data.name && 0 < data.name.length) {
                        $('#new-' + data.name + "-info").html(data.errmsg);
                        $('#new-' + data.name + "-info").show();
                        // $('#new-' + data.name).focus();
                    }
                }
            },
            error: function (data) {
                $('#new-error-info').html('失败，请稍后重试！');
                $('#new-error-info').show();
            },
            complete: function (data) {
                $.mobile.loading( "hide" );
            }
        });
    });
    
    $('#delete-button').bind('click', function() {
        $('#del-dialog').popup('open');
    });

    $('#update-button').bind('click', function() {
        
        $.mobile.loading("show", {text:"", textVisible:false, theme:"", textonly:false, html:""});

        $.ajax({
            timeout : 3000,
            dataType: "json",
            type: 'POST',
            url: 'UpdateCurriculum',
            data: 'curriculum=' + curriculum + 
                    '&name=' + $('#name').val() + 
                    '&cost=' + $('#cost').val() + 
                    '&startdate=' + $('#startdate').val() +
                    '&enddate=' + $('#enddate').val() +
                    '&discription=' + $('#discription').val() + 
                    '&capability=' + $('#capability').val() ,
            success: function (data) {
                $('#error-info').hide();

                if (data.success) {
                    retrieveCurriculums(search, start, -1, false);
                    $('.back-button').trigger('click');
                } else {
                    if (data.name && 0 < data.name.length) {
                        $('#' + data.name + "-info").html(data.errmsg);
                        $('#' + data.name + "-info").show();
                        $('#' + data.name).focus();
                    }
                }
            },
            error: function (data) {
                $('#error-info').html('失败，请稍后重试！');
                $('#error-info').show();
            },
            complete: function (data) {
                $.mobile.loading( "hide" );
            }
        });
    });

    $('#ok-button').bind('click', function() {
        $('#del-dialog').popup('close');
        
        $.mobile.loading("show", {text:"", textVisible:false, theme:"", textonly:false, html:""});

        $.ajax({
            timeout : 3000,
            dataType: "json",
            type: 'POST',
            url: 'DeleteCurriculum',
            data: 'curriculum=' + curriculum,
            complete: function (data) {
                $.mobile.loading( "hide" );
                retrieveCurriculums(search, start, -1, false);
                $('.back-button').trigger('click');
            }
        });
    });

    retrieveCurriculums(search, start, -1, false);

    // $(document).bind("mobileinit", function(){ $.mobile.ajaxEnabled = false;});

    $('#plus-button').bind('click', function() {
        $('#curriculums').hide();
        $('#curriculum').hide();
        $('#curriculum-edit').hide();

        $("[id$='-info']").hide();
        $("input[id^='new-']").val('');
        $('#curriculum-new').show();
    });

    $('#rich-autocomplete-input').bind('input change propertychange', function() {
        var v = $(this).val(); // .trim();
        if (v != search) {
            search = v;
            // console.log('?search=' + search);
            retrieveCurriculums(search, start, -1, false);
        }
    });

    /*
    $.extend({
        getUrlVars: function() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },

        getUrlVar: function(name) {
            // ?search=123%20456%20abc
            // return $.getUrlVars()[name];        // "123%20456%20abc"
            return unescape($.getUrlVars()[name]); // "123 456 abc"
        }
    });

    var search = $.getUrlVar('search');
    console.log('?' + $.getUrlVar(search));
    if (undefined == search) {
        search = "";
    }
    */
    
});