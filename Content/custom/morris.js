Morris.Bar({
    element: 'enqbar-chart',
    data: GetEnqiryChart(),
    xkey: 'Month',
    ykeys: ['Count'],
    labels: [''],
    barColors: ['#f39c12'],
});

function GetEnqiryChart() {
    var data = "";
    $.ajax({
        type: 'GET',
        url: '/Admin/GetEnquiryChart',
        dataType: 'json',
        async: false,
        contentType: "application/json; charset=utf-8",
        data: { 'bar_chart': 'bar' },
        success: function (result) {
            data = result;
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });

    return data;
}

Morris.Bar({
    element: 'pobar-chart',
    data: GetPOChart(),
    xkey: 'Month',
    ykeys: ['Count'],
    labels: [''],
    barColors: ['#00a65a'],
});

function GetPOChart() {
    var data = "";
    $.ajax({
        type: 'GET',
        url: '/Admin/GetPOChart',
        dataType: 'json',
        async: false,
        contentType: "application/json; charset=utf-8",
        data: { 'bar_chart': 'bar' },
        success: function (result) {
            data = result;
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });

    return data;
}

Morris.Bar({
    element: 'quotbar-chart',
    data: GetQuotedChart(),
    xkey: 'Month',
    ykeys: ['Count'],
    labels: [''],
    barColors: ['#00a7d0'],
});

function GetQuotedChart() {
    var data = "";
    $.ajax({
        type: 'GET',
        url: '/Admin/GetQuotedChart',
        dataType: 'json',
        async: false,
        contentType: "application/json; charset=utf-8",
        data: { 'bar_chart': 'bar' },
        success: function (result) {
            data = result;
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });

    return data;
}