
$(document).ready(function () {
    $("input:text,form").attr("autocomplete", "off");
    $('#BranchModels_RegisterViewModels_Email').focus();
});

//discomlist Datatable

var branchlist = $('#branchlist').DataTable({
    "columnDefs": [
        { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
        { 'targets': 1, 'width': '140', 'searchable': false, 'orderable': false },  //Action
        { 'targets': 2, 'width': '200'},    //BranchName
        { 'targets': 3, 'width': '200' },   //Description
        { 'targets': 4, 'width': '100' },   //MobileNo1
        { 'targets': 5, 'width': '100' },   //MobileNo2
        { 'targets': 6, 'width': '100' },   //Landline
        { 'targets': 7, 'width': '150' },   //Email
        { 'targets': 8, 'width': '200' },   //AddressLine1
        { 'targets': 9, 'width': '200' },   //AddressLine2
        { 'targets': 10, 'width': '100' },  //City
        { 'targets': 11, 'width': '100' },  //District
        { 'targets': 12, 'width': '100' }   //Country
    ],
    "scrollX": true,
    "order": [2, 'asc'],
    "paging": true
});

branchlist.on('order.dt search.dt', function () {
    branchlist.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
        cell.innerHTML = i + 1;
        branchlist.cell(cell).invalidate('dom');
    });
}).draw();

//discomlist Datatable
