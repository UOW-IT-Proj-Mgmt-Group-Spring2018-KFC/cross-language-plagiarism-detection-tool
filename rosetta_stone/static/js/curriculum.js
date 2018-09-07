function retrieve(id) {
    $.ajax({
        dataType: "json",
        type: 'POST',
        url: 'CurriculumInfo',
        data: 'curriculum=' + id,
        success: function (data) {
            console.log(data);
            $('#name').val(data.name);
            $('#cost').val(data.cost);
            $('#startdate').val(data.startdate);
            $('#enddate').val(data.enddate);
            $('#discription').val(data.discription);
            $('#capability').val(data.capability);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error !');
        },
        complete: function() {
        }
    });
}


$(function() {
    $(document).bind("mobileinit", function(){ $.mobile.ajaxEnabled = false;});
    
    $.ajax({
        dataType: "json",
        type: 'POST',
        url: 'GetCurrentCurriculum',
        data: '',
        success: function (data) {
            console.log(data.curriculum);
            retrieve(data.curriculum);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error !');
        },
        complete: function() {
        }
    });
});