function AddNewRow(cont, rowcls, tblid) {

    var regex = /^(.*)(\d)+$/i;
    var rowCount = $('.' + rowcls).length;
    var contNo = rowCount + 1;
    var parrow = $(cont).closest('tr');
    var fail = false;
    $(parrow).find('select, textarea, input').each(function () {
        if ($(this).data('required')) {
            if ($(this).val().trim() === "" || $(this).val().trim() === "0") {
                fail = true;
            }
        }
    });

    lastRow = false;
    if (parrow.is(":last-child")) {
        lastRow = true;
    }

    if (lastRow === true && fail === false) {
        var $clone = parrow.clone(true);
        $clone.find(':text').val('');
        $clone.attr('id', 'id' + contNo); //update row id if required
        //update ids of elements in row
        $clone.find("*").each(function () {
            var id = this.id || "";
            var match = id.match(regex) || [];
            if (match.length === 3) {
                this.id = match[1] + contNo;
            }
            var name = this.name || "";
            var matchname = name.match(regex) || [];
            if (matchname.length === 3) {
                this.name = matchname[1] + contNo;
            }
        });
        $clone.find("button").each(function () {
            var rowid = $(this).data("rowid").replace(' ', '');
            var rowidsplt = rowid.split("_");

            rowid = rowidsplt[0] + "_" + rowidsplt[1] + "_" + contNo;

            $(this).data("rowid", rowid); //setter
        });

        $clone.find('input[type="text"]:first').each(function () {
            $(this).val(contNo);
        });

        parrow.after($clone);

        setTimeout(function () {
            //alert("hit");
        }, 2000);

        $('table#' + tblid + ' tbody tr').removeClass("selected");
        $('table#' + tblid + ' tr:last td:eq(0)').find('input').focus();
        $('table#' + tblid + ' tr:last').toggleClass('selected');
    }

    if (tblid === "itemTbl") {
        calcFinalPrice(cont);
    }
}


// THE SCRIPT THAT CHECKS IF THE KEY PRESSED IS A NUMERIC OR DECIMAL VALUE.
function isNumber(evt, element) {
    var charCode = evt.which ? evt.which : event.keyCode;
    if ((charCode !== 46 || $(element).val().indexOf('.') !== -1) &&      // “.” CHECK DOT, AND ONLY ONE.
        (charCode < 48 || charCode > 57))
        return false;

    return true;
}

// THE SCRIPT THAT CHECKS IF THE KEY PRESSED IS A NUMERIC OR Hyphen VALUE.
function isNumberHyp(evt, element) {
    var charCode = evt.which ? evt.which : event.keyCode;
    if ((charCode !== 45 || $(element).val().indexOf('-') !== -1) &&      // “.” CHECK Hyphen, AND ONLY ONE.
        (charCode < 48 || charCode > 57))
        return false;

    return true;
}

// THE SCRIPT THAT CHECKS IF THE KEY PRESSED IS A ALPHABET.
function isAlphabet(evt) {
    var charCode = evt.keyCode;
    if (!(charCode === 8 || charCode === 32 || charCode === 46 || (charCode >= 35 && charCode <= 40) || (charCode >= 65 && charCode <= 90))) {
        e.preventDefault();
    }
}

/* General Start */


$(document).ready(function () {
    $(".mb-act-confirm-del").on("click", function (e) {
        e.preventDefault();
        var box = $($(this).data("box"));
        if (box.length > 0) {
            box.toggleClass("open");
            //alert(id);
            var sound = box.data("sound");

            if (sound === 'alert')
                playAudio('alert');

            if (sound === 'fail')
                playAudio('fail');
            var clkHref = $(this).attr('href');
            $("#confirmdelhref").attr("href", clkHref);
        }
        return false;
    });

    $(".mb-act-confirm").on("click", function (e) {
        e.preventDefault();
        var box = $($(this).data("box"));
        if (box.length > 0) {
            box.toggleClass("open");
            //alert(id);
            var sound = box.data("sound");

            if (sound === 'alert')
                playAudio('alert');

            if (sound === 'fail')
                playAudio('fail');
            var clkHref = $(this).attr('href');
            $("#confirmhref").attr("href", clkHref);
        }
        return false;
    });

    $(".mb-act-cnfrm-rej").on("click", function (e) {
        e.preventDefault();
        var box = $($(this).data("box"));
        if (box.length > 0) {
            box.toggleClass("open");
            //alert(id);
            var sound = box.data("sound");

            if (sound === 'alert')
                playAudio('alert');

            if (sound === 'fail')
                playAudio('fail');

            var clkHref = $(this).attr('href');

            $("#confirmhrefrej").attr("href", clkHref);
        }
        return false;
    });

    $("#confirmhrefrej").click(function () {
        clkHref = $(this).attr('href');
        var rmk = $("#ProductExcelModels_Remark").val();
        if (rmk !== "") {
            var fHref = clkHref + "-#$" + rmk;
        }
        else {
            fHref = clkHref;
        }
        $("#confirmhrefrej").attr("href", fHref);
        $("#confirmhrefrej").submit();
    });

    $(".alert-dismissible").fadeTo(5000, 500).slideUp(500, function () {
        $(".alert-dismissible").alert('close');
    });

    $('.onlynumdec').keypress(function (event) {
        return isNumber(event, this);
    });


    $(document).on('keypress', '.onlynumdec', function () {
        return isNumber(event, this);
    });

    $('.onlynumhyphen').keypress(function (event) {
        return isNumberHyp(event, this);
    });

    $('.onlyalphabet').keypress(function (event) {
        return isAlphabet(event, this);
    });

    //$('#tblpurordline').on('blur', '.quantity', function () {
    //    AddNewRow(this, "item-data", "tblpurordline");
    //});

    $(".addnewrow").blur(function (event) {
        var tblId = $(this).closest('table').attr('id');
        AddNewRow(this, "item-data", tblId);
    });

    $(".ienq").hover(
        function () {
            var stn = $(this).find(".stn").text();
            var nstn = $(this).find(".nstn").text();
            var tot = parseFloat(stn) + parseFloat(nstn);
            $(".tot").text(tot);
        }, function () {
            var stn = $(".cstn").text();
            var nstn = $(".cnstn").text();
            var tot = parseFloat(stn) + parseFloat(nstn);
            $(".tot").text(tot);
        }
    );

    //Registered Vendor Index Info Table
    var tblIndexRegVen = $('#tblIndexRegVen').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '30', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '80', 'searchable': false, 'orderable': false },  //CompanyName
            { 'targets': 2, 'width': '80', 'searchable': false, 'orderable': false },   //ContactPerson
            { 'targets': 3, 'width': '60', 'searchable': false, 'orderable': false }    //Contact
        ],
        "order": [2, 'asc'],
        "paging": false,
        "searching": false,
        "info": false
    });

    tblIndexRegVen.on('order.dt search.dt', function () {
        tblIndexRegVen.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblIndexRegVen.cell(cell).invalidate('dom');
        });
    }).draw();
    //Registered Vendor Index Info Table

    //Approved Vendor Index Info Table
    var tblIndexApprvVen = $('#tblIndexApprvVen').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '30', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '80', 'searchable': false, 'orderable': false },  //CompanyName
            { 'targets': 2, 'width': '80', 'searchable': false, 'orderable': false },   //ContactPerson
            { 'targets': 3, 'width': '60', 'searchable': false, 'orderable': false }    //Contact
        ],
        "order": [2, 'asc'],
        "paging": false,
        "searching": false,
        "info": false
    });

    tblIndexApprvVen.on('order.dt search.dt', function () {
        tblIndexApprvVen.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblIndexApprvVen.cell(cell).invalidate('dom');
        });
    }).draw();
    //Approved Vendor Index Info Table

    //Vendor Info Table
    var tblApVendor = $('#tblApVendor').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '210', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '20', 'orderable': false },   //Code
            { 'targets': 3, 'width': '200', 'orderable': false },   //CompanyName
            { 'targets': 4, 'width': '100', 'orderable': false },   //ContactPerson
            { 'targets': 5, 'width': '30', 'orderable': false },   //Contact1
            { 'targets': 6, 'width': '30', 'orderable': false },   //Contact2
            { 'targets': 7, 'width': '50', 'orderable': false },   //Email
            { 'targets': 8, 'width': '50', 'orderable': false },   //WebsiteURL
            { 'targets': 9, 'width': '40', 'orderable': false },   //Category
            { 'targets': 10, 'width': '50', 'orderable': false },  //Brand
            { 'targets': 11, 'width': '50', 'orderable': false },  //City
            { 'targets': 12, 'width': '50', 'orderable': false },  //State
            { 'targets': 13, 'width': '50', 'orderable': false }   //Country
        ],
        "scrollX": true,
        "order": [2, 'asc'],
        "paging": false,
        //"searching": false,
        "info": false,
        "pageLength": 100
    });

    tblApVendor.on('order.dt search.dt', function () {
        tblApVendor.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblApVendor.cell(cell).invalidate('dom');
        });
    }).draw();
    //Vendor Info Table

    //Vendor Info Table
    var tblVendorInfo = $('#tblVendorInfo').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '210', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '20', 'orderable': false },   //Code
            { 'targets': 3, 'width': '200', 'orderable': false },   //CompanyName
            { 'targets': 4, 'width': '100', 'orderable': false },   //ContactPerson
            { 'targets': 5, 'width': '30', 'orderable': false },   //Contact1
            { 'targets': 6, 'width': '30', 'orderable': false },   //Contact2
            { 'targets': 7, 'width': '50', 'orderable': false },   //Email
            { 'targets': 8, 'width': '50', 'orderable': false },   //WebsiteURL
            { 'targets': 9, 'width': '40', 'orderable': false },   //Category
            { 'targets': 10, 'width': '50', 'orderable': false },  //Brand
            { 'targets': 11, 'width': '50', 'orderable': false },  //City
            { 'targets': 12, 'width': '50', 'orderable': false },  //State
            { 'targets': 13, 'width': '50', 'orderable': false }   //Country
        ],
        "scrollX": true,
        "order": [2, 'asc'],
        "paging": false,
        //"searching": false,
        "info": false,
        "pageLength": 100
    });

    tblVendorInfo.on('order.dt search.dt', function () {
        tblVendorInfo.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblVendorInfo.cell(cell).invalidate('dom');
        });
    }).draw();
    //Vendor Info Table

    //Product Category Table
    var tblProductCategory = $('#tblProductCategory').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Code
            { 'targets': 3, 'width': '150' },   //Description
            { 'targets': 4, 'width': '100' }   //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblProductCategory.on('order.dt search.dt', function () {
        tblProductCategory.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblProductCategory.cell(cell).invalidate('dom');
        });
    }).draw();
    //Product Category table

    //Industry Type table
    var tblIndustryType = $('#tblIndustryType').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblIndustryType.on('order.dt search.dt', function () {
        tblIndustryType.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblIndustryType.cell(cell).invalidate('dom');
        });
    }).draw();
    //Industry Type table

    //CompanyGroup table
    var tblCompanyGroup = $('#tblCompanyGroup').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblCompanyGroup.on('order.dt search.dt', function () {
        tblCompanyGroup.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblCompanyGroup.cell(cell).invalidate('dom');
        });
    }).draw();
    //CompanyGroup table

    //CustomerReport table
    var tblCustomerReport = $('#tblCustomerReport').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
        ],
        //"scrollX": true,
        "order": [1, 'asc'],
        "paging": false
    });

    tblCustomerReport.on('order.dt search.dt', function () {
        tblCustomerReport.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblCustomerReport.cell(cell).invalidate('dom');
        });
    }).draw();
    //CustomerReport table

    //CustomerReport table
    var tblweeklycustomer = $('#tblweeklycustomer').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
        ],
        //"scrollX": true,
        "order": [1, 'asc'],
        "paging": false
    });

    tblweeklycustomer.on('order.dt search.dt', function () {
        tblweeklycustomer.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblweeklycustomer.cell(cell).invalidate('dom');
        });
    }).draw();
    //CustomerReport table

    var tblWeeklyCustomerReport = $('#tblWeeklyCustomerReport').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                },
                'searchable': false,
                'orderable': false
            },                      //Select
        ],
        select: {
            style: 'multi',
        },
        /* "scrollX": true,*/
        "paging": false,
        //"searching": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            'pageLength',
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ]
    });
    tblWeeklyCustomerReport.on('order.dt search.dt', function () {
        tblWeeklyCustomerReport.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblWeeklyCustomerReport.cell(cell).invalidate('dom');
        });
    }).draw();


    //ApprovalLevel table
    var tblApprovalLevel = $('#tblApprovalLevel').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblApprovalLevel.on('order.dt search.dt', function () {
        tblApprovalLevel.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblApprovalLevel.cell(cell).invalidate('dom');
        });
    }).draw();
    //ApprovalLevel table

    //tblCustomers table
    var tblCustomers = $('#tblCustomers').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '50', 'searchable': false, 'orderable': false },  //Action
        ],
        "scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblCustomers.on('order.dt search.dt', function () {
        tblCustomers.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblCustomers.cell(cell).invalidate('dom');
        });
    }).draw();
    //CompanyGroup table

    //tblCustomers table
    var tblBillingAddress = $('#tblBillingAddress').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '50', 'searchable': false, 'orderable': false },  //Action
        ],
        "scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblBillingAddress.on('order.dt search.dt', function () {
        tblBillingAddress.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblBillingAddress.cell(cell).invalidate('dom');
        });
    }).draw();
    //CompanyGroup table

    //tblCustomers table
    var tblShippingAddress = $('#tblShippingAddress').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '50', 'searchable': false, 'orderable': false },  //Action
        ],
        "scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblShippingAddress.on('order.dt search.dt', function () {
        tblShippingAddress.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblShippingAddress.cell(cell).invalidate('dom');
        });
    }).draw();
    //CompanyGroup table

    //tblCustomers table
    var tblContactDet = $('#tblContactDet').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '50', 'searchable': false, 'orderable': false },  //Action
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblContactDet.on('order.dt search.dt', function () {
        tblContactDet.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblContactDet.cell(cell).invalidate('dom');
        });
    }).draw();
    //CompanyGroup table

    //Product Brand table
    var tblProductBrand = $('#tblProductBrand').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '150' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblProductBrand.on('order.dt search.dt', function () {
        tblProductBrand.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblProductBrand.cell(cell).invalidate('dom');
        });
    }).draw();
    //Product Brand table

    //SKU table
    var tblSKU = $('#tblSKU').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' }   //Name
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblSKU.on('order.dt search.dt', function () {
        tblSKU.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblSKU.cell(cell).invalidate('dom');
        });
    }).draw();
    //SKU table

    //UOM table
    var tblUOM = $('#tblUOM').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' }   //Name
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblUOM.on('order.dt search.dt', function () {
        tblUOM.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblUOM.cell(cell).invalidate('dom');
        });
    }).draw();
    //UOM table

    //Warehouse table
    var tblWarehouse = $('#tblWarehouse').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //WarehouseCode
            { 'targets': 3, 'width': '100' },   //WarehoueName
            { 'targets': 4, 'width': '100' },   //Incharge
            { 'targets': 5, 'width': '100' },   //Contact1
            { 'targets': 6, 'width': '100' },   //Contact2
            { 'targets': 7, 'width': '100' },   //AddressLine1
            { 'targets': 8, 'width': '100' },   //AddressLine2
            { 'targets': 9, 'width': '100' },   //City
            { 'targets': 10, 'width': '100' },   //State
            { 'targets': 11, 'width': '100' },   //Country
            { 'targets': 12, 'width': '100' }   //Pincode
        ],
        "scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblWarehouse.on('order.dt search.dt', function () {
        tblWarehouse.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblWarehouse.cell(cell).invalidate('dom');
        });
    }).draw();
    //Warehouse table

    //Operation Table
    var tblOperation = $('#tblOperation').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblOperation.on('order.dt search.dt', function () {
        tblOperation.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblOperation.cell(cell).invalidate('dom');
        });
    }).draw();
    //Operation Table

    //TradeType Table
    var tblTradeType = $('#tblTradeType').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblTradeType.on('order.dt search.dt', function () {
        tblTradeType.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblTradeType.cell(cell).invalidate('dom');
        });
    }).draw();
    //TradeType Table

    //Delivery Mode Table
    var tblDeliveryMode = $('#tblDeliveryMode').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblDeliveryMode.on('order.dt search.dt', function () {
        tblDeliveryMode.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblDeliveryMode.cell(cell).invalidate('dom');
        });
    }).draw();
    //Delivery Mode Table

    //Legal Status Table
    var tblLegalStatus = $('#tblLegalStatus').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblLegalStatus.on('order.dt search.dt', function () {
        tblLegalStatus.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblLegalStatus.cell(cell).invalidate('dom');
        });
    }).draw();
    //Legal Status Table

    //Packing Term Table
    var tblPackagingTerm = $('#tblPackagingTerm').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblPackagingTerm.on('order.dt search.dt', function () {
        tblPackagingTerm.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblPackagingTerm.cell(cell).invalidate('dom');
        });
    }).draw();
    //Packing Term Table

    //Payment Term Table
    var tblPaymentTerm = $('#tblPaymentTerm').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblPaymentTerm.on('order.dt search.dt', function () {
        tblPaymentTerm.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblPaymentTerm.cell(cell).invalidate('dom');
        });
    }).draw();
    //Payment Term Table

    //Invoicing Term Table
    var tblInvoicingTerm = $('#tblInvoicingTerm').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblInvoicingTerm.on('order.dt search.dt', function () {
        tblInvoicingTerm.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblInvoicingTerm.cell(cell).invalidate('dom');
        });
    }).draw();
    //Invoicing Term Table

    //SellerPanelUsage Table
    var tblSellerPanelUsage = $('#tblSellerPanelUsage').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblSellerPanelUsage.on('order.dt search.dt', function () {
        tblSellerPanelUsage.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblSellerPanelUsage.cell(cell).invalidate('dom');
        });
    }).draw();
    //SellerPanelUsage Table

    //Vendor Source Table
    var tblVendorSource = $('#tblVendorSource').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblVendorSource.on('order.dt search.dt', function () {
        tblVendorSource.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblVendorSource.cell(cell).invalidate('dom');
        });
    }).draw();
    //Vendor Source Table

    //Credit Note Term Table
    var tblCreditNoteTerm = $('#tblCreditNoteTerm').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblCreditNoteTerm.on('order.dt search.dt', function () {
        tblCreditNoteTerm.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblCreditNoteTerm.cell(cell).invalidate('dom');
        });
    }).draw();
    //Credit Note Term Table

    //Credit Type Table
    var tblCreditType = $('#tblCreditType').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblCreditType.on('order.dt search.dt', function () {
        tblCreditType.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblCreditType.cell(cell).invalidate('dom');
        });
    }).draw();
    //Credit Type Table

    //PaymentInitationForm Table
    var tblPaymentInitationForm = $('#tblPaymentInitationForm').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblPaymentInitationForm.on('order.dt search.dt', function () {
        tblPaymentInitationForm.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblPaymentInitationForm.cell(cell).invalidate('dom');
        });
    }).draw();
    //PaymentInitationForm Table

    //PaymentInitationForm Table
    var tblBank = $('#tblBank').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblBank.on('order.dt search.dt', function () {
        tblBank.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblBank.cell(cell).invalidate('dom');
        });
    }).draw();
    //PaymentInitationForm Table

    //State Table
    var tblState = $('#tblState').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblState.on('order.dt search.dt', function () {
        tblState.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblState.cell(cell).invalidate('dom');
        });
    }).draw();
    //State Table

    //Country Table
    var tblCountry = $('#tblCountry').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Name
            { 'targets': 3, 'width': '100' }    //Status
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblCountry.on('order.dt search.dt', function () {
        tblCountry.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblCountry.cell(cell).invalidate('dom');
        });
    }).draw();
    //Country Table

    //PaymentInitationForm Table
    var tblProductExcel = $('#tblProductExcel').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '50', 'searchable': false, 'orderable': false },  //Download
            { 'targets': 2, 'width': '50' },   //Reject
            { 'targets': 3, 'width': '50' },    //Vendor Code
            { 'targets': 4, 'width': '100' },    //Vendor Name
            { 'targets': 5, 'width': '100' }    //Company
        ],
        //"scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblProductExcel.on('order.dt search.dt', function () {
        tblProductExcel.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblProductExcel.cell(cell).invalidate('dom');
        });
    }).draw();
    //PaymentInitationForm Table

    //Product Table
    var tblproduct = $('#tblproduct').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '50', 'searchable': false, 'orderable': false },  //Download
            { 'targets': 2, 'width': '50' },   //SKU
            { 'targets': 3, 'width': '100' },   //Product Name
            { 'targets': 4, 'width': '100' },  //Description
            { 'targets': 5, 'width': '100' },   //Category
            { 'targets': 6, 'width': '100' },   //Brand
            { 'targets': 7, 'width': '50' },  //UOM
            { 'targets': 8, 'width': '50' },  //MRP List
            { 'targets': 9, 'width': '50' },   //Transfer Price
            { 'targets': 10, 'width': '50' },   //GST
            { 'targets': 11, 'width': '50' },  //HSNCode
            { 'targets': 12, 'width': '50' },  //LeadTime
            { 'targets': 13, 'width': '50' }   //Inventory
        ],
        "scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblproduct.on('order.dt search.dt', function () {
        tblproduct.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblproduct.cell(cell).invalidate('dom');
        });
    }).draw();
    //Product Table

    //Product Approved Table
    var tblProductApproved = $('#tblProductApproved').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '50' },    //VendorCode
            { 'targets': 2, 'width': '50' },    //Company Name
            { 'targets': 3, 'width': '50' },     //SKU
            { 'targets': 4, 'width': '100' },   //Product Name
            { 'targets': 5, 'width': '100' },   //Description
            { 'targets': 6, 'width': '100' },   //Category
            { 'targets': 7, 'width': '100' },   //Brand
            { 'targets': 8, 'width': '50' },    //UOM
            { 'targets': 9, 'width': '50' },    //MRP List
            { 'targets': 10, 'width': '50' },   //Transfer Price
            { 'targets': 11, 'width': '50' },   //GST
            { 'targets': 12, 'width': '50' },   //HSNCode
            { 'targets': 13, 'width': '50' },   //LeadTime
            { 'targets': 14, 'width': '50' }   //Inventory

        ],
        "scrollX": true,
        //"order": [2, 'asc'],
        "paging": true
    });

    tblProductApproved.on('order.dt search.dt', function () {
        tblProductApproved.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblProductApproved.cell(cell).invalidate('dom');
        });
    }).draw();
    //Product Approved Table

    //Product Approve Table
    var tblProductApprove = $('#tblProductApprove').DataTable({
        "columnDefs": [
            {
                'targets': 0,
                'checkboxes': {
                    'selectRow': true
                }
            },
            { 'targets': 1, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 2, 'width': '50' },    //VendorCode
            { 'targets': 3, 'width': '50' },    //Company Name
            { 'targets': 4, 'width': '50' },     //SKU
            { 'targets': 5, 'width': '100' },   //Product Name
            { 'targets': 6, 'width': '100' },   //Description
            { 'targets': 7, 'width': '100' },   //Category
            { 'targets': 8, 'width': '100' },   //Brand
            { 'targets': 9, 'width': '50' },    //UOM
            { 'targets': 10, 'width': '50' },    //MRP List
            { 'targets': 11, 'width': '50' },   //Transfer Price
            { 'targets': 12, 'width': '50' },   //GST
            { 'targets': 13, 'width': '50' },   //HSNCode
            { 'targets': 14, 'width': '50' },   //LeadTime
            { 'targets': 15, 'width': '50' }   //Inventory

        ],
        "scrollX": true,
        //"order": [2, 'asc'],
        "paging": true,
        'select': {
            'style': 'multi'
        },
    });

    tblProductApprove.on('order.dt search.dt', function () {
        tblProductApprove.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblProductApprove.cell(cell).invalidate('dom');
        });
    }).draw();
    //Product Approve Table

    $('#tblProductApprove tbody').on('click', 'tr', function () {
        //$('#tblProductApprove tbody tr').removeClass("selected");
        $(this).toggleClass('selected');
    });

    //Admin Product Table
    var tblAProducts = $('#tblAProducts').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '50' },    //VendorCode
            { 'targets': 2, 'width': '50' },    //Company Name
            { 'targets': 3, 'width': '50' },     //SKU
            { 'targets': 4, 'width': '100' },   //Product Name
            { 'targets': 5, 'width': '100' },   //Description
            { 'targets': 6, 'width': '100' },   //Category
            { 'targets': 7, 'width': '100' },   //Brand
            { 'targets': 8, 'width': '50' },    //UOM
            { 'targets': 9, 'width': '50' },    //MRP List
            { 'targets': 10, 'width': '50' },   //Transfer Price
            { 'targets': 11, 'width': '50' },   //GST
            { 'targets': 12, 'width': '50' },   //HSNCode
            { 'targets': 13, 'width': '50' },   //LeadTime
            { 'targets': 14, 'width': '50' }   //Inventory

        ],
        "scrollX": true,
        //"order": [2, 'asc'],
        "paging": true,
        dom: 'Bfrtip',
        "buttons": [
            {
                extend: 'excel',
                text: '<i class="fa fa-print"></i> Excel',
                title: "Vendor Product Excel",
                exportOptions: {
                    columns: ':visible'
                }
            }, 'colvis'
        ]
    });

    tblAProducts.on('order.dt search.dt', function () {
        tblAProducts.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblAProducts.cell(cell).invalidate('dom');
        });
    }).draw();
    //Admin Product Table

    var tblPOMargin = $('#tblPOMargin').DataTable({
        "scrollX": true,
        "paging": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            'pageLength',
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ]
    });
    tblPOMargin.on('order.dt search.dt', function () {
        tblPOMargin.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblPOMargin.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblporeport = $('#tblporeport').DataTable({
        "scrollX": true,
        "paging": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            'pageLength',
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ]
    });

    tblporeport.on('order.dt search.dt', function () {
        tblporeport.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblporeport.cell(cell).invalidate('dom');
        });
    }).draw();
    //Registered Vendor Index Info Table

    //Registered Vendor Index Info Table
    var tblpurchaseorder = $('#tblpurchaseorder').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '20', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '30', 'searchable': false, 'orderable': false },  //Edit
            { 'targets': 2, 'width': '120', 'orderable': false },   //ContactPerson
            { 'targets': 3, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 4, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 5, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 6, 'width': '300', 'orderable': false },    //Contact
            { 'targets': 7, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 8, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 9, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 10, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 11, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 12, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 13, 'width': '60' },   //Contact
            { 'targets': 14, 'width': '60' }    //Contact
        ],
        "scrollX": true,
        "paging": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            'pageLength',
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ]
    });

    tblpurchaseorder.on('order.dt search.dt', function () {
        tblpurchaseorder.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblpurchaseorder.cell(cell).invalidate('dom');
        });
    }).draw();
    //Registered Vendor Index Info Table

    //VendorSourced Table
    var tblvensourced = $('#tblvensourced').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
        ],
        "paging": false,
        //"searching": false,
        "info": false
    });

    tblvensourced.on('order.dt search.dt', function () {
        tblvensourced.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblvensourced.cell(cell).invalidate('dom');
        });
    }).draw();
    //Vendor Info Table

    //$("#PurOrdModels_CustomerId").change(function () {
    //    var cstid = $('#PurOrdModels_CustomerId').val();
    //    if (cstid !== "") {
    //        $.ajax({
    //            url: '/Admin/GetPOCreatedBy',
    //            data: { cstid: cstid },
    //            type: "GET",
    //            dataType: "JSON",
    //            success: function (res) {
    //                var relsn = res;
    //                $('#PurOrdModels_POSentBy').empty();
    //                if (relsn.length === 0) {
    //                    $("#PurOrdModels_POSentBy").attr("required", true);
    //                    $("#PurOrdModels_POSentBy").attr("disabled", true);
    //                }
    //                else if (relsn.length === 1) {
    //                    $("#PurOrdModels_POSentBy").attr("disabled", false);
    //                    var optionrel = '<option value="' + relsn[0].id + '">' + relsn[0].name + '</option>';
    //                    $('#PurOrdModels_POSentBy').append(optionrel);
    //                    $('#PurOrdModels_POSentBy').val(relsn[0].id);
    //                }
    //                else if (relsn.length > 1) {
    //                    $('#PurOrdModels_POSentBy').val("");
    //                    $("#PurOrdModels_POSentBy").attr("disabled", false);
    //                    var optionrel = '<option value=""> --Select Created By-- </option>';
    //                    $('#PurOrdModels_POSentBy').append(optionrel);
    //                    $("#PurOrdModels_POSentBy").attr("required", true);
    //                    for (var i = 0; i < relsn.length; i++) {
    //                        var optionrel = '<option value="' + relsn[i].id + '">' + relsn[i].name + '</option>';
    //                        $('#PurOrdModels_POSentBy').append(optionrel);
    //                    }
    //                }
    //            },
    //            error: function () {
    //                alert("Failed! Please try again.");
    //            }
    //        });
    //    }
    //    else {
    //        $('#PurOrdModels_POSentBy').empty();
    //        $("#PurOrdModels_POSentBy").attr("required", true);
    //        $("#PurOrdModels_POSentBy").attr("disabled", true);
    //    }
    //});

    $("#CustomerModels_Region").change(function () {
        var rgnid = $('#CustomerModels_Region').val();
        if (rgnid !== "") {
            $.ajax({
                url: '/Admin/GetJsonState',
                data: { rgnid: rgnid },
                type: "GET",
                dataType: "JSON",
                success: function (res) {
                    var relsn = res;
                    $('#CustomerModels_State').empty();
                    if (relsn.length === 0) {
                        $("#CustomerModels_State").attr("required", true);
                        $("#CustomerModels_State").attr("disabled", true);
                    }
                    else if (relsn.length === 1) {
                        $("#CustomerModels_State").attr("disabled", false);
                        var optionrel = '<option value="' + relsn[0].Id + '">' + relsn[0].Value + '</option>';
                        $('#CustomerModels_State').append(optionrel);
                        $('#CustomerModels_State').val(relsn[0].Id);
                    }
                    else if (relsn.length > 1) {
                        $('#CustomerModels_State').val("");
                        $("#CustomerModels_State").attr("disabled", false);
                        var optionrel = '<option value="">-- Select State --</option>';
                        $('#CustomerModels_State').append(optionrel);
                        $("#CustomerModels_State").attr("required", true);
                        for (var i = 0; i < relsn.length; i++) {
                            var optionrel = '<option value="' + relsn[i].Id + '">' + relsn[i].Value + '</option>';
                            $('#CustomerModels_State').append(optionrel);
                        }
                    }
                },
                error: function () {
                    alert("Failed! Please try again.");
                }
            });
        }
        else {
            $('#CustomerModels_State').empty();
            $("#CustomerModels_State").attr("required", true);
            $("#CustomerModels_State").attr("disabled", true);
        }
    });

    $("#CustomerBillingAddressModels_Region").change(function () {
        var rgnid = $('#CustomerBillingAddressModels_Region').val();
        $('#CustomerShippingAddressModels_Region').val(rgnid).trigger('change.select2').change();
        if (rgnid !== "") {
            $.ajax({
                url: '/Admin/GetJsonState',
                data: { rgnid: rgnid },
                type: "GET",
                dataType: "JSON",
                success: function (res) {
                    var relsn = res;
                    $('#CustomerBillingAddressModels_State').empty();
                    if (relsn.length === 0) {
                        $("#CustomerBillingAddressModels_State").attr("required", true);
                        $("#CustomerBillingAddressModels_State").attr("disabled", true);
                    }
                    else if (relsn.length === 1) {
                        $("#CustomerBillingAddressModels_State").attr("disabled", false);
                        var optionrel = '<option value="' + relsn[0].Id + '">' + relsn[0].Value + '</option>';
                        $('#CustomerBillingAddressModels_State').append(optionrel);
                        $('#CustomerBillingAddressModels_State').val(relsn[0].Id);

                    }
                    else if (relsn.length > 1) {
                        $('#CustomerBillingAddressModels_State').val("");
                        $("#CustomerBillingAddressModels_State").attr("disabled", false);
                        var optionrel = '<option value="">-- Select State --</option>';
                        $('#CustomerBillingAddressModels_State').append(optionrel);
                        $("#CustomerBillingAddressModels_State").attr("required", true);
                        for (var i = 0; i < relsn.length; i++) {
                            var optionrel = '<option value="' + relsn[i].Id + '">' + relsn[i].Value + '</option>';
                            $('#CustomerBillingAddressModels_State').append(optionrel);
                        }

                    }
                },
                error: function () {
                    alert("Failed! Please try again.");
                }
            });
        }
        else {
            $('#CustomerBillingAddressModels_State').empty();
            $("#CustomerBillingAddressModels_State").attr("required", true);
            $("#CustomerBillingAddressModels_State").attr("disabled", true);
        }
    });


    //$("#CustomerBillingAddressModels_State").change(function () {
    //    var stsid = $('#CustomerBillingAddressModels_State').val();
    //    $('#CustomerShippingAddressModels_State').val(stsid).trigger('change.select2').change();
    //    if (stsid !== "") {
    //        $.ajax({
    //            url: '/Admin/GetJsonDistrict',
    //            data: { stsid: stsid },
    //            type: "GET",
    //            dataType: "JSON",
    //            success: function (res) {
    //                var relsn = res;
    //                $('#CustomerBillingAddressModels_District').empty();
    //                if (relsn.length === 0) {
    //                    $("#CustomerBillingAddressModels_District").attr("required", true);
    //                    $("#CustomerBillingAddressModels_District").attr("disabled", true);
    //                }
    //                else if (relsn.length === 1) {
    //                    $("#CustomerBillingAddressModels_District").attr("disabled", false);
    //                    var optionrel = '<option value="' + relsn[0].Id + '">' + relsn[0].Value + '</option>';
    //                    $('#CustomerBillingAddressModels_District').append(optionrel);
    //                    $('#CustomerBillingAddressModels_District').val(relsn[0].Id);
    //                }
    //                else if (relsn.length > 1) {
    //                    $('#CustomerBillingAddressModels_District').val("");
    //                    $("#CustomerBillingAddressModels_District").attr("disabled", false);
    //                    var optionrel = '<option value="">-- Select District --</option>';
    //                    $('#CustomerBillingAddressModels_District').append(optionrel);
    //                    $("#CustomerBillingAddressModels_District").attr("required", true);
    //                    for (var i = 0; i < relsn.length; i++) {
    //                        var optionrel = '<option value="' + relsn[i].Id + '">' + relsn[i].Value + '</option>';
    //                        $('#CustomerBillingAddressModels_District').append(optionrel);
    //                    }
    //                }
    //            },
    //            error: function () {
    //                alert("Failed! Please try again.");
    //            }
    //        });
    //    }
    //    else {
    //        $('#CustomerBillingAddressModels_District').empty();
    //        $("#CustomerBillingAddressModels_District").attr("required", true);
    //        $("#CustomerBillingAddressModels_District").attr("disabled", true);
    //    }
    //});


    $("#CustomerShippingAddressModels_Region").change(function () {
        var rgnid = $('#CustomerShippingAddressModels_Region').val();
        if (rgnid !== "") {
            $.ajax({
                url: '/Admin/GetJsonState',
                data: { rgnid: rgnid },
                type: "GET",
                dataType: "JSON",
                success: function (res) {
                    var relsn = res;
                    $('#CustomerShippingAddressModels_State').empty();
                    if (relsn.length === 0) {
                        $("#CustomerShippingAddressModels_State").attr("required", true);
                        $("#CustomerShippingAddressModels_State").attr("disabled", true);
                    }
                    else if (relsn.length === 1) {
                        $("#CustomerShippingAddressModels_State").attr("disabled", false);
                        var optionrel = '<option value="' + relsn[0].Id + '">' + relsn[0].Value + '</option>';
                        $('#CustomerShippingAddressModels_State').append(optionrel);
                        $('#CustomerShippingAddressModels_State').val(relsn[0].Id);
                    }
                    else if (relsn.length > 1) {
                        $('#CustomerShippingAddressModels_State').val("");
                        $("#CustomerShippingAddressModels_State").attr("disabled", false);
                        var optionrel = '<option value="">-- Select State --</option>';
                        $('#CustomerShippingAddressModels_State').append(optionrel);
                        $("#CustomerShippingAddressModels_State").attr("required", true);
                        for (var i = 0; i < relsn.length; i++) {
                            var optionrel = '<option value="' + relsn[i].Id + '">' + relsn[i].Value + '</option>';
                            $('#CustomerShippingAddressModels_State').append(optionrel);
                        }
                    }
                },
                error: function () {
                    alert("Failed! Please try again.");
                }
            });
        }
        else {
            $('#CustomerShippingAddressModels_State').empty();
            $("#CustomerShippingAddressModels_State").attr("required", true);
            $("#CustomerShippingAddressModels_State").attr("disabled", true);
        }
    });

    //$("#CustomerShippingAddressModels_State").change(function () {
    //    var stsid = $('#CustomerShippingAddressModels_State').val();
    //    if (stsid !== "") {
    //        $.ajax({
    //            url: '/Admin/GetJsonDistrict',
    //            data: { stsid: stsid },
    //            type: "GET",
    //            dataType: "JSON",
    //            success: function (res) {
    //                var relsn = res;
    //                $('#CustomerShippingAddressModels_District').empty();
    //                if (relsn.length === 0) {
    //                    $("#CustomerShippingAddressModels_District").attr("required", true);
    //                    $("#CustomerShippingAddressModels_District").attr("disabled", true);
    //                }
    //                else if (relsn.length === 1) {
    //                    $("#CustomerShippingAddressModels_District").attr("disabled", false);
    //                    var optionrel = '<option value="' + relsn[0].Id + '">' + relsn[0].Value + '</option>';
    //                    $('#CustomerShippingAddressModels_District').append(optionrel);
    //                    $('#CustomerShippingAddressModels_District').val(relsn[0].Id);
    //                }
    //                else if (relsn.length > 1) {
    //                    $('#CustomerShippingAddressModels_District').val("");
    //                    $("#CustomerShippingAddressModels_District").attr("disabled", false);
    //                    var optionrel = '<option value="">-- Select District --</option>';
    //                    $('#CustomerShippingAddressModels_District').append(optionrel);
    //                    $("#CustomerShippingAddressModels_District").attr("required", true);
    //                    for (var i = 0; i < relsn.length; i++) {
    //                        var optionrel = '<option value="' + relsn[i].Id + '">' + relsn[i].Value + '</option>';
    //                        $('#CustomerShippingAddressModels_District').append(optionrel);
    //                    }
    //                }
    //            },
    //            error: function () {
    //                alert("Failed! Please try again.");
    //            }
    //        });
    //    }
    //    else {
    //        $('#CustomerShippingAddressModels_District').empty();
    //        $("#CustomerShippingAddressModels_District").attr("required", true);
    //        $("#CustomerShippingAddressModels_District").attr("disabled", true);
    //    }
    //});

    $(".isshpsame").click(function () {
        if ($(this).is(":checked")) {
            $("#CustomerShippingAddressModels_IsSame").val(true);
            $("#CustomerShippingAddressModels_Address").val($("#CustomerBillingAddressModels_Address").val());
            //$('#CustomerShippingAddressModels_Address').prop('readonly', true);
            //$('#CustomerShippingAddressModels_Region').prop('disabled', 'disabled');
            //$('#CustomerShippingAddressModels_State').prop('disabled', 'disabled');
            $("#CustomerShippingAddressModels_District").val($("#CustomerBillingAddressModels_District").val());
            //$('#CustomerShippingAddressModels_District').prop('disabled', 'disabled');
            $("#CustomerShippingAddressModels_City").val($("#CustomerBillingAddressModels_City").val());
            //$('#CustomerShippingAddressModels_City').prop('readonly', true);
            $("#CustomerShippingAddressModels_Pincode").val($("#CustomerBillingAddressModels_Pincode").val());
            //$('#CustomerShippingAddressModels_Pincode').prop('readonly', true);


        } else {
            $("#CustomerShippingAddressModels_IsSame").val(false);
            //$('#CustomerShippingAddressModels_Address').prop('readonly', false);
            //$('#CustomerShippingAddressModels_Region').prop('disabled', false);
            //$('#CustomerShippingAddressModels_State').prop('disabled', false);
            //$('#CustomerShippingAddressModels_District').prop('disabled', false);
            //$('#CustomerShippingAddressModels_City').prop('readonly', false);
            //$('#CustomerShippingAddressModels_Pincode').prop('readonly', false);
        }
    });

    $("#PurOrdModels_CustomerId").change(function () {
        var cstid = $('#PurOrdModels_CustomerId').val();
        if (cstid !== "") {
            $.ajax({
                url: '/Admin/GetCustomerBillAdd',
                data: { cstid: cstid },
                type: "GET",
                dataType: "JSON",
                success: function (res) {
                    var relsn = res;
                    $('#PurOrdModels_CustomerBillAdd').empty();
                    if (relsn.length === 0) {
                        $("#PurOrdModels_CustomerBillAdd").attr("required", true);
                        $("#PurOrdModels_CustomerBillAdd").attr("disabled", true);
                    }
                    else if (relsn.length === 1) {
                        $("#PurOrdModels_CustomerBillAdd").attr("disabled", false);
                        var optionrel = '<option value="' + relsn[0].Id + '">' + relsn[0].Value + '</option>';
                        $('#PurOrdModels_CustomerBillAdd').append(optionrel);
                        $('#PurOrdModels_CustomerBillAdd').val(relsn[0].Id);
                    }
                    else if (relsn.length > 1) {
                        $('#PurOrdModels_CustomerBillAdd').val("");
                        $("#PurOrdModels_CustomerBillAdd").attr("disabled", false);
                        var optionrel = '<option value=""> --Customer Billing Address-- </option>';
                        $('#PurOrdModels_CustomerBillAdd').append(optionrel);
                        $("#PurOrdModels_CustomerBillAdd").attr("required", true);
                        for (var i = 0; i < relsn.length; i++) {
                            var optionrel = '<option value="' + relsn[i].Id + '">' + relsn[i].Value + '</option>';
                            $('#PurOrdModels_CustomerBillAdd').append(optionrel);
                        }
                    }
                },
                error: function () {
                    alert("Failed! Please try again.");
                }
            });

            $.ajax({
                url: '/Admin/GetCustomerShipAdd',
                data: { cstid: cstid },
                type: "GET",
                dataType: "JSON",
                success: function (res) {
                    var relsn = res;
                    $('#PurOrdModels_CustomerShipAdd').empty();
                    if (relsn.length === 0) {
                        $("#PurOrdModels_CustomerShipAdd").attr("required", true);
                        $("#PurOrdModels_CustomerShipAdd").attr("disabled", true);
                    }
                    else if (relsn.length === 1) {
                        $("#PurOrdModels_CustomerShipAdd").attr("disabled", false);
                        var optionrel = '<option value="' + relsn[0].Id + '">' + relsn[0].Value + '</option>';
                        $('#PurOrdModels_CustomerShipAdd').append(optionrel);
                        $('#PurOrdModels_CustomerShipAdd').val(relsn[0].Id);
                    }
                    else if (relsn.length > 1) {
                        $('#PurOrdModels_CustomerShipAdd').val("");
                        $("#PurOrdModels_CustomerShipAdd").attr("disabled", false);
                        var optionrel = '<option value=""> --Customer Shipping Address-- </option>';
                        $('#PurOrdModels_CustomerShipAdd').append(optionrel);
                        $("#PurOrdModels_CustomerShipAdd").attr("required", true);
                        for (var i = 0; i < relsn.length; i++) {
                            var optionrel = '<option value="' + relsn[i].Id + '">' + relsn[i].Value + '</option>';
                            $('#PurOrdModels_CustomerShipAdd').append(optionrel);
                        }
                    }
                },
                error: function () {
                    alert("Failed! Please try again.");
                }
            });
        }
        else {
            $('#PurOrdModels_CustomerBillAdd').empty();
            $("#PurOrdModels_CustomerBillAdd").attr("required", true);
            $("#PurOrdModels_CustomerBillAdd").attr("disabled", true);
            $('#PurOrdModels_CustomerShipAdd').empty();
            $("#PurOrdModels_CustomerShipAdd").attr("required", true);
            $("#PurOrdModels_CustomerShipAdd").attr("disabled", true);
        }
    });

    $('.select2').select2();

    var tblassignpo = $('#tblassignpo').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                }
            },                      //Select
            { 'targets': 1, 'width': '20', 'orderable': false },       //SNo
            { 'targets': 2, 'width': '30', 'orderable': false },       //OrderDate
            { 'targets': 3, 'width': '80', 'orderable': false },       //CustomerName
            { 'targets': 4, 'width': '30', 'orderable': false },       //PONumber
            { 'targets': 5, 'width': '30', 'orderable': false },       //POId
            { 'targets': 6, 'width': '30', 'orderable': false },       //POPId
            { 'targets': 7, 'width': '200', 'orderable': false },       //Product
            { 'targets': 8, 'width': '20', 'orderable': false },       //Quantity
            { 'targets': 9, 'width': '20', 'orderable': false },       //Unit
            { 'targets': 10, 'width': '20', 'orderable': false },      //Price
            { 'targets': 11, 'width': '20', 'orderable': false },      //Discount
            { 'targets': 12, 'width': '30', 'orderable': false },       //TotalPrice
            { 'targets': 13, 'width': '20', 'orderable': false },       //GST
            { 'targets': 14, 'width': '20', 'orderable': false },      //Status
            { 'targets': 15, 'width': '40', 'orderable': false },      //POCreatedBy
            { 'targets': 16, 'width': '40' }       //POAssingTo
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            'pageLength',
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ]
    });
    tblassignpo.on('order.dt search.dt', function () {
        tblassignpo.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblassignpo.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblposourced = $('#tblposourced').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                }
            },                      //Select
            { 'targets': 1, 'width': '20', 'orderable': false },       //SNo
            { 'targets': 2, 'width': '30', 'orderable': false },       //OrderDate
            { 'targets': 3, 'width': '80', 'orderable': false },       //CustomerName
            { 'targets': 4, 'width': '30', 'orderable': false },       //PONumber
            { 'targets': 5, 'width': '30', 'orderable': false },       //POId
            { 'targets': 6, 'width': '30', 'orderable': false },       //POPId
            { 'targets': 7, 'width': '200', 'orderable': false },       //Product
            { 'targets': 8, 'width': '20', 'orderable': false },       //Quantity
            { 'targets': 9, 'width': '20', 'orderable': false },       //Unit
            { 'targets': 10, 'width': '20', 'orderable': false },      //Price
            { 'targets': 11, 'width': '20', 'orderable': false },      //Discount
            { 'targets': 12, 'width': '30', 'orderable': false },       //TotalPrice
            { 'targets': 13, 'width': '20', 'orderable': false },       //GST
            { 'targets': 14, 'width': '20', 'orderable': false },      //Status
            { 'targets': 15, 'width': '40', 'orderable': false },      //POCreatedBy
            { 'targets': 16, 'width': '40', 'orderable': false }       //POAssingTo
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            'pageLength',
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ]
    });
    tblposourced.on('order.dt search.dt', function () {
        tblposourced.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblposourced.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblPOGenerate = $('#tblPOGenerate').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                }
            },                      //SNo
            { 'targets': 1 },       //Select
            { 'targets': 2 },       //OrderDate
            { 'targets': 3 },       //CustomerName
            { 'targets': 4 },       //POId
            { 'targets': 5 },       //PONumber
            { 'targets': 6 },       //POPId
            { 'targets': 7 },       //Product
            { 'targets': 8 },       //Quantity
            { 'targets': 9 },       //Unit
            { 'targets': 10 },      //Price
            { 'targets': 11 },      //EnqId
            { 'targets': 12 },      //VendorId
            { 'targets': 13 },      //VendorPrice
            { 'targets': 14 },      //Status
            { 'targets': 15 },      //POCreatedBy
            { 'targets': 16 },      //POAssignTo
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false
    });
    tblPOGenerate.on('order.dt search.dt', function () {
        tblPOGenerate.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblPOGenerate.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblPOApprove = $('#tblPOApprove').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                }
            },                      //SNo
            { 'targets': 1 },       //Select
            { 'targets': 2 },       //OrderDate
            { 'targets': 3 },       //CustomerName
            { 'targets': 4 },       //POId
            { 'targets': 5 },       //PONumber
            { 'targets': 6 },       //Margin
            { 'targets': 7 },       //Margin
            { 'targets': 8 },       //Margin
            { 'targets': 9 },       //Margin
            { 'targets': 10 },       //Margin
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false
    });
    tblPOApprove.on('order.dt search.dt', function () {
        tblPOApprove.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblPOApprove.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblPOApproved = $('#tblPOApproved').DataTable({
        "columnDefs": [
            { 'targets': 0 },       //SNo
            { 'targets': 1 },       //OrderDate
            { 'targets': 2 },       //CustomerName
            { 'targets': 3 },       //POId
            { 'targets': 4 },       //PONumber
            { 'targets': 5 },       //Vendor
            { 'targets': 6 },       //VendorPrice
            { 'targets': 7 },       //Price
            { 'targets': 8 },       //Margin
            { 'targets': 9 },       //Download
        ],
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false
    });
    tblPOApproved.on('order.dt search.dt', function () {
        tblPOApproved.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblPOApproved.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblpodetails = $('#tblpodetails').DataTable({
        "paging": false,
        "searching": false,
        "info": false,
        "scrollX": true,
    });
    tblpodetails.on('order.dt search.dt', function () {
        tblpodetails.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblpodetails.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblRequestPayment = $('#tblRequestPayment').DataTable({
        "scrollX": true,
        "paging": false,
        "info": false
    });
    tblRequestPayment.on('order.dt search.dt', function () {
        tblRequestPayment.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblRequestPayment.cell(cell).invalidate('dom');
        });
    }).draw();

    $('.rppmnttype').change(function () {
        $('.rppmntmode option[value="NEFT"]').prop('disabled', $(this).val() == 'CREDIT');
        $('.rppmntmode option[value="CD CHEQUE"]').prop('disabled', $(this).val() == 'CREDIT');
        $('.rppmntmode option[value="CASH"]').prop('disabled', $(this).val() == 'CREDIT');

        $('.rppmntmode option[value="PDC CHEQUE"]').prop('disabled', $(this).val() == 'ADVANCE');
        $('.rppmntmode option[value="OPEN CREDIT"]').prop('disabled', $(this).val() == 'ADVANCE');

        var ptype = $('.rppmnttype').val();
        if (ptype !== "" && ptype !== "--Select Payment Type--") {
            if (ptype == "CREDIT") {
                $(".noofdays").prop('readonly', false);
                $(".advvalue").prop('readonly', true);
                $(".advvalue").val("0");
                $(".pdcvalue").prop('readonly', false);
            }
            else if (ptype == "ADVANCE") {
                $(".noofdays").prop('readonly', true);
                $(".noofdays").val("0");
                $(".advvalue").prop('readonly', false);
                $(".pdcvalue").prop('readonly', true);
                $(".pdcvalue").val("0");
            }
            else if (ptype == "CREDIT+ADVANCE") {
                $(".noofdays").prop('readonly', false);
                $(".advvalue").prop('readonly', false);
                $(".pdcvalue").prop('readonly', false);
            }
        }
        else {
            $(".noofdays").prop('readonly', true);
        }
    });

    $('.rpmtsts').change(function () {
        var mtsts = $('.rpmtsts').val();
        if (mtsts !== "" && mtsts !== "--Select Material Status--") {
            if (mtsts == "LEAD TIME") {
                $(".ldtime").prop('readonly', false);
            }
            else {
                $(".ldtime").prop('readonly', true);
                $(".ldtime").val("0");
            }
        }
        else {
            $(".ldtime").prop('readonly', true);
            $(".ldtime").val("0");
        }
    });

    var tblPORequestPayment = $('#tblPORequestPayment').DataTable({
        "paging": false,
        "info": false,
        "scrollX": true
    });
    tblPORequestPayment.on('order.dt search.dt', function () {
        tblPORequestPayment.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblPORequestPayment.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblPRApproval = $('#tblPRApproval').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                }
            }
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        "info": false
    });
    tblPRApproval.on('order.dt search.dt', function () {
        tblPRApproval.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblPRApproval.cell(cell).invalidate('dom');
        });
    }).draw();


    var tblPaymentProcessing = $('#tblPaymentProcessing').DataTable({
        "columnDefs": [
            { 'targets': 0 },       //SNo
            { 'targets': 1 },       //OrderDate
            { 'targets': 2 },       //CustomerName
            { 'targets': 3 },       //POId
            { 'targets': 4 },       //PONumber
            { 'targets': 5 },       //Vendor
            { 'targets': 6 },       //VendorPrice
            { 'targets': 7 },       //Price
            { 'targets': 8 },       //Margin
            { 'targets': 9 },       //Download
            { 'targets': 10 },       //Status
            { 'targets': 11 },       //Payment
            { 'targets': 12 },       //Payment
        ],
        "scrollX": true,
        "paging": false,
        "info": false
    });
    tblPaymentProcessing.on('order.dt search.dt', function () {
        tblPaymentProcessing.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblPaymentProcessing.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblPOPayment = $('#tblPOPayment').DataTable({
        "paging": false,
        "info": false
    });
    tblPOPayment.on('order.dt search.dt', function () {
        tblPOPayment.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblPOPayment.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblPaymentDetails = $('#tblPaymentDetails').DataTable({
        "paging": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ]
    });
    tblPaymentDetails.on('order.dt search.dt', function () {
        tblPaymentDetails.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblPaymentDetails.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblMaterialPickup = $('#tblMaterialPickup').DataTable({
        "paging": false,
        "info": false,
        "scrollX": true
    });
    tblMaterialPickup.on('order.dt search.dt', function () {
        tblMaterialPickup.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblMaterialPickup.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblStock = $('#tblStock').DataTable({
        "paging": false,
        "info": false
    });
    tblStock.on('order.dt search.dt', function () {
        tblStock.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblStock.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblUsers = $('#tblUsers').DataTable({
        "paging": false,
        "info": false,
        "scrollX": true
    });
    tblUsers.on('order.dt search.dt', function () {
        tblUsers.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblUsers.cell(cell).invalidate('dom');
        });
    }).draw();

    var emploginlist = $('#emploginlist').DataTable({
        "paging": false,
        "info": false
    });
    emploginlist.on('order.dt search.dt', function () {
        emploginlist.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            emploginlist.cell(cell).invalidate('dom');
        });
    }).draw();

    var sel_emp_list = $('#sel_emp_list').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false, 'className': 'select-checkbox' },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Id Hidden
            { 'targets': 2, 'width': '100' },       //EmployeeCode
            { 'targets': 3, 'width': '100' },       //Name
            { 'targets': 4, 'width': '100' },       //MobileNo
            { 'targets': 5, 'width': '200' }        //Address
        ],
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        "order": [3, 'asc'],
        "paging": true
    });

    $("#sel_emp_list_filter input").keypress(function () {
        $('#sel_emp_list tbody tr').removeClass("selected");
    });

    $('#btn_SelEmp').click(function () {
        var tbl = $('#sel_emp_list').DataTable();
        var empcode = $.map(tbl.rows('.selected').data(), function (item) {
            return item[2];
        });
        var empname = $.map(tbl.rows('.selected').data(), function (item) {
            return item[3];
        });

        $(".empcode").val(empcode);
        $(".empname").val(empname);
        $('#sel_emp_list tbody tr').removeClass("selected");
    });

    $('#sel_emp_list tbody').on('click', 'tr', function () {
        $('#sel_emp_list tbody tr').removeClass('selected');
        $(this).toggleClass('selected');
    });

    var tblGroupName = $('#tblGroupName').DataTable({
        "paging": false,
        "info": false,
    });
    tblGroupName.on('order.dt search.dt', function () {
        tblGroupName.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblGroupName.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblPageName = $('#tblPageName').DataTable({
        "paging": false,
        "info": false,
    });
    tblPageName.on('order.dt search.dt', function () {
        tblPageName.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblPageName.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblRequestInvoice = $('#tblRequestInvoice').DataTable({
        "paging": false,
        "info": false,
    });
    tblRequestInvoice.on('order.dt search.dt', function () {
        tblRequestInvoice.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblRequestInvoice.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblmrhdetails = $('#tblmrhdetails').DataTable({
        "paging": false,
        "info": false,
    });
    tblmrhdetails.on('order.dt search.dt', function () {
        tblmrhdetails.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblmrhdetails.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblpobackstage = $('#tblpobackstage').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                }
            }
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false,
    });
    tblpobackstage.on('order.dt search.dt', function () {
        tblpobackstage.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblpobackstage.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblquotbackstage = $('#tblquotbackstage').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                }
            }
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false,
    });
    tblquotbackstage.on('order.dt search.dt', function () {
        tblquotbackstage.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblquotbackstage.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblDispatched = $('#tblDispatched').DataTable({
        "paging": false,
        "info": false,
    });
    tblDispatched.on('order.dt search.dt', function () {
        tblDispatched.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblDispatched.cell(cell).invalidate('dom');
        });
    }).draw();

    $(document).on('blur', '.cstmtrcd', function () {
        var matcode = $(".cstmtrcd").val();
        //e.preventDefault();
        if (matcode !== "") {
            $.ajax({
                url: '/Admin/GetProductDetWMatCode',
                data: "{'matcode':'" + matcode + "'}",
                type: "POST",
                dataType: "JSON",
                contentType: "application/json; charset=utf-8",
                success: function (res) {
                    var lst = res;
                    if (lst === undefined || lst === "") {
                        $(".skuno").val("");
                        $(".prdid").val("");
                        $(".modelno").val("");
                        $(".prdctgid").val("");
                        $(".brndid").val("");
                        $(".hsncode").val("");
                        $(".untid").val("");
                        $(".spcrmk").val("");
                        $(".qty").val("");
                        $(".price").val("");
                        $(".gst").val("");
                        $(".discount").val("");
                    }
                    else {
                        $(".skuno").val(res[0].SKUNo).trigger('change.select2');
                        $(".prdid").val(res[0].ProductId);
                        $(".modelno").val(res[0].ModelNo);
                        $(".prdctgid").val(res[0].PrdCtgryId).trigger('change.select2');
                        $(".brndid").val(res[0].BrandId).trigger('change.select2');
                        $(".hsncode").val(res[0].HSNCode);
                        $(".untid").val(res[0].UnitId).trigger('change.select2');
                        $(".spcrmk").val(res[0].SpcRemark);
                        $(".qty").val(res[0].Quantity);
                        $(".price").val(res[0].Price);
                        $(".gst").val(res[0].GST);
                        $(".discount").val(res[0].Discount);
                    }
                },
                error: function (e) {
                    alert("Failed! Please try again.");
                }
            });
        }
        else {
            $(".skuno").val("");
            $(".prdid").val("");
            $(".modelno").val("");
            $(".prdctgid").val("");
            $(".brndid").val("");
            $(".hsncode").val("");
            $(".untid").val("");
            $(".spcrmk").val("");
            $(".qty").val("");
            $(".price").val("");
            $(".gst").val("");
            $(".discount").val("");
        }
    });

    $(".pmntmode").change(function () {
        var pmode = $('.pmntmode').val();
        if (pmode !== "" && pmode !== "--Select Payment Mode--") {
            if (pmode == "PDC CHEQUE") {
                $(".noofdays").prop('readonly', false);
                $(".cheqno").prop('readonly', false);
            }
            else {
                $(".noofdays").prop('readonly', true);
                $(".cheqno").prop('readonly', false);
            }
        }
        else {
            $(".noofdays").prop('readonly', true);
            $(".cheqno").prop('readonly', false);
        }
    });

    $("#VendorContactModels_PickAddrLin1").blur(function (event) {
        $("#VendorContactModels_BilAddrLin1").val($("#VendorContactModels_PickAddrLin1").val());
        $("#VendorContactModels_RetAddrLin1").val($("#VendorContactModels_PickAddrLin1").val());
    });
    $("#VendorContactModels_PickAddrLin2").blur(function (event) {
        $("#VendorContactModels_BilAddrLin2").val($("#VendorContactModels_PickAddrLin2").val());
        $("#VendorContactModels_RetAddrLin2").val($("#VendorContactModels_PickAddrLin2").val());
    });
    $("#VendorContactModels_PickContact1").blur(function (event) {
        $("#VendorContactModels_BilContact1").val($("#VendorContactModels_PickContact1").val());
        $("#VendorContactModels_RetContact1").val($("#VendorContactModels_PickContact1").val());
    });
    $("#VendorContactModels_PickContact2").blur(function (event) {
        $("#VendorContactModels_BilContact2").val($("#VendorContactModels_PickContact2").val());
        $("#VendorContactModels_RetContact2").val($("#VendorContactModels_PickContact2").val());
    });
    $("#VendorContactModels_PickEmail").blur(function (event) {
        $("#VendorContactModels_BilEmail").val($("#VendorContactModels_PickEmail").val());
        $("#VendorContactModels_RetEmail").val($("#VendorContactModels_PickEmail").val());
    });
    $("#VendorContactModels_PickCity").blur(function (event) {
        $("#VendorContactModels_BilCity").val($("#VendorContactModels_PickCity").val());
        $("#VendorContactModels_RetCity").val($("#VendorContactModels_PickCity").val());
    });
    $("#VendorContactModels_PickPincode").blur(function (event) {
        $("#VendorContactModels_BilPincode").val($("#VendorContactModels_PickPincode").val());
        $("#VendorContactModels_RetPincode").val($("#VendorContactModels_PickPincode").val());
    });

    $("#VendorContactModels_PickState").change(function () {
        var cstid = $('#VendorContactModels_PickState').val();
        $("#VendorContactModels_BilState").val(cstid).trigger('change.select2');
        $("#VendorContactModels_RetState").val(cstid).trigger('change.select2');
    });

    $("#VendorContactModels_PickCountry").change(function () {
        var cstid = $('#VendorContactModels_PickCountry').val();
        $("#VendorContactModels_BilCountry").val(cstid).trigger('change.select2');
        $("#VendorContactModels_RetCountry").val(cstid).trigger('change.select2');
    });

    $('#addtemppoline').click(function () { AddTempPOLine(); });
    $(".divsource").hide();
    $('.posourced').click(function () { AddTempPOSourced(); });
    $(".divgen").hide();
    $('#POGenerate').click(function () { AddTempPOGenerate(); });

    var tblIndusTeam = $('#tblIndusTeam').DataTable({
    });

    tblIndusTeam.on('order.dt search.dt', function () {
        tblIndusTeam.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblIndusTeam.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblEnquiryStatus = $('#tblEnquiryStatus').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                }
            },                      //Select
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false,
    });
    tblEnquiryStatus.on('order.dt search.dt', function () {
        tblEnquiryStatus.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblEnquiryStatus.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblEnquiryReport = $('#tblEnquiryReport').DataTable({
        "columnDefs": [
        ],
        "scrollX": true,
        "paging": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            'pageLength',
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ]
    });

    tblEnquiryReport.on('order.dt search.dt', function () {
        tblEnquiryReport.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblEnquiryReport.cell(cell).invalidate('dom');
        });
    }).draw();


    var tblEnquiry = $('#tblEnquiry').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '20', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '30', 'searchable': false, 'orderable': false },  //Edit
            { 'targets': 2, 'width': '120', 'orderable': false },   //ContactPerson
            { 'targets': 3, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 4, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 5, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 6, 'width': '300', 'orderable': false },    //Contact
            { 'targets': 7, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 8, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 9, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 10, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 11, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 12, 'width': '60', 'orderable': false },    //Contact
            { 'targets': 13, 'width': '60' },   //Contact
        ],
        "scrollX": true,
        "paging": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            'pageLength',
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ]
    });

    tblEnquiry.on('order.dt search.dt', function () {
        tblEnquiry.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblEnquiry.cell(cell).invalidate('dom');
        });
    }).draw();

    $("#EnquiryModels_CustomerId").change(function () {
        var cstid = $('#EnquiryModels_CustomerId').val();
        if (cstid !== "") {
            $.ajax({
                url: '/Admin/GetCustomerBillAdd',
                data: { cstid: cstid },
                type: "GET",
                dataType: "JSON",
                success: function (res) {
                    var relsn = res;
                    $('#EnquiryModels_CustomerBillAdd').empty();
                    if (relsn.length === 0) {
                        $("#EnquiryModels_CustomerBillAdd").attr("required", true);
                        $("#EnquiryModels_CustomerBillAdd").attr("disabled", true);
                    }
                    else if (relsn.length === 1) {
                        $("#EnquiryModels_CustomerBillAdd").attr("disabled", false);
                        var optionrel = '<option value="' + relsn[0].Id + '">' + relsn[0].Value + '</option>';
                        $('#EnquiryModels_CustomerBillAdd').append(optionrel);
                        $('#EnquiryModels_CustomerBillAdd').val(relsn[0].Id);
                    }
                    else if (relsn.length > 1) {
                        $('#EnquiryModels_CustomerBillAdd').val("");
                        $("#EnquiryModels_CustomerBillAdd").attr("disabled", false);
                        var optionrel = '<option value=""> --Customer Billing Address-- </option>';
                        $('#EnquiryModels_CustomerBillAdd').append(optionrel);
                        $("#EnquiryModels_CustomerBillAdd").attr("required", true);
                        for (var i = 0; i < relsn.length; i++) {
                            var optionrel = '<option value="' + relsn[i].Id + '">' + relsn[i].Value + '</option>';
                            $('#EnquiryModels_CustomerBillAdd').append(optionrel);
                        }
                    }
                },
                error: function () {
                    alert("Failed! Please try again.");
                }
            });

            $.ajax({
                url: '/Admin/GetCustomerShipAdd',
                data: { cstid: cstid },
                type: "GET",
                dataType: "JSON",
                success: function (res) {
                    var relsn = res;
                    $('#EnquiryModels_CustomerShipAdd').empty();
                    if (relsn.length === 0) {
                        $("#EnquiryModels_CustomerShipAdd").attr("required", true);
                        $("#EnquiryModels_CustomerShipAdd").attr("disabled", true);
                    }
                    else if (relsn.length === 1) {
                        $("#EnquiryModels_CustomerShipAdd").attr("disabled", false);
                        var optionrel = '<option value="' + relsn[0].Id + '">' + relsn[0].Value + '</option>';
                        $('#EnquiryModels_CustomerShipAdd').append(optionrel);
                        $('#EnquiryModels_CustomerShipAdd').val(relsn[0].Id);
                    }
                    else if (relsn.length > 1) {
                        $('#EnquiryModels_CustomerShipAdd').val("");
                        $("#EnquiryModels_CustomerShipAdd").attr("disabled", false);
                        var optionrel = '<option value=""> --Customer Shipping Address-- </option>';
                        $('#EnquiryModels_CustomerShipAdd').append(optionrel);
                        $("#EnquiryModels_CustomerShipAdd").attr("required", true);
                        for (var i = 0; i < relsn.length; i++) {
                            var optionrel = '<option value="' + relsn[i].Id + '">' + relsn[i].Value + '</option>';
                            $('#EnquiryModels_CustomerShipAdd').append(optionrel);
                        }
                    }
                },
                error: function () {
                    alert("Failed! Please try again.");
                }
            });
        }
        else {
            $('#EnquiryModels_CustomerBillAdd').empty();
            $("#EnquiryModels_CustomerBillAdd").attr("required", true);
            $("#EnquiryModels_CustomerBillAdd").attr("disabled", true);
            $('#EnquiryModels_CustomerShipAdd').empty();
            $("#EnquiryModels_CustomerShipAdd").attr("required", true);
            $("#EnquiryModels_CustomerShipAdd").attr("disabled", true);
        }
    });

    var tblassignenq = $('#tblassignenq').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                }
            },                      //Select
            { 'targets': 1, 'width': '20', 'orderable': false },       //SNo
            { 'targets': 2, 'width': '30', 'orderable': false },       //OrderDate
            { 'targets': 3, 'width': '80', 'orderable': false },       //CustomerName
            { 'targets': 4, 'width': '30', 'orderable': false },       //POId
            { 'targets': 5, 'width': '30', 'orderable': false },       //POPId
            { 'targets': 6, 'width': '200', 'orderable': false },       //Product
            { 'targets': 7, 'width': '20', 'orderable': false },       //Quantity
            { 'targets': 8, 'width': '20', 'orderable': false },       //Unit
            { 'targets': 9, 'width': '20', 'orderable': false },      //Price
            { 'targets': 10, 'width': '30', 'orderable': false },       //TotalPrice
            { 'targets': 11, 'width': '20', 'orderable': false },      //Status
            { 'targets': 12, 'width': '40', 'orderable': false },      //POCreatedBy
            { 'targets': 13, 'width': '40', 'orderable': false }       //POAssingTo
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            'pageLength',
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ]
    });
    tblassignenq.on('order.dt search.dt', function () {
        tblassignenq.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblassignenq.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblvensrc = $('#tblvensrc').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                }
            },                      //Select
            { 'targets': 1, 'width': '20', 'orderable': false },       //SNo
            { 'targets': 2, 'width': '30', 'orderable': false },       //OrderDate
            { 'targets': 3, 'width': '80', 'orderable': false },       //CustomerName
            { 'targets': 4, 'width': '30', 'orderable': false },       //POId
            { 'targets': 5, 'width': '30', 'orderable': false },       //POPId
            { 'targets': 6, 'width': '200', 'orderable': false },      //Product
            { 'targets': 7, 'width': '20', 'orderable': false },       //Quantity
            { 'targets': 8, 'width': '20', 'orderable': false },       //Unit
            { 'targets': 9, 'width': '20', 'orderable': false },      //Price
            { 'targets': 10, 'width': '30', 'orderable': false },      //TotalPrice
            { 'targets': 11, 'width': '20', 'orderable': false },      //Status
            { 'targets': 12, 'width': '40', 'orderable': false },      //POCreatedBy
            { 'targets': 13, 'width': '40', 'orderable': false }       //POAssingTo
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            'pageLength',
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ]
    });
    tblvensrc.on('order.dt search.dt', function () {
        tblvensrc.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblvensrc.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblsourced = $('#tblsourced').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                }
            },                      //Select
            { 'targets': 1, 'width': '20', 'orderable': false },       //SNo
            { 'targets': 2, 'width': '30', 'orderable': false },       //OrderDate
            { 'targets': 3, 'width': '80', 'orderable': false },       //CustomerName
            { 'targets': 4, 'width': '30', 'orderable': false },       //POId
            { 'targets': 5, 'width': '30', 'orderable': false },       //POPId
            { 'targets': 6, 'width': '200', 'orderable': false },      //Product
            { 'targets': 7, 'width': '20', 'orderable': false },       //Quantity
            { 'targets': 8, 'width': '20', 'orderable': false },       //Unit
            { 'targets': 9, 'width': '20', 'orderable': false },      //Price
            { 'targets': 10, 'width': '30', 'orderable': false },      //TotalPrice
            { 'targets': 11, 'width': '20', 'orderable': false },      //Status
            { 'targets': 12, 'width': '40', 'orderable': false },      //POCreatedBy
            { 'targets': 13, 'width': '40', 'orderable': false }       //POAssingTo
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            'pageLength',
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ],
    });
    tblsourced.on('order.dt search.dt', function () {
        tblsourced.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblsourced.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblenqregret = $('#tblenqregret').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '20', 'orderable': false },       //SNo
            { 'targets': 1, 'width': '30', 'orderable': false },       //OrderDate
            { 'targets': 2, 'width': '80', 'orderable': false },       //CustomerName
            { 'targets': 3, 'width': '30', 'orderable': false },       //POId
            { 'targets': 4, 'width': '30', 'orderable': false },       //POPId
            { 'targets': 5, 'width': '200', 'orderable': false },      //Product
            { 'targets': 6, 'width': '20', 'orderable': false },       //Quantity
            { 'targets': 7, 'width': '20', 'orderable': false },       //Unit
            { 'targets': 8, 'width': '20', 'orderable': false },      //Price
            { 'targets': 9, 'width': '30', 'orderable': false },      //TotalPrice
            { 'targets': 10, 'width': '20', 'orderable': false },      //Status
            { 'targets': 11, 'width': '40', 'orderable': false },      //POCreatedBy
            { 'targets': 12, 'width': '40', 'orderable': false },       //POAssingTo
            { 'targets': 13, 'width': '40', 'orderable': false },       //POAssingTo
            { 'targets': 14, 'width': '100', 'orderable': false }       //POAssingTo
        ],
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            'pageLength',
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ]
    });
    tblenqregret.on('order.dt search.dt', function () {
        tblenqregret.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblenqregret.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblenqhold = $('#tblenqhold').DataTable({
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            'pageLength',
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ]
    });
    tblenqhold.on('order.dt search.dt', function () {
        tblenqhold.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblenqhold.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblImportPO = $('#tblImportPO').DataTable({
        "paging": false,
        //"searching": false,
        "info": false,
    });
    tblImportPO.on('order.dt search.dt', function () {
        tblImportPO.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblImportPO.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblImportenq = $('#tblImportenq').DataTable({
        "paging": false,
        //"searching": false,
        "info": false,
    });
    tblImportenq.on('order.dt search.dt', function () {
        tblImportenq.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblImportenq.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblquoted = $('#tblquoted').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                }
            },                      //Select
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false,
        "dom": 'Bfrtip',
        "buttons": [
            'pageLength',
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel"></i> Excel',
                exportOptions: {
                    columns: ':visible'
                },
                footer: true
            },
            'colvis'
        ]
    });
    tblquoted.on('order.dt search.dt', function () {
        tblquoted.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblquoted.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblQuotation = $('#tblQuotation').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                }
            },                      //SNo
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false
    });
    tblQuotation.on('order.dt search.dt', function () {
        tblQuotation.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblQuotation.cell(cell).invalidate('dom');
        });
    }).draw();


    var tblQuotationApprove = $('#tblQuotationApprove').DataTable({
        "columnDefs": [
            {
                'targets': 0, 'checkboxes':
                {
                    'selectRow': true
                }
            },                      //SNo
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false
    });
    tblQuotationApprove.on('order.dt search.dt', function () {
        tblQuotationApprove.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblQuotationApprove.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblQuotationApproved = $('#tblQuotationApproved').DataTable({
        "scrollX": true,
        "paging": false,
        //"searching": false,
        "info": false
    });
    tblQuotationApproved.on('order.dt search.dt', function () {
        tblQuotationApproved.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblQuotationApproved.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblenqdetails = $('#tblenqdetails').DataTable({
        "columnDefs": [
        ],
        "paging": false,
        "searching": false,
        "info": false,
    });
    tblenqdetails.on('order.dt search.dt', function () {
        tblenqdetails.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblenqdetails.cell(cell).invalidate('dom');
        });
    }).draw();

    $('#addtempenqline').click(function () { AddTempEnqLine(); });
    $(".divvensource").hide();
    $('.vensourced').click(function () { AddTempVenSourced(); });
    $(".divsource").hide();
    $('.sourced').click(function () { AddTempSourced(); });
    $(".divquote").hide();
    $('.quoted').click(function () { AddTempQuoted(); });
    $(".divgen").hide();
    $('#quotation').click(function () { AddTempQuotation(); });

});

//Add PO item to temp table   
function AddTempPOLine() {
    var lnitm = parseInt($('.polneitm').val());
    //Create Movie Object  
    var tmppoline = {};
    tmppoline.CstMtrlCode = $('.cstmtrcd').val();
    tmppoline.SKUNo = $('.skuno option:selected').text();
    tmppoline.ProductId = $('.prdid').val();
    tmppoline.ModelNo = $('.modelno').val();
    tmppoline.PrdCtgryId = $('.prdctgid option:selected').text();
    tmppoline.BrandId = $('.brndid option:selected').text();
    tmppoline.HSNCode = $('.hsncode').val();
    tmppoline.SpcRemark = $('.spcrmk').val();
    tmppoline.Quantity = $('.qty').val();
    tmppoline.UnitId = $('.untid option:selected').text();
    tmppoline.Price = $('.price').val();
    tmppoline.GST = $('.gst').val();
    tmppoline.Discount = $('.discount').val();

    if (tmppoline.SKUNo === "--Select SKU No--") {
        tmppoline.SKUNo = "";
    }
    if (tmppoline.PrdCtgryId === "--Select Product Category--") {
        tmppoline.PrdCtgryId = "";
    }
    if (tmppoline.BrandId === "--Select Brand--") {
        tmppoline.BrandId = "";
    }
    if (tmppoline.UnitId === "--Select Unit--") {
        tmppoline.UnitId = "";
    }
    if (tmppoline.GST === "--Select GST %--") {
        tmppoline.GST = "";
    }

    var Errors = "";
    if (tmppoline.ProductId === "") {
        $('.errprdid').text("Product Name required");
        Errors = "Product Name required";
    }
    else {
        $('.errprdid').text("");
    }
    if (tmppoline.PrdCtgryId === "") {
        $('.errprdctgid').text("Product Category required");
        Errors = "Product Category required";
    } else {
        $('.errprdctgid').text("");
    }
    if (tmppoline.BrandId === "") {
        $('.errbrndid').text("Brand required");
        Errors = "Brand required";
    } else {
        $('.errbrndid').text("");
    }
    if (tmppoline.UnitId === "") {
        $('.erruntid').text("Unit required");
        Errors = "Unit required";
    } else {
        $('.erruntid').text("");
    }
    if (tmppoline.Quantity === "" || tmppoline.Quantity === "0") {
        $('.errqty').text("Quantity required");
        Errors = "Quantity required";
    } else {
        $('.errqty').text("");
    }
    if (tmppoline.Price === "" || tmppoline.Price === "0") {
        $('.errprice').text("Price required");
        Errors = "Price required";
    } else {
        $('.errprice').text("");
    }
    if (tmppoline.GST === "") {
        $('.errgst').text("GST required");
        Errors = "GST required";
    } else {
        $('.errgst').text("");
    }

    if (Errors.length === 0) {
        var row = parseInt($('#tblTempPOLine tbody tr').length);
        if (row < lnitm) {
            //Validate no duplicated Titles  
            var ExistTitle = false; // < -- Main indicator  
            $('#tblTempPOLine > tbody  > tr').each(function () {
                var Title = $(this).find('.pcstcode').text(); // get text of current row by class selector  
                if ($('.cstmtrcd').val() !== "") {
                    if (tmppoline.CstMtrlCode.toLowerCase() == Title.toLowerCase()) { //Compare provided and existing title  
                        ExistTitle = true;
                        return false;
                    }
                }
            });

            //Add movie if title is not duplicated otherwise show error  
            if (ExistTitle === false) {
                //Create Row element with provided data  
                var Row = $('<tr>');
                $('<td>').html(tmppoline.CstMtrlCode).addClass("pcstcode").appendTo(Row);
                $('<td>').html(tmppoline.SKUNo).addClass("pskuno").appendTo(Row);
                $('<td>').html(tmppoline.ProductId).addClass("pprdid").appendTo(Row);
                $('<td>').html(tmppoline.ModelNo).addClass("pmodelno").appendTo(Row);
                $('<td>').html(tmppoline.PrdCtgryId).addClass("ppctrid").appendTo(Row);
                $('<td>').html(tmppoline.BrandId).addClass("pbrndid").appendTo(Row);
                $('<td>').html(tmppoline.HSNCode).addClass("phsncode").appendTo(Row);
                $('<td>').html(tmppoline.UnitId).addClass("punitid").appendTo(Row);
                $('<td>').html(tmppoline.SpcRemark).addClass("pspcrmk").appendTo(Row);
                $('<td>').html(tmppoline.Quantity).addClass("pqty").appendTo(Row);
                $('<td>').html(tmppoline.Price).addClass("pprice").appendTo(Row);
                $('<td>').html(tmppoline.GST).addClass("pgst").appendTo(Row);
                $('<td>').html(tmppoline.Discount).addClass("pdiscount").appendTo(Row);
                $('<td>').html("<div class='text-center'><button class='btn btn-danger btn-sm' onclick='Delete($(this))'>Remove</button></div>").appendTo(Row);

                //Append row to table's body  
                $('#table-body').append(Row);
                ClearForm();
                CheckSubmitBtn(); // Enable submit button  
            }
        }
        else {
            alert("You can't add more than No of Line Items");
        }
    }
}

//Add PO sourced to temp table   
function AddTempPOSourced() {
    var rows_selected = $("#tblposourced tbody tr.selected");
    var list = new Array();
    var inc = 1;
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[6].innerText);
        var tmpposrc = {};
        tmpposrc.CustomerName = row.cells[3].innerText;
        tmpposrc.PONumber = row.cells[5].innerText;
        tmpposrc.POPId = row.cells[6].innerText;
        tmpposrc.Product = row.cells[7].innerText;
        tmpposrc.Quantity = row.cells[8].innerText;
        //tmpposrc.Price = row.cells[10].innerText;
        tmpposrc.Discount = row.cells[11].innerText;
        tmpposrc.GST = row.cells[13].innerText;

        tmpposrc.Price = parseFloat(row.cells[10].innerText) - parseFloat(row.cells[11].innerText)

        $('#tblposource').find('tbody').append(
            "<tr>" +
            "<td class='w-10'> <span class='scstname'>" + tmpposrc.CustomerName + "</span></td>" +
            /*"<td class='w-10'> <input type='text' id='PurchaseOrdersModelList_PONumber_" + inc + "' name='PurchaseOrdersModelList_PONumber_" + inc + "' data-toggle='tooltip' title='" + tmpposrc.PONumber + "' value='" + tmpposrc.PONumber + "' class='form-control spono m-b-0 bg-gray' disabled  type='text' /></td> " +*/
            "<td class='w-6'><span class='spono'>" + tmpposrc.PONumber + "</span></td> " +
            "<td class='w-8'> <input type='text' id='PurchaseOrdersModelList_POPId_" + inc + "' name='PurchaseOrdersModelList_POPId_" + inc + "' data-toggle='tooltip' title='" + tmpposrc.POPId + "' value='" + tmpposrc.POPId + "' disabled class='form-control spopid m-b-0'  type='text' /></td>" +
            "<td class='w-10 tdsprdid'>" + tmpposrc.Product + "</td>" +
            /*"<td class='w-15'><input type='text' id='PurchaseOrdersModelList_Product_" + inc + "' name='PurchaseOrdersModelList_Product_" + inc + "' data-toggle='tooltip' title='" + tmpposrc.Product + "' disabled value='" + tmpposrc.Product + "' class='form-control spopid m-b-0 bg-gray'  type='text' /></td>" +*/
            "<td class='w-6'> <input type='text' id='PurchaseOrdersModelList_Price_" + inc + "' name='PurchaseOrdersModelList_Price_" + inc + "' value='" + tmpposrc.Price + "' disabled class='form-control spoprice m-b-0 bg-gray'  type='text' /></td>" +
            "<td class='w-6'> <input type='text' id='PurchaseOrdersModelList_Quantity_" + inc + "' name='PurchaseOrdersModelList_Quantity_" + inc + "' value='" + tmpposrc.Quantity + "' disabled class='form-control spoqty m-b-0 bg-gray'  type='text' /></br><input type='text' id='PurchaseOrdersModelList_OrderedQuantity_" + inc + "' name='PurchaseOrdersModelList_OrderedQuantity_" + inc + "' value='" + tmpposrc.Quantity + "' placeholder='Ord Qty' class='form-control sordqty onlynumdec m-b-0 float-left' /></td>" +
            "<td class='w-4'> <input type='text' id='PurchaseOrdersModelList_GST_" + inc + "' name='PurchaseOrdersModelList_GST_" + inc + "' value='" + tmpposrc.GST + "' class='form-control spogst onlynumdec m-b-0'  type='text' /></td>" +
            "<td class='w-6'> <input type='text' id='EnquiriesModelList_ListPrice_" + inc + "' name='EnquiriesModelList_ListPrice_" + inc + "' value='' class='form-control lstprc m-b-0 onlynumdec bg-m-whitesmoke'  type='text' /></td>" +
            "<td class='w-8'> <input type='text' id='PurchaseOrdersModelList_EnqId_" + inc + "' name='PurchaseOrdersModelList_EnqId_" + inc + "' value='' class='form-control senqid m-b-0 bg-m-whitesmoke'  type='text' /></td>" +
            "<td class='w-12'> <input type='text' id='PurchaseOrdersModelList_VendorId1_" + inc + "' name='PurchaseOrdersModelList_VendorId1_" + inc + "' placeholder='Vendor 1' value='' class='form-control svenid1 svenid m-b-0' /></br><input type='text' id='PurchaseOrdersModelList_VendorPrice1_" + inc + "' name='PurchaseOrdersModelList_VendorPrice1_" + inc + "' value='' placeholder='V. Price 1' class='form-control svenprc1 svenprcmrg1 onlynumdec m-b-0 w-70 float-left'/><input type='text' id='PurchaseOrdersModelList_Margin1_" + inc + "' name='PurchaseOrdersModelList_Margin1_" + inc + "' value='' disabled placeholder='Margin' class='form-control onlynumdec posmarg1 m-b-0 w-30'/><input type='text' id='PurchaseOrdersModelList_VendorDiscount1_" + inc + "' name='PurchaseOrdersModelList_VendorDiscount1_" + inc + "' value='' disabled placeholder='Discount' class='form-control onlynumdec vdsc1 m-b-0' /><input type='checkbox' id='PurchaseOrdersModelList_VendorL1_" + inc + "' name='PurchaseOrdersModelList_VendorL1_" + inc + "' checked class='vl1 m-b-0 poschk' value=''/></td>" +
            "<td class='w-12'> <input type='text' id='PurchaseOrdersModelList_VendorId2_" + inc + "' name='PurchaseOrdersModelList_VendorId2_" + inc + "' placeholder='Vendor 2' value='' class='form-control svenid2 svenid m-b-0' /></br><input type='text' id='PurchaseOrdersModelList_VendorPrice2_" + inc + "' name='PurchaseOrdersModelList_VendorPrice2_" + inc + "' value='' placeholder='V. Price 2' class='form-control svenprc2 svenprcmrg2 onlynumdec m-b-0 w-70 float-left' /><input type='text' id='PurchaseOrdersModelList_Margin2_" + inc + "' name='PurchaseOrdersModelList_Margin2_" + inc + "' value='' disabled placeholder='Margin' class='form-control onlynumdec posmarg2 m-b-0 w-30' /><input type='text' id='PurchaseOrdersModelList_VendorDiscount2_" + inc + "' name='PurchaseOrdersModelList_VendorDiscount2_" + inc + "' value='' disabled placeholder='Discount' class='form-control onlynumdec vdsc2 m-b-0' /><input type='checkbox' id='PurchaseOrdersModelList_VendorL2_" + inc + "' name='PurchaseOrdersModelList_VendorL2_" + inc + "' class='vl2 m-b-0 poschk' value=''/></td>" +
            "<td class='w-12'> <input type='text' id='PurchaseOrdersModelList_VendorId3_" + inc + "' name='PurchaseOrdersModelList_VendorId3_" + inc + "' placeholder='Vendor 3' value='' class='form-control svenid3 svenid m-b-0' /></br><input type='text' id='PurchaseOrdersModelList_VendorPrice3_" + inc + "' name='PurchaseOrdersModelList_VendorPrice3_" + inc + "' value='' placeholder='V. Price 3' class='form-control svenprc3 svenprcmrg3 onlynumdec m-b-0 w-70 float-left' /><input type='text' id='PurchaseOrdersModelList_Margin3_" + inc + "' name='PurchaseOrdersModelList_Margin3_" + inc + "' value='' disabled placeholder='Margin' class='form-control onlynumdec posmarg3 m-b-0 w-30' /><input type='text' id='PurchaseOrdersModelList_VendorDiscount3_" + inc + "' name='PurchaseOrdersModelList_VendorDiscount3_" + inc + "' value='' disabled placeholder='Discount' class='form-control onlynumdec vdsc3 m-b-0' /><input type='checkbox' id='PurchaseOrdersModelList_VendorL3_" + inc + "' name='PurchaseOrdersModelList_VendorL3_" + inc + "' class='vl3 m-b-0 poschk' value=''/></td>" +
            //"<td class='w-15'> <input type='text' id='PurchaseOrdersModelList_VendorId_" + inc + "' name='PurchaseOrdersModelList_VendorId_" + inc + "' placeholder='Vendor Name' value='' class='form-control svenid m-b-0'  type='text' /></br><input type='text' id='PurchaseOrdersModelList_VendorPrice_" + inc + "' name='PurchaseOrdersModelList_VendorPrice_" + inc + "' value='' placeholder='Vendor Price' class='form-control svenprc svenprcmrg onlynumdec m-b-0 w-70 float-left' /><input type='text' id='PurchaseOrdersModelList_Margin_" + inc + "' name='PurchaseOrdersModelList_Margin_" + inc + "' value='' disabled placeholder='Margin' class='form-control onlynumdec posmarg m-b-0 w-30' /><input type='text' id='PurchaseOrdersModelList_VendorDiscount_" + inc + "' name='PurchaseOrdersModelList_VendorDiscount_" + inc + "' value='' disabled placeholder='Discount' class='form-control onlynumdec vdsc m-b-0' /></td>" +
            //"<td class='w-15'> <input type='text' id='PurchaseOrdersModelList_LastVendorId_" + inc + "' name='PurchaseOrdersModelList_LastVendorId_" + inc + "' disabled placeholder='Last Vendor Name' value='' class='form-control slvenid m-b-0 bg-gray' /></br><input type='text' id='PurchaseOrdersModelList_LastVendorPrice_" + inc + "' disabled name='PurchaseOrdersModelList_LastVendorPrice_" + inc + "' value='' placeholder='Last Vendor Price' class='form-control slvenprc m-b-0 bg-gray' /></td>" +
            "</tr>");
        inc++;
    });
    //Create Movie Object  
    $(".divsourced").hide();
    $(".divsource").show();
}

$(document).on('focus', '.svenid', function () {
    var id = this.id;
    $('#' + id).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/Admin/GetVendorList',
                type: "POST",
                dataType: "json",
                data: { Prefix: request.term },
                success: function (data) {
                    response($.map(data, function (item) {
                        return { label: item.Name, value: item.Name };
                    }));
                    //return response(data.d);
                }
            });
        },
    });
});

$('body').on('click', '.poschk', function () {
    var curRow = $(this).closest("tr");
    var curCol = $(this).closest("td");
    var venid = curCol.find(".svenid").val();
    if (venid !== "") {
        $.ajax({
            url: '/Admin/IsVendorExist',
            data: { venid: venid },
            type: "GET",
            dataType: "JSON",
            success: function (res) {
                var relsn = res;
                if (relsn.length !== 0) {
                    curRow.find(".poschk").prop("checked", false);
                    curCol.find(".poschk").prop("checked", true);
                }
                else {
                    alert("Vendor does not exist.");
                    $(this).prop("checked", false);
                }
            },
            error: function () {
                alert("Failed! Please try again.");
            }
        });
    }
    else {
        alert("Please enter vendor name.");
        $(this).prop("checked", false);
    }
});

$(document).on('blur', '.lstprc', function () {
    var curRow = $(this).closest("tr");
    var lstprc = curRow.find(".lstprc").val();
    if (lstprc !== "" && lstprc !== "0") {
        curRow.find(".vdsc1").attr("disabled", false);
        curRow.find(".vdsc1").val("");
        curRow.find(".svenprc1").attr("disabled", true);
        curRow.find(".svenprc1").val("");
        curRow.find(".posmarg1").attr("disabled", true);
        curRow.find(".posmarg1").val("");
        curRow.find(".vdsc2").attr("disabled", false);
        curRow.find(".vdsc2").val("");
        curRow.find(".svenprc2").attr("disabled", true);
        curRow.find(".svenprc2").val("");
        curRow.find(".posmarg2").attr("disabled", true);
        curRow.find(".posmarg2").val("");
        curRow.find(".vdsc3").attr("disabled", false);
        curRow.find(".vdsc3").val("");
        curRow.find(".svenprc3").attr("disabled", true);
        curRow.find(".svenprc3").val("");
        curRow.find(".posmarg3").attr("disabled", true);
        curRow.find(".posmarg3").val("");
    }
    else {
        curRow.find(".vdsc1").attr("disabled", true);
        curRow.find(".vdsc1").val("");
        curRow.find(".svenprc1").attr("disabled", false);
        curRow.find(".svenprc1").val("");
        curRow.find(".posmarg1").attr("disabled", false);
        curRow.find(".posmarg1").val("");

        curRow.find(".vdsc2").attr("disabled", true);
        curRow.find(".vdsc2").val("");
        curRow.find(".svenprc2").attr("disabled", false);
        curRow.find(".svenprc2").val("");
        curRow.find(".posmarg2").attr("disabled", false);
        curRow.find(".posmarg2").val("");

        curRow.find(".vdsc3").attr("disabled", true);
        curRow.find(".vdsc3").val("");
        curRow.find(".svenprc3").attr("disabled", false);
        curRow.find(".svenprc3").val("");
        curRow.find(".posmarg3").attr("disabled", false);
        curRow.find(".posmarg3").val("");
    }
});
//Enable Discount

//Get Vendor Price and Margin
$(document).on('blur', '.vdsc1', function () {
    var curRow = $(this).closest("tr");
    var lstprc = curRow.find(".lstprc").val();
    var vdsc = curRow.find(".vdsc1").val();
    var svenprc = curRow.find(".svenprc1").val();
    var slprc = curRow.find(".spoprice").val();

    if (lstprc !== "" && lstprc !== "0" && vdsc !== "" && vdsc !== "0") {
        var prc = (parseFloat(lstprc) * parseFloat(vdsc)) / 100;
        var venprc = lstprc - prc;
        curRow.find(".svenprc1").val(venprc.toFixed(2));

        var mrg = (parseFloat(slprc) - parseFloat(venprc)) * 100 / parseFloat(slprc);
        curRow.find(".posmarg1").val(mrg.toFixed(2) + "%");
        curRow.find(".svenid2").focus();
    }
    else {
        curRow.find(".squotprc1").val("");
        curRow.find(".posmarg1").val("");
    }
});
//Get Vendor Price and Margin

//Get Vendor Price and Margin
$(document).on('blur', '.vdsc2', function () {
    var curRow = $(this).closest("tr");
    var lstprc = curRow.find(".lstprc").val();
    var vdsc = curRow.find(".vdsc2").val();
    var svenprc = curRow.find(".svenprc2").val();
    var slprc = curRow.find(".spoprice").val();

    if (lstprc !== "" && lstprc !== "0" && vdsc !== "" && vdsc !== "0") {
        var prc = (parseFloat(lstprc) * parseFloat(vdsc)) / 100;
        var venprc = lstprc - prc;
        curRow.find(".svenprc2").val(venprc.toFixed(2));

        var mrg = (parseFloat(slprc) - parseFloat(venprc)) * 100 / parseFloat(slprc);
        curRow.find(".posmarg2").val(mrg.toFixed(2) + "%");
        curRow.find(".svenid3").focus();
    }
    else {
        curRow.find(".squotprc2").val("");
        curRow.find(".posmarg2").val("");
    }
});
//Get Vendor Price and Margin

//Get Vendor Price and Margin
$(document).on('blur', '.vdsc3', function () {
    var curRow = $(this).closest("tr");
    var lstprc = curRow.find(".lstprc").val();
    var vdsc = curRow.find(".vdsc3").val();
    var svenprc = curRow.find(".svenprc3").val();
    var slprc = curRow.find(".spoprice").val();

    if (lstprc !== "" && lstprc !== "0" && vdsc !== "" && vdsc !== "0") {
        var prc = (parseFloat(lstprc) * parseFloat(vdsc)) / 100;
        var venprc = lstprc - prc;
        curRow.find(".svenprc3").val(venprc.toFixed(2));

        var mrg = (parseFloat(slprc) - parseFloat(venprc)) * 100 / parseFloat(slprc);
        curRow.find(".posmarg3").val(mrg.toFixed(2) + "%");
        curRow.find(".spopid").focus();
    }
    else {
        curRow.find(".squotprc3").val("");
        curRow.find(".posmarg3").val("");
    }
});
//Get Vendor Price and Margin

//Get Margin
$(document).on('blur', '.svenprcmrg1', function () {
    var curRow = $(this).closest("tr");
    var venprc = curRow.find(".svenprcmrg1").val();
    var slprc = curRow.find(".spoprice").val();
    //e.preventDefault();
    if (venprc !== "" && venprc !== "0") {
        var mrg = (parseFloat(slprc) - parseFloat(venprc)) * 100 / parseFloat(slprc);
        curRow.find(".posmarg1").val(mrg.toFixed(2) + "%");
    }
    else {
        curRow.find(".posmarg1").val("");
    }
});
//Get Margin

//Get Margin
$(document).on('blur', '.svenprcmrg2', function () {
    var curRow = $(this).closest("tr");
    var venprc = curRow.find(".svenprcmrg2").val();
    var slprc = curRow.find(".spoprice").val();
    //e.preventDefault();
    if (venprc !== "" && venprc !== "0") {
        var mrg = (parseFloat(slprc) - parseFloat(venprc)) * 100 / parseFloat(slprc);
        curRow.find(".posmarg2").val(mrg.toFixed(2) + "%");
    }
    else {
        curRow.find(".posmarg2").val("");
    }
});
//Get Margin

//Get Margin
$(document).on('blur', '.svenprcmrg3', function () {
    var curRow = $(this).closest("tr");
    var venprc = curRow.find(".svenprcmrg3").val();
    var slprc = curRow.find(".spoprice").val();
    //e.preventDefault();
    if (venprc !== "" && venprc !== "0") {
        var mrg = (parseFloat(slprc) - parseFloat(venprc)) * 100 / parseFloat(slprc);
        curRow.find(".posmarg3").val(mrg.toFixed(2) + "%");
    }
    else {
        curRow.find(".posmarg3").val("");
    }
});
//Get Margin


$(document).on('blur', '.senqid', function () {
    var curRow = $(this).closest("tr");
    var enqid = curRow.find(".senqid").val();
    var cstName = curRow.find(".scstname").html();
    cstName = cstName.replaceAll("amp;", "");
    var lstprc = curRow.find(".lstprc").val();
    var slprc = curRow.find(".spoprice").val();
    //e.preventDefault();
    if (enqid !== "") {
        $.ajax({
            url: '/Admin/GetVendorPrice',
            data: "{'enqid':'" + enqid + "'}",
            type: "POST",
            dataType: "JSON",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if (res[0] === undefined || res[0] === "") {
                    curRow.find("td:eq(9)").find(".svenid1").val("");
                    curRow.find("td:eq(9)").find(".svenid1").prop("disabled", false);
                    curRow.find("td:eq(9)").find(".svenprc1").val("");
                    curRow.find("td:eq(9)").find(".svenprc1").prop("disabled", false);
                    curRow.find("td:eq(9)").find(".vdsc1").val("");
                    if (lstprc != "" && lstprc !== "0") {
                        curRow.find("td:eq(9)").find(".vdsc1").prop("disabled", false);
                    }
                    curRow.find("td:eq(10)").find(".svenid2").val("");
                    curRow.find("td:eq(10)").find(".svenprc2").val("");
                    curRow.find("td:eq(10)").find(".vdsc2").val("");
                    curRow.find("td:eq(11)").find(".svenid3").val("");
                    curRow.find("td:eq(11)").find(".svenprc3").val("");
                    curRow.find("td:eq(11)").find(".vdsc3").val("");
                    alert("Vendor is not registered with us Please register and then enter enquiry Id.");
                }
                else {
                    if (res[0].CustomerName === cstName) {
                        if (res[0].Vendor1Status == "1") {
                            curRow.find("td:eq(9)").find(".svenid1").css('background-color', '#ffffff');
                            curRow.find("td:eq(9)").find(".svenid1").val(res[0].Vendor1Name);
                            curRow.find("td:eq(9)").find(".svenid1").prop("disabled", true);
                            curRow.find("td:eq(9)").find(".svenprc1").val(res[0].Vendor1Price);
                            curRow.find("td:eq(9)").find(".svenprc1").prop("disabled", true);
                            curRow.find("td:eq(9)").find(".vdsc1").val(res[0].Vendor1Discount);
                            curRow.find("td:eq(9)").find(".vdsc1").prop("disabled", true);
                            var venprc1 = res[0].Vendor1Price;
                            if (venprc1 !== "" && venprc1 !== "0") {
                                var mrg1 = (parseFloat(slprc) - parseFloat(venprc1)) * 100 / parseFloat(slprc);
                                curRow.find(".posmarg1").val(mrg1.toFixed(2) + "%");
                            }
                        }
                        else {
                            curRow.find("td:eq(9)").find(".svenid1").css('background-color', '#ffa8a8;');
                            curRow.find("td:eq(9)").find(".svenid1").val(res[0].Vendor1Name);
                            curRow.find("td:eq(9)").find(".svenid1").prop("disabled", false);
                            curRow.find("td:eq(9)").find(".svenprc1").val(res[0].Vendor1Price);
                            curRow.find("td:eq(9)").find(".svenprc1").prop("disabled", false);
                            curRow.find("td:eq(9)").find(".vdsc1").val(res[0].Vendor1Discount);
                            curRow.find("td:eq(9)").find(".vdsc1").prop("disabled", false);
                            var venprc1 = res[0].Vendor1Price;
                            if (venprc1 !== "" && venprc1 !== "0") {
                                var mrg1 = (parseFloat(slprc) - parseFloat(venprc1)) * 100 / parseFloat(slprc);
                                curRow.find(".posmarg1").val(mrg1.toFixed(2) + "%");
                            }
                        }
                        if (res[0].Vendor2Status == "1") {
                            curRow.find("td:eq(10)").find(".svenid2").css('background-color', '#ffffff');
                            curRow.find("td:eq(10)").find(".svenid2").val(res[0].Vendor2Name);
                            curRow.find("td:eq(10)").find(".svenprc2").val(res[0].Vendor2Price);
                            curRow.find("td:eq(10)").find(".vdsc2").val(res[0].Vendor2Discount);
                            var venprc2 = res[0].Vendor2Price;
                            if (venprc2 !== "" && venprc2 !== "0") {
                                var mrg2 = (parseFloat(slprc) - parseFloat(venprc2)) * 100 / parseFloat(slprc);
                                curRow.find(".posmarg2").val(mrg2.toFixed(2) + "%");
                            }
                        }
                        else {
                            curRow.find("td:eq(10)").find(".svenid2").css('background-color', '#ffa8a8;');
                            curRow.find("td:eq(10)").find(".svenid2").val(res[0].Vendor2Name);
                            curRow.find("td:eq(10)").find(".svenprc2").val(res[0].Vendor2Price);
                            curRow.find("td:eq(10)").find(".vdsc2").val(res[0].Vendor2Discount);
                            var venprc2 = res[0].Vendor2Price;
                            if (venprc2 !== "" && venprc2 !== "0") {
                                var mrg2 = (parseFloat(slprc) - parseFloat(venprc2)) * 100 / parseFloat(slprc);
                                curRow.find(".posmarg2").val(mrg2.toFixed(2) + "%");
                            }
                        }
                        if (res[0].Vendor3Status == "1") {
                            curRow.find("td:eq(11)").find(".svenid3").css('background-color', '#ffffff');
                            curRow.find("td:eq(11)").find(".svenid3").val(res[0].Vendor3Name);
                            curRow.find("td:eq(11)").find(".svenprc3").val(res[0].Vendor3Price);
                            curRow.find("td:eq(11)").find(".vdsc3").val(res[0].Vendor3Discount);
                            var venprc3 = res[0].Vendor3Price;
                            if (venprc3 !== "" && venprc3 !== "0") {
                                var mrg3 = (parseFloat(slprc) - parseFloat(venprc3)) * 100 / parseFloat(slprc);
                                curRow.find(".posmarg3").val(mrg3.toFixed(2) + "%");
                            }
                        }
                        else {
                            curRow.find("td:eq(11)").find(".svenid3").css('background-color', '#ffa8a8;');
                            curRow.find("td:eq(11)").find(".svenid3").val(res[0].Vendor3Name);
                            curRow.find("td:eq(11)").find(".svenprc3").val(res[0].Vendor3Price);
                            curRow.find("td:eq(11)").find(".vdsc3").val(res[0].Vendor3Discount);
                            var venprc3 = res[0].Vendor3Price;
                            if (venprc3 !== "" && venprc3 !== "0") {
                                var mrg3 = (parseFloat(slprc) - parseFloat(venprc3)) * 100 / parseFloat(slprc);
                                curRow.find(".posmarg3").val(mrg3.toFixed(2) + "%");
                            }
                        }
                    }
                    else {
                        alert("This enquiry id is not quoted with this customer");
                        curRow.find("td:eq(8)").find(".senqid").val("");
                        curRow.find("td:eq(8)").find(".senqid").focus();

                        curRow.find("td:eq(9)").find(".svenid1").prop("disabled", false);
                        curRow.find("td:eq(9)").find(".svenprc1").prop("disabled", false);
                        curRow.find("td:eq(9)").find(".vdsc1").prop("disabled", false);
                    }
                }
            },
            error: function (e) {
                alert("Failed! Please try again. ");
            }
        });
    }
    else {
        curRow.find("td:eq(9)").find(".svenid1").val("");
        curRow.find("td:eq(9)").find(".svenid1").prop("disabled", false);
        curRow.find("td:eq(9)").find(".svenprc1").val("");
        curRow.find("td:eq(9)").find(".svenprc1").prop("disabled", false);
        curRow.find("td:eq(9)").find(".vdsc1").val("");
        if (lstprc != "" && lstprc !== "0") {
            curRow.find("td:eq(9)").find(".vdsc1").prop("disabled", false);
        }
        else {
            curRow.find("td:eq(9)").find(".vdsc1").prop("disabled", true);
        }
        curRow.find("td:eq(10)").find(".svenid2").val("");
        curRow.find("td:eq(10)").find(".svenprc2").val("");
        curRow.find("td:eq(10)").find(".vdsc2").val("");
        curRow.find("td:eq(11)").find(".svenid3").val("");
        curRow.find("td:eq(11)").find(".svenprc3").val("");
        curRow.find("td:eq(11)").find(".vdsc3").val("");
    }
});

$(document).on('blur', '.svenprc', function () {
    var curRow = $(this).closest("tr");
    var prc = curRow.find(".svenprc").val();
    //e.preventDefault();
    if (prc !== "" && prc !== "0") {
        var qty = curRow.find("td:eq(4)").find(".sqty").val();
        var unitprc = parseFloat(prc) / parseFloat(qty);
        curRow.find("td:eq(8)").find(".svunitprc").val(unitprc);
    }
    else {
        //curRow.find("td:eq(5)").find(".svenid").val("");
    }
});


$(document).on('blur', '.ircvqty', function () {
    var curRow = $(this).closest("tr");
    var vprc = curRow.find(".vprc").html();
    var qty = curRow.find(".qty").html();
    var remqty = curRow.find(".remqty").html();
    var rcvqty = curRow.find(".ircvqty").val();
    var gst = curRow.find(".gst").html();
    //e.preventDefault();
    remqty = parseFloat(remqty);
    rcvqty = parseFloat(rcvqty);
    if (rcvqty <= remqty) {
        if (rcvqty !== "" && rcvqty !== 0) {
            var untprc = parseFloat(vprc) / parseFloat(qty);
            var tot = parseFloat(untprc) * parseFloat(rcvqty);
            var totwtax = parseFloat(tot) + (parseFloat(tot) * parseFloat(gst) / 100);

            curRow.find(".tot").html(tot.toFixed(2));
            curRow.find(".totwtax").html(totwtax.toFixed(2));
        }
    }
    else {
        curRow.find(".ircvqty").val(remqty);
        curRow.find(".tot").html(0);
        curRow.find(".totwtax").html(0);
        alert("Receive Quantity is greater than remaining Quantity");
    }
});

$(document).on('blur', '.sordqty', function () {
    var curRow = $(this).closest("tr");
    var poqty = curRow.find(".spoqty").val();
    var ordqty = curRow.find(".sordqty").val();
    //e.preventDefault();
    poqty = parseFloat(poqty);
    ordqty = parseFloat(ordqty);
    if (ordqty <= poqty) {
        if (ordqty != 0) {

        }
        else {
            curRow.find(".sordqty").val(poqty);
            alert("Order Quantity can not be Zero");
        }
    }
    else {
        curRow.find(".sordqty").val(poqty);
        alert("Order Quantity is greater than Enquiry Quantity");
    }
});


//Add PO sourced to temp table   
function AddTempPOGenerate() {
    var rows_selected = $("#tblPOGenerate tbody tr.selected");
    var list = new Array();
    var inc = 1;
    var ccstId = "";
    var venid = "";
    var pIdNo = "";
    var cvenid = "";
    $("#tblpogen > tbody > tr").remove();
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        var index = $("#tblPOGenerate tbody tr.selected").index(this);
        if (index == 0) {
            ccstId = row.cells[3].innerText;
            pIdNo = row.cells[4].innerText;
            cvenid = row.cells[13].innerText;
        }
        var cstId = row.cells[3].innerText;
        var peid = row.cells[4].innerText;
        var veneid = row.cells[13].innerText;

        if (ccstId !== "" && cvenid != "" && pIdNo != "") {
            if (ccstId == cstId && cvenid == veneid) {
                list.push(row.cells[6].innerText);
                venid = row.cells[13].innerText;
                var tmpposrc = {};
                tmpposrc.CustomerName = row.cells[3].innerText;
                tmpposrc.PONumber = row.cells[5].innerText;
                tmpposrc.POPId = row.cells[6].innerText;
                tmpposrc.Product = row.cells[7].innerText;
                tmpposrc.Quantity = row.cells[8].innerText;
                tmpposrc.Unit = row.cells[9].innerText;
                tmpposrc.EnqId = row.cells[12].innerText;
                tmpposrc.VendorId = row.cells[13].innerText;
                tmpposrc.VendorPrice = row.cells[14].innerText;
                tmpposrc.VendorGST = row.cells[16].innerText;
                var amnt = parseFloat(tmpposrc.Quantity) * parseFloat(tmpposrc.VendorPrice);
                $('#tblpogen').find('tbody').append(
                    "<tr class='selected'>" +
                    "<td class='w-10'> <span class='scstname'>" + tmpposrc.CustomerName + "</span></td>" +
                    "<td class='w-8'> <input type='text' id='PurchaseOrdersModelList_PONumber_" + inc + "' name='PurchaseOrdersModelList_PONumber_" + inc + "' data-toggle='tooltip' title='" + tmpposrc.PONumber + "' value='" + tmpposrc.PONumber + "' class='form-control spono m-b-0' disabled  type='text' /></td> " +
                    "<td class='w-10'> <input type='text' id='PurchaseOrdersModelList_POPId_" + inc + "' name='PurchaseOrdersModelList_POPId_" + inc + "' data-toggle='tooltip' title='" + tmpposrc.POPId + "' value='" + tmpposrc.POPId + "' disabled class='form-control spopid m-b-0'  type='text' /></td>" +
                    "<td class='w-15 tdsprdid'>" + tmpposrc.Product + "</td>" +
                    "<td class='w-6'> <input type='text' id='PurchaseOrdersModelList_Quantity_" + inc + "' name='PurchaseOrdersModelList_Quantity_" + inc + "' value='" + tmpposrc.Quantity + "' disabled class='form-control sqty m-b-0'  type='text' /></td>" +
                    "<td class='w-8'> <input type='text' id='PurchaseOrdersModelList_Unit_" + inc + "' name='PurchaseOrdersModelList_Unit_" + inc + "' value='" + tmpposrc.Unit + "' disabled class='form-control sunit m-b-0'  type='text' /></td>" +
                    //"<td class='w-6'> <input type='text' id='PurchaseOrdersModelList_EnqId_" + inc + "' name='PurchaseOrdersModelList_EnqId_" + inc + "' value='" + tmpposrc.EnqId + "' disabled class='form-control senqid m-b-0'  type='text' /></td>" +
                    "<td class='w-15'> <input type='text' id='PurchaseOrdersModelList_VendorId_" + inc + "' name='PurchaseOrdersModelList_VendorId_" + inc + "' data-toggle='tooltip' title='" + tmpposrc.VendorId + "' placeholder='Vendor Name' value='" + tmpposrc.VendorId + "' disabled class='form-control svenid m-b-0'  type='text' />" +
                    "<td class='w-10'> <input type='text' id='PurchaseOrdersModelList_VendorPrice_" + inc + "' name='PurchaseOrdersModelList_VendorPrice_" + inc + "' value='" + amnt + "' placeholder='Vendor Price' class='form-control svenprc m-b-0' /></br><input type='text' id='PurchaseOrdersModelList_UnitPrice_" + inc + "' name='PurchaseOrdersModelList_UnitPrice_" + inc + "' value='" + tmpposrc.VendorPrice + "' placeholder='Vendor Price' disabled class='form-control svunitprc m-b-0' /></td>" +
                    "<td class='w-6'> <input type='text' id='PurchaseOrdersModelList_GST_" + inc + "' name='PurchaseOrdersModelList_GST_" + inc + "' value='" + tmpposrc.VendorGST + "' placeholder='GST' disabled class='form-control svengst m-b-0' /></td > " +
                    "<td class='w-15'> <input type='text' id='PurchaseOrdersModelList_LeadTime_" + inc + "' name='PurchaseOrdersModelList_LeadTime_" + inc + "' value='' placeholder='Lead' class='form-control indleadtime m-b-0' /></td > " +
                    "</tr>");
                inc++;
                //});
                if (venid !== "") {
                    $.ajax({
                        url: '/Admin/GetVendorByName',
                        data: { venid: venid },
                        type: "GET",
                        dataType: "JSON",
                        success: function (res) {
                            var relsn = res;
                            $('#POGenerateModels_VendorBillingAddress').empty();
                            if (relsn.length === 0) {
                                $("#POGenerateModels_VendorBillingAddress").attr("required", true);
                                $("#POGenerateModels_VendorBillingAddress").attr("disabled", true);
                            }
                            else if (relsn.length === 1) {
                                $("#POGenerateModels_VendorBillingAddress").attr("disabled", false);
                                var optionrel = '<option value="' + relsn[0].Id + '">' + relsn[0].Name + '</option>';
                                $('#POGenerateModels_VendorBillingAddress').append(optionrel);
                                $('#POGenerateModels_VendorBillingAddress').val(relsn[0].Id);
                            }
                            else if (relsn.length > 1) {
                                $('#POGenerateModels_VendorBillingAddress').val("");
                                $("#POGenerateModels_VendorBillingAddress").attr("disabled", false);
                                var optionrel = '<option value="">--Select Vendor Billing Address--</option>';
                                $('#POGenerateModels_VendorBillingAddress').append(optionrel);
                                $("#POGenerateModels_VendorBillingAddress").attr("required", true);
                                for (var i = 0; i < relsn.length; i++) {
                                    var optionrel = '<option value="' + relsn[i].Id + '">' + relsn[i].Name + '</option>';
                                    $('#POGenerateModels_VendorBillingAddress').append(optionrel);
                                }
                            }
                        },
                        error: function () {
                            alert("Failed! Please try again.");
                        }
                    });
                }

                if (venid !== "") {
                    $.ajax({
                        url: '/Admin/GetVendorPaymentTerms',
                        data: { venid: venid },
                        type: "GET",
                        dataType: "JSON",
                        success: function (res) {
                            var relsn = res;
                            $('.pterms').val();
                            if (relsn.length !== 0) {
                                $(".pterms").val(relsn[0].PTerms);
                            }
                        },
                        error: function () {
                            alert("Failed! Please try again.");
                        }
                    });
                }
                else {
                    $(".pterms").val("");
                }
                //Create Movie Object  
                $(".divsourced").hide();
                $(".divgen").show();
            }
        }
        else
            if (pIdNo != "" && cvenid != "") {
                if (pIdNo == peid && cvenid == veneid) {
                    //$.each(rows_selected, function (index, row) {
                    // Create a hidden element
                    list.push(row.cells[6].innerText);
                    venid = row.cells[12].innerText;
                    var tmpposrc = {};
                    tmpposrc.CustomerName = row.cells[3].innerText;
                    tmpposrc.PONumber = row.cells[5].innerText;
                    tmpposrc.POPId = row.cells[6].innerText;
                    tmpposrc.Product = row.cells[7].innerText;
                    tmpposrc.Quantity = row.cells[8].innerText;
                    tmpposrc.Unit = row.cells[9].innerText;
                    tmpposrc.EnqId = row.cells[11].innerText;
                    tmpposrc.VendorId = row.cells[12].innerText;
                    tmpposrc.VendorPrice = row.cells[13].innerText;
                    tmpposrc.VendorGST = row.cells[14].innerText;
                    var amnt = parseFloat(tmpposrc.Quantity) * parseFloat(tmpposrc.VendorPrice);
                    $('#tblpogen').find('tbody').append(
                        "<tr class='selected'>" +
                        "<td class='w-15'> <input type='text' id='PurchaseOrdersModelList_CustomerName_" + inc + "' name='PurchaseOrdersModelList_CustomerName_" + inc + "' value='" + tmpposrc.CustomerName + "' disabled required='True' class='form-control scstname m-b-0' type='text'></td>" +
                        "<td class='w-10'> <input type='text' id='PurchaseOrdersModelList_PONumber_" + inc + "' name='PurchaseOrdersModelList_PONumber_" + inc + "' value='" + tmpposrc.PONumber + "' class='form-control spono m-b-0' disabled  type='text' /></td> " +
                        "<td class='w-12'> <input type='text' id='PurchaseOrdersModelList_POPId_" + inc + "' name='PurchaseOrdersModelList_POPId_" + inc + "' value='" + tmpposrc.POPId + "' disabled class='form-control spopid m-b-0'  type='text' /></td>" +
                        "<td class='w-20'> <input type='text' id='PurchaseOrdersModelList_Product_" + inc + "' name='PurchaseOrdersModelList_Product_" + inc + "' value='" + tmpposrc.Product + "' disabled class='form-control spopid m-b-0'  type='text' /></td>" +
                        "<td class='w-8'>  <input type='text' id='PurchaseOrdersModelList_Quantity_" + inc + "' name='PurchaseOrdersModelList_Quantity_" + inc + "' value='" + tmpposrc.Quantity + "' disabled class='form-control sqty m-b-0'  type='text' /></td>" +
                        "<td class='w-10'> <input type='text' id='PurchaseOrdersModelList_Unit_" + inc + "' name='PurchaseOrdersModelList_Unit_" + inc + "' value='" + tmpposrc.Unit + "' disabled class='form-control sunit m-b-0'  type='text' /></td>" +
                        "<td class='w-10'> <input type='text' id='PurchaseOrdersModelList_EnqId_" + inc + "' name='PurchaseOrdersModelList_EnqId_" + inc + "' value='" + tmpposrc.EnqId + "' disabled class='form-control senqid m-b-0'  type='text' /></td>" +
                        "<td class='w-15'> <input type='text' id='PurchaseOrdersModelList_VendorId_" + inc + "' name='PurchaseOrdersModelList_VendorId_" + inc + "' placeholder='Vendor Name' value='" + tmpposrc.VendorId + "' disabled class='form-control svenid m-b-0'  type='text' />" +
                        "<td class='w-15'> <input type='text' id='PurchaseOrdersModelList_VendorPrice_" + inc + "' name='PurchaseOrdersModelList_VendorPrice_" + inc + "' value='" + amnt + "' placeholder='Vendor Price' class='form-control svenprc m-b-0' /></br><input type='text' id='PurchaseOrdersModelList_UnitPrice_" + inc + "' name='PurchaseOrdersModelList_UnitPrice_" + inc + "' value='" + tmpposrc.VendorPrice + "' placeholder='Vendor Price' disabled class='form-control svunitprc m-b-0' /></td>" +
                        "<td class='w-10'> <input type='text' id='PurchaseOrdersModelList_GST_" + inc + "' name='PurchaseOrdersModelList_GST_" + inc + "' value='" + tmpposrc.VendorGST + "' placeholder='GST' disabled class='form-control svengst m-b-0' /></td > " +
                        "</tr>");
                    inc++;
                    //});
                    if (venid !== "") {
                        $.ajax({
                            url: '/Admin/GetVendorByName',
                            data: { venid: venid },
                            type: "GET",
                            dataType: "JSON",
                            success: function (res) {
                                var relsn = res;
                                $('#POGenerateModels_VendorBillingAddress').empty();
                                if (relsn.length === 0) {
                                    $("#POGenerateModels_VendorBillingAddress").attr("required", true);
                                    $("#POGenerateModels_VendorBillingAddress").attr("disabled", true);
                                }
                                else if (relsn.length === 1) {
                                    $("#POGenerateModels_VendorBillingAddress").attr("disabled", false);
                                    var optionrel = '<option value="' + relsn[0].Id + '">' + relsn[0].Name + '</option>';
                                    $('#POGenerateModels_VendorBillingAddress').append(optionrel);
                                    $('#POGenerateModels_VendorBillingAddress').val(relsn[0].Id);
                                }
                                else if (relsn.length > 1) {
                                    $('#POGenerateModels_VendorBillingAddress').val("");
                                    $("#POGenerateModels_VendorBillingAddress").attr("disabled", false);
                                    var optionrel = '<option value="">--Select Vendor Billing Address--</option>';
                                    $('#POGenerateModels_VendorBillingAddress').append(optionrel);
                                    $("#POGenerateModels_VendorBillingAddress").attr("required", true);
                                    for (var i = 0; i < relsn.length; i++) {
                                        var optionrel = '<option value="' + relsn[i].Id + '">' + relsn[i].Name + '</option>';
                                        $('#POGenerateModels_VendorBillingAddress').append(optionrel);
                                    }
                                }
                            },
                            error: function () {
                                alert("Failed! Please try again.");
                            }
                        });
                    }

                    if (venid !== "") {
                        $.ajax({
                            url: '/Admin/GetVendorPaymentTerms',
                            data: { venid: venid },
                            type: "GET",
                            dataType: "JSON",
                            success: function (res) {
                                var relsn = res;
                                $('.pterms').val();
                                if (relsn.length !== 0) {
                                    $(".pterms").val(relsn[0].PTerms);
                                }
                            },
                            error: function () {
                                alert("Failed! Please try again.");
                            }
                        });
                    }
                    else {
                        $(".pterms").val("");
                    }
                    //Create Movie Object  
                    $(".divsourced").hide();
                    $(".divgen").show();
                }
            }
        pIdNo = row.cells[4].innerText;
    });
    // Iterate over all selected checkboxes

}


// clear all textboxes inside form  
function ClearForm() {
    $('.cstmtrcd').val("");
    $(".skuno").val("").trigger('change.select2');
    $('.prdid').val("");
    $('.modelno').val("");
    //$('.prdctgid').val("").trigger('change.select2');
    //$('.brndid').val("").trigger('change.select2');
    $('.hsncode').val("");
    $('.spcrmk').val("");
    $('.qty').val("");
    //$('.untid').val("").trigger('change.select2');
    $('.price').val("");
    $('.gst').val("18").trigger('change.select2');
    $('.discount').val("");
}


//Delete selected row  
function Delete(row) { // remove row from table  
    row.closest('tr').remove();
    CheckSubmitBtn();
}

//Enable or disabled submit button  
function CheckSubmitBtn() {
    if ($('#tblTempPOLine > tbody  > tr').length > 0) { // count items in table if at least 1 item is found then enable button  
        //$('#SubmitMoviesBtn').removeAttr("disabled");
        $('.posubmit').show();
    } else {
        //$('#SubmitMoviesBtn').attr("disabled", "disabled");
        $('.posubmit').hide();
    }

    if ($('#tblTempEnqLine > tbody  > tr').length > 0) { // count items in table if at least 1 item is found then enable button
        //$('#SubmitMoviesBtn').removeAttr("disabled");
        $('.enqsubmit').show();
    } else {
        //$('#SubmitMoviesBtn').attr("disabled", "disabled");
        $('.enqsubmit').hide();
    }
}
//Add PO item to temp table  

$(".pogen").hide();
$('#pocalculate').on('click', function (e) {
    e.preventDefault();
    var vba = $('.vba option:selected').text();
    var bba = $('.bba option:selected').text();
    if (vba != "" && vba != '--Select Vendor Billing Address--' && bba != "" && bba != '--Select Buyer Billing Address--') {
        var vsts = vba.split('-').pop();
        var bsts = bba.split('-').pop();

        var pnfamnt = $('.pnfamnt').val();
        var frghtamnt = $('.frghtamnt').val();
        var fpnfgst = $('.fpnfgst').val();

        var pnfamnta = 0;
        var frghtamnta = 0;

        var tamountbeforetax = 0, totl_cgst = 0, totl_sgst = 0, totl_igst = 0, totalTax = 0, netAmount = 0;
        var gstPercentage = 0, cgstPercentage = 0, sgstPercentage = 0, igstPercentage = 0, cgstAmt = 0, igstAmt = 0, sgstAmt = 0;
        // Iterate over all selected checkboxes
        var i = 0;
        $("#tblpogen tbody tr").each(function () {
            var tds = $(this).find("td");
            if (i == 0) {
                pnfamnt = parseFloat(pnfamnt);
                frghtamnt = parseFloat(frghtamnt);

                pnfamnta = parseFloat(pnfamnt);
                frghtamnta = parseFloat(frghtamnt);
            }
            else {
                pnfamnt = 0;
                frghtamnt = 0;
            }
            var amountBeforeTax = parseFloat($(tds[7]).find('.svenprc').val());
            tamountbeforetax += parseFloat(amountBeforeTax);
            var gstPercentage = parseFloat($(tds[8]).find('.svengst').val());
            if (vsts.toLowerCase() == bsts.toLowerCase()) {
                cgstPercentage = gstPercentage / 2;
                sgstPercentage = gstPercentage / 2;
                cgstAmt = (amountBeforeTax + pnfamnt + frghtamnt) * cgstPercentage / 100;
                sgstAmt = (amountBeforeTax + pnfamnt + frghtamnt) * sgstPercentage / 100;
            }
            else {
                igstPercentage = gstPercentage;
                igstAmt = (amountBeforeTax + pnfamnt + frghtamnt) * igstPercentage / 100;
            }
            totl_cgst += cgstAmt;
            totl_sgst += sgstAmt;
            totl_igst += igstAmt;
            i++;
        });

        $(".totamnt").val(ReplaceNumberWithCommas(tamountbeforetax.toFixed(2)));
        $(".cgstamnt").val(ReplaceNumberWithCommas(totl_cgst.toFixed(2)));
        $(".sgstamnt").val(ReplaceNumberWithCommas(totl_sgst.toFixed(2)));
        $(".igstamnt").val(ReplaceNumberWithCommas(totl_igst.toFixed(2)));

        $(".totamntgst").val(ReplaceNumberWithCommas((totl_cgst + totl_igst + totl_sgst).toFixed(2)));

        $(".netamnt").val(ReplaceNumberWithCommas((tamountbeforetax + totl_cgst + totl_igst + totl_sgst + pnfamnta + frghtamnta).toFixed(2)));
        $(".pogen").show();
    }
});

function ReplaceNumberWithCommas(yourNumber) {
    //Seperates the components of the number
    var components = yourNumber.toString().split(".");
    //Comma-fies the first part
    components[0] = components[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //Combines the two sections
    return components.join(".");
}

$('#ApproveSel').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $("#ApproveSel").attr("disabled", true);
    e.preventDefault();
    var rows_selected = $("#tblProductApprove tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[2].innerText);
    });

    if (list.length > 0) {
        var prdIds = JSON.stringify(list);
        $.ajax({
            url: "/Admin/AppSelProducts",
            dataType: "json",
            data: "{'prdIds': '" + prdIds + "'}",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    location.reload();
                }
                else {
                    alert(result.error);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please select atleast one product.");
    }
});

$('.poassign').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".poassign").attr("disabled", true);
    $(".poassign").hide();
    e.preventDefault();
    var asn = $(".poasnto").val();
    var rows_selected = $("#tblassignpo tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[6].innerText);
    });

    if (list.length > 0) {
        var poIds = JSON.stringify(list);
        $.ajax({
            url: "/Admin/AssignPurchaseOrder",
            dataType: "json",
            data: "{'poIds': '" + poIds + "', 'asn': '" + asn + "'}",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    location.reload();
                }
                else {
                    alert(result.error);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please select atleast one po.");
    }
});

$('.posubmit').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".posubmit").attr("disabled", true);
    $(".posubmit").hide();
    e.preventDefault();
    var lnitm = parseInt($('.polneitm').val());
    var row = parseInt($('#tblTempPOLine tbody tr').length);
    if (row === lnitm) {
        var fUpload = $("#PurOrdModels_POFile").get(0);
        var files = fUpload.files;

        var linkObj = $(this);
        var hdArr = new Array();
        var lnArr = new Array();
        var cstId = $('.cstid').val();
        var cstbadd = $('.cstbadd').val();
        var cstsadd = $('.cstsadd').val();
        var potype = $('.potype').val();
        var poid = $('.poid').val();
        var pono = $('.pono').val();
        var poorddate = $('.poorddate').val();
        var poedlvdate = $('.poedlvdate').val();
        var polneitm = $('.polneitm').val();
        var posentby = $('.posentby').val();

        if (cstId !== "" && cstbadd !== "" && cstsadd !== "" && poid !== "" && potype !== "" && polneitm !== "0" && polneitm !== "" && posentby !== "" && files.length > 0) {
            // Create FormData object  
            var fileData = new FormData();
            fileData.append(files[0].name, files[0]);
            fileData.append('POId', poid);
            $(".tbl tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var pcstcode = $(tds[0]).text();
                var pskuno = $(tds[1]).text();
                var pprdid = $(tds[2]).text();
                var pmodelno = $(tds[3]).text();
                var ppctrid = $(tds[4]).text();
                var pbrndid = $(tds[5]).text();
                var phsncode = $(tds[6]).text();
                var punitid = $(tds[7]).text();
                var pspcrmk = $(tds[8]).text();
                var pqty = $(tds[9]).text();
                var pprice = $(tds[10]).text();
                var pgst = $(tds[11]).text();
                var pdiscount = $(tds[12]).text();
                if (pdiscount == "") {
                    pdiscount = 0;
                }
                if (pprdid !== "" && ppctrid !== "" && pbrndid !== "" && punitid !== "" && pqty !== "0" && pqty !== "" && pprice !== "0" && pprice !== "" && pgst !== "") {
                    var lin = {
                        CustomerId: cstId,
                        CustomerBillAdd: cstbadd,
                        CustomerShipAdd: cstsadd,
                        POType: potype,
                        POId: poid,
                        OrderDate: poorddate,
                        ExpDlvDate: poedlvdate,
                        PONumber: pono,
                        LineItems: polneitm,
                        POSentBy: posentby,
                        CstMtrlCode: pcstcode,
                        SKUNo: pskuno,
                        ProductId: pprdid,
                        ModelNo: pmodelno,
                        PrdCtgryId: ppctrid,
                        BrandId: pbrndid,
                        HSNCode: phsncode,
                        SpcRemark: pspcrmk,
                        Quantity: parseFloat(pqty),
                        UnitId: punitid,
                        Price: parseFloat(pprice),
                        GST: pgst,
                        Discount: parseFloat(pdiscount)
                    };
                    lnArr.push(lin);
                }
            });

            if (lnArr.length > 0) {
                var po = JSON.stringify(lnArr);

                $.ajax({
                    url: "/Admin/InsertPurchaseOrder",
                    dataType: "json",
                    data: "{'po': '" + po + "'}",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        if (result.error === "") {
                            $.ajax({
                                url: "/Admin/UpdatePurchaseOrder",
                                type: "POST",
                                contentType: false,
                                processData: false, // Not to process data  
                                data: fileData,
                                success: function (result) {
                                    if (result.error === "") {
                                        location.reload();
                                    }
                                    else {
                                        alert(result.error);
                                    }
                                },
                                error: function (xhr, status, error) {
                                    var err = eval("(" + xhr.responseText + ")");
                                    alert(err.Message);
                                }
                            });
                        }
                        else {
                            alert(result.error);
                        }
                    },
                    error: function (xhr, status, error) {
                        var err = eval("(" + xhr.responseText + ")");
                        alert(err.Message);
                    }
                });
            }
            else {
                alert("Please add atleast 1 line item.");
            }
        }
        else {
            alert("Please fill the required fields.");
        }
    }
    else {
        alert("Line item not matched.");
    }
    $(".posubmit").attr("disabled", false);
});

$('.posousubmit').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".posousubmit").attr("disabled", true);
    $(".posousubmit").hide();
    e.preventDefault();
    var lnArr = new Array();
    var err = "";
    $(".tbl tbody tr").each(function () {
        var tds = $(this).find("td");
        //you could use the Find method to find the texbox or the dropdownlist and get the value.
        var spopid = $(tds[2]).find('.spopid').val();
        var sordqty = $(tds[5]).find('.sordqty').val();
        var spogst = $(tds[6]).find('.spogst').val();
        var lstprc = $(tds[7]).find('.lstprc').val();
        var senqid = $(tds[8]).find('.senqid').val();
        var svenid1 = $(tds[9]).find('.svenid1').val();
        var svenprc1 = $(tds[9]).find('.svenprc1').val();
        var vdsc1 = $(tds[9]).find('.vdsc1').val();
        var svenid2 = $(tds[10]).find('.svenid2').val();
        var svenprc2 = $(tds[10]).find('.svenprc2').val();
        var vdsc2 = $(tds[10]).find('.vdsc2').val();
        var svenid3 = $(tds[11]).find('.svenid3').val();
        var svenprc3 = $(tds[11]).find('.svenprc3').val();
        var vdsc3 = $(tds[11]).find('.vdsc3').val();


        var chek1 = $(tds[9]).find(".chk").is(":checked");
        var chek2 = $(tds[10]).find(".chk").is(":checked");
        var chek3 = $(tds[11]).find(".chk").is(":checked");


        if (svenid1 == "") {
            err = "error";
        }

        if (svenprc1 == "") {
            svenprc1 = 0;
            err = "error";
        }
        if (svenprc2 == "") {
            svenprc2 = 0;
        }
        if (svenprc3 == "") {
            svenprc3 = 0;
        }

        if (sordqty == "" || sordqty == "0") {
            err = "error";
        }

        if (lstprc === "") {
            lstprc = 0;
        }

        if (vdsc1 === "") {
            vdsc1 = 0;
        }
        if (vdsc2 === "") {
            vdsc2 = 0;
        }
        if (vdsc3 === "") {
            vdsc3 = 0;
        }
        var ven = "";
        var vprc = "";
        var vdsc = "";
        if (chek3 == true) {
            ven = svenid3;
            vprc = svenprc3;
            vdsc = vdsc3;
        } else if (chek2 == true) {
            ven = svenid2;
            vprc = svenprc2;
            vdsc = vdsc2;
        }
        else {
            ven = svenid1;
            vprc = svenprc1;
            vdsc = vdsc1;
        }

        if (spopid !== "" /*&& senqid !== ""*/ && spogst != "" && svenid1 !== "" && svenprc1 !== "" && svenprc1 !== "0" &&
            sordqty !== "" && sordqty !== "0" && ven !== "" && vprc !== "0") {
            var lin = {
                POPId: spopid,
                EnqId: senqid,
                OrderedQuantity: parseFloat(sordqty),
                ListPrice: parseFloat(lstprc),
                GST: parseFloat(spogst),
                VendorId: ven,
                VendorPrice: parseFloat(vprc),
                VendorDiscount: parseFloat(vdsc),
                VendorId1: svenid1,
                VendorPrice1: parseFloat(svenprc1),
                VendorDiscount1: parseFloat(vdsc1),
                VendorId2: svenid2,
                VendorPrice2: parseFloat(svenprc2),
                VendorDiscount2: parseFloat(vdsc2),
                VendorId3: svenid3,
                VendorPrice3: parseFloat(svenprc3),
                VendorDiscount3: parseFloat(vdsc3)
            };
            lnArr.push(lin);
        }
    });

    if (lnArr.length > 0 && err == "") {
        var pos = JSON.stringify(lnArr);

        $.ajax({
            url: "/Admin/UpdatePurchaseOrderSourced",
            dataType: "json",
            data: "{'pos': '" + pos + "'}",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    var url = $("#RedirectTo").val();
                    location.href = url;
                }
                else {
                    alert(result.error);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please fill all mandatory field.");
        $(".posousubmit").attr("disabled", false);
        $(".posousubmit").show();
    }
    $(".posousubmit").attr("disabled", false);
    $(".posousubmit").show();
});

$('#chksameadd').change(function () {
    if ($(this).is(":checked")) {
        $("#POGenerateModels_IsShippingAddressSame").val("1");
        $(".shpname").val('');
        $(".shpadd").val('');
        $(".shpcty").val('');
        $(".shpsts").val('');
        $(".shppin").val('');
        $(".shpcnt").val('');
        $(".shpgst").val('');
        $(".shppan").val('');
        $(".shpname").prop('readonly', true);
        $(".shpadd").prop('readonly', true);
        $(".shpcty").prop('readonly', true);
        $(".shpsts").prop('readonly', true);
        $(".shppin").prop('readonly', true);
        $(".shpcntct").prop('readonly', true);
        $(".shpgst").prop('readonly', true);
        $(".shppan").prop('readonly', true);
    } else {
        $("#POGenerateModels_IsShippingAddressSame").val("0");
        $(".shpname").val('');
        $(".shpadd").val('');
        $(".shpcty").val('');
        $(".shpsts").val('');
        $(".shppin").val('');
        $(".shpcnt").val('');
        $(".shpgst").val('');
        $(".shppan").val('');
        $(".shpname").prop('readonly', false);
        $(".shpadd").prop('readonly', false);
        $(".shpcty").prop('readonly', false);
        $(".shpsts").prop('readonly', false);
        $(".shppin").prop('readonly', false);
        $(".shpcntct").prop('readonly', false);
        $(".shpgst").prop('readonly', false);
        $(".shppan").prop('readonly', false);
    }
});

$('.pogen').on('click', function (e) {
    $('.pogen').hide();
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".pogen").attr("disabled", true);
    e.preventDefault();
    var linkObj = $(this);
    var hdArr = new Array();
    var lnArr = new Array();
    var ptype = $('.ptype').val();
    var vbid = $('.vba').val();
    var bbid = $('.bba').val();
    var issame = $('#POGenerateModels_IsShippingAddressSame').val();
    var shpname = $('.shpname').val();
    var shpadd = $('.shpadd').val();
    var shpcty = $('.shpcty').val();
    var shpsts = $('.shpsts').val();
    var shppin = $('.shppin').val();
    var shpcntct = $('.shpcntct').val();
    var shpgst = $('.shpgst').val();
    var shppan = $('.shppan').val();

    var pnfamnt = $('.pnfamnt').val().replace(/,/g, "");
    var frghtamnt = $('.frghtamnt').val().replace(/,/g, "");
    var totamnt = $('.totamnt').val().replace(/,/g, "");
    var cgstamnt = $('.cgstamnt').val().replace(/,/g, "");
    var sgstamnt = $('.sgstamnt').val().replace(/,/g, "");
    var igstamnt = $('.igstamnt').val().replace(/,/g, "");
    var totamntgst = $('.totamntgst').val().replace(/,/g, "");
    var netamnt = $('.netamnt').val().replace(/,/g, "");

    var tcond = $('.tcond').val();
    var ldtime = $('.ldtime').val();
    var instk = $('.instk').val();
    var pfchrg = $('.pfchrg').val();
    var pterms = $('.pterms').val();
    var frtrms = $('.frtrms').val();
    var motrns = $('.motrns').val();
    var wrnty = $('.wrnty').val();
    var valofpo = $('.valofpo').val();
    var misc = $('.misc').val();
    var remark = $('.remark').val();
    var lmremark = $('.lmremark').val();

    if (vbid !== "" && bbid !== "") {
        $(".tbl tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var spopid = $(tds[2]).find('.spopid').val();
            var svenprc = $(tds[7]).find('.svenprc').val();
            var indleadtime = $(tds[9]).find('.indleadtime').val();

            if (spopid !== "" && svenprc !== "" && svenprc !== "0") {
                var lin = {
                    POPId: spopid,
                    VendorPrice: svenprc,
                    POType: ptype,
                    IndLeadTime: indleadtime,
                    VendorBillingAddress: vbid,
                    BuyerBillingAddress: bbid,
                    IsShippingAddressSame: issame,
                    BuyerShippingName: shpname,
                    BuyerShippingAddress: shpadd,
                    BuyerShippingCity: shpcty,
                    BuyerShippingState: shpsts,
                    BuyerShippingPincode: shppin,
                    BuyerShippingContact: shpcntct,
                    BuyerShippingGST: shpgst,
                    BuyerShippingPAN: shppan,
                    PNFAmount: parseFloat(pnfamnt),
                    FreightAmount: parseFloat(frghtamnt),
                    TotalAmount: parseFloat(totamnt),
                    CGSTAmount: parseFloat(cgstamnt),
                    SGSTAmount: parseFloat(sgstamnt),
                    IGSTAmount: parseFloat(igstamnt),
                    TotalAmountGST: parseFloat(totamntgst),
                    NetAmount: parseFloat(netamnt),
                    TACondition: tcond,
                    LeadTime: ldtime,
                    InStock: instk,
                    PackFwdCharges: pfchrg,
                    PaymentTerms: pterms,
                    FrieghtTerms: frtrms,
                    ModeOfTransport: motrns,
                    Warranty: wrnty,
                    ValidityOfPO: valofpo,
                    Misc: misc,
                    Remarks: remark,
                    LMRemarks: lmremark,
                };
                lnArr.push(lin);
            }
        });

        if (lnArr.length > 0) {
            var po = JSON.stringify(lnArr);

            $.ajax({
                url: "/Admin/UpdatePOGenerate",
                dataType: "json",
                data: "{'po': '" + po + "' }",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.error === "") {
                        location.reload();
                    }
                    else {
                        alert(result.error);
                    }
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        }
        else {
            alert("Please add atleast 1 line item.");
            $(".pogen").attr("disabled", false);
            $(".pogen").show();
        }
    }
    else {
        alert("Please fill the required fields.");
        $(".pogen").attr("disabled", false);
        $(".pogen").show();
    }
    $(".pogen").attr("disabled", false);
    $(".pogen").show();
});

$('.poapprove').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".poapprove").attr("disabled", true);
    $(".poapprove").hide();
    e.preventDefault();
    var rows_selected = $("#tblPOApprove tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        var lin = {
            POId: row.cells[6].innerText,
            VendorPrice: row.cells[9].innerText,
            Margin: row.cells[11].innerText
        };
        list.push(lin);
    });

    if (list.length > 0) {
        var poIds = JSON.stringify(list);
        $.ajax({
            url: "/Admin/ApprovePO",
            dataType: "json",
            data: "{'poIds': '" + poIds + "'}",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    location.reload();
                }
                else {
                    alert(result.error);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please select atleast one po.");
    }
});


$('.ponotapprove').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".ponotapprove").attr("disabled", true);
    $(".ponotapprove").hide();
    e.preventDefault();
    var rows_selected = $("#tblPOApprove tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[7].innerText);
    });
    var napprmk = $(".napprmk").val();
    if (list.length > 0) {
        if (napprmk != "") {
            var vpoNos = JSON.stringify(list);
            $.ajax({
                url: "/Admin/PONotApprovedList",
                dataType: "json",
                data: "{'vpoNos': '" + vpoNos + "','napprmk': '" + napprmk + "'}",
                //data: "{'vpoNos': '" + vpoNos + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.error === "") {
                        location.reload();
                    }
                    else {
                        alert(result.error);
                    }
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        } else {
            alert("Please enter remarks");
            $(this).find(':submit').attr('disabled', 'disabled');
            $(".ponotapprove").attr("disabled", true);
            $(".ponotapprove").show();
        }
    }
    else {
        alert("Please select atleast one po.");
    }
});


$('.prapprove').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".prapprove").attr("disabled", true);
    $(".prapprove").hide();
    e.preventDefault();
    var rows_selected = $("#tblPRApproval tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[2].innerText);
    });

    if (list.length > 0) {
        var vpoIds = JSON.stringify(list);
        $.ajax({
            url: "/Admin/ApprovePaymentRequest",
            dataType: "json",
            data: "{'vpoIds': '" + vpoIds + "'}",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    location.reload();
                }
                else {
                    alert(result.error);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please select atleast one po.");
    }
});

$('#mrsubmit').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $("#mrsubmit").attr("disabled", true);

    e.preventDefault();
    var fUpload = $("#InvStockModels_VendorInvoice").get(0);
    var files = fUpload.files;
    var fileData = new FormData();
    var list = new Array();
    var warehouse = $("#InvStockModels_Warehouse").val();
    var dlvexc = $("#InvStockModels_DelvExecutive").val();
    // Iterate over all selected checkboxes
    $(".tbl tbody tr").each(function () {
        var tds = $(this).find("td");
        //you could use the Find method to find the textbox or the dropdownlist and get the value.
        var popId = $(tds[1]).html();
        var qty = parseFloat($(tds[6]).find('.ircvqty').val());

        if (popId !== "" && qty !== "" && qty !== 0 && files.length > 0 && warehouse != undefined && warehouse != "" && dlvexc != "" && dlvexc != undefined) {
            fileData.append(files[0].name, files[0]);
            fileData.append('POPId', popId);
            var lin = {
                POPId: popId,
                Quantity: qty,
                Warehouse: warehouse,
                DelvExecutive: dlvexc
            };
            list.push(lin);
        }
    });
    if (files.length > 0) {
        if (list.length > 0) {
            var po = JSON.stringify(list);
            $.ajax({
                url: "/Admin/UpsertMaterialReceive",
                dataType: "json",
                data: "{'po': '" + po + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.error === "") {
                        $.ajax({
                            url: "/Admin/UpdateMaterialReceive",
                            type: "POST",
                            contentType: false,
                            processData: false, // Not to process data  
                            data: fileData,
                            success: function (result) {
                                if (result.error === "") {
                                    location.reload();
                                }
                                else {
                                    alert(result.error);
                                }
                            },
                            error: function (xhr, status, error) {
                                var err = eval("(" + xhr.responseText + ")");
                                alert(err.Message);
                            }
                        });
                    }
                    else {
                        alert(result.error);
                    }
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        }
        else {
            alert("Please select atleast one po.");
        }
    }
    else {
        alert("Vendor Invoice is required");
    }
});

//$(document).on('blur', '.ireqqty', function () {
//    var curRow = $(this).closest("tr");
//    var remqty = curRow.find(".remqty").html();
//    var reqqty = curRow.find(".ireqqty").val();
//    //e.preventDefault();
//    remqty = parseFloat(remqty);
//    reqqty = parseFloat(reqqty);
//    if (reqqty <= remqty) {
//    }
//    else {
//        curRow.find(".ireqqty").val(remqty);
//        alert("Request Quantity is greater than remaining Quantity");
//    }
//});

$(document).on('blur', '.ireqqty', function () {
    var curRow = $(this).closest("tr");
    var reqqty = curRow.find(".ireqqty").val();
    var remqty = curRow.find(".remqty").html();
    var stkqty = curRow.find(".stkqty").html();

    reqqty = parseFloat(reqqty);
    remqty = parseFloat(remqty);
    stkqty = parseFloat(stkqty);
    //e.preventDefault();
    if (stkqty !== 0) {
        if (reqqty > remqty) {
            curRow.find(".ireqqty").val("0");
            curRow.find(".ireqqty").focus();
            alert("Request quantity can not greater than remaining quantity...!");
        }
    }
    else {
        curRow.find(".ireqqty").val("0");
        curRow.find(".ireqqty").focus();
        alert("Stock quantity is not available...!");
    }
});

$('#porisubmit').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $("#porisubmit").attr("disabled", true);
    $("#porisubmit").hide();
    var rmk = $("#RequestInvoiceModels_Remarks").val();
    var cntno = $("#RequestInvoiceModels_ContactNo").val();
    var cntpr = $("#RequestInvoiceModels_ContactPerson").val();
    e.preventDefault();
    var list = new Array();
    // Iterate over all selected checkboxes
    $(".tbl tbody tr").each(function () {
        var tds = $(this).find("td");
        //you could use the Find method to find the texbox or the dropdownlist and get the value.
        var popId = $(tds[1]).html();
        var stkqty = parseFloat($(tds[4]).html());
        var remqty = parseFloat($(tds[5]).html());
        var qty = parseFloat($(tds[6]).find('.ireqqty').val());


        if (popId !== "" && qty !== "" && qty !== 0 && qty <= remqty && stkqty != 0) {
            var lin = {
                POPId: popId,
                Quantity: qty,
                Remarks: rmk,
                ContactNo: cntno,
                ContactPerson: cntpr
            };
            list.push(lin);
        }
    });
    if (list.length > 0) {
        var po = JSON.stringify(list);
        $.ajax({
            url: "/Admin/UpsertPORequestInvoice",
            dataType: "json",
            data: "{'po': '" + po + "'}",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    location.reload();
                }
                else {
                    alert(result.error);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please select atleast one po.");
    }
});


$("#upsubmit").on("click", function (e) {
    e.preventDefault();
    $(this).find(':submit').attr('disabled', 'disabled');
    $("#upsubmit").attr("disabled", true);

    var hdArr = new Array();
    var userId = $('#AddUserModels_UserCode').val();
    $("input:checkbox[class=chk]").each(function () {
        var allchk = {
            Name: $(this).attr("id"),
            Value: $(this).val(),
            Checked: $(this).is(":checked"),
            UserId: userId
        };
        hdArr.push(allchk);
    });
    if (hdArr.length > 0) {
        var frmact = "";
        var pgn = JSON.stringify(hdArr);
        $.ajax({
            url: "/Admin/UpsertUserPermission",
            dataType: "json",
            data: "{'pgn': '" + pgn + "', 'act': '" + frmact + "' }",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    window.location.href = window.location.href;
                }
                else {
                    alert(result.error);
                }
                //location.reload();
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please Select 1 Page");
    }
});

$("#iteamsubmit").on("click", function (e) {
    e.preventDefault();
    $("#iteamsubmit").attr("disabled", true);

    var hdArr = new Array();
    var uTeam = $('#IndusTeamModels_TeamName').val();
    var userName = $('#AddUserModels_UserName').val();
    if (uTeam != "") {
        $("input:checkbox[class=chk]").each(function () {
            var chek = $(this).is(":checked");
            if (chek == true) {
                var allchk = {
                    TeamUsers: $(this).attr("name"),
                    Value: $(this).val(),
                    Checked: $(this).is(":checked"),
                    TeamName: uTeam,
                    TeamHead: userName
                };
                hdArr.push(allchk);
            }
        });
        if (hdArr.length > 0) {
            var frmact = "";
            var iteam = JSON.stringify(hdArr);
            $.ajax({
                url: "/Admin/UpsertIndusTeam",
                dataType: "json",
                data: "{'iteam': '" + iteam + "', 'act': '" + frmact + "' }",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.error === "") {
                        window.location.href = window.location.href;
                    }
                    else {
                        alert(result.error);
                    }
                    //location.reload();
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        }
        else {
            alert("Please Select User");
            $("#iteamsubmit").attr("disabled", false);
        }
    }
    else {
        alert("Please enter team name.");
        $("#iteamsubmit").attr("disabled", false);
    }
});

$('.pobackstage').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".pobackstage").attr("disabled", true);
    e.preventDefault();
    var stg = $(".pobckstg").val();
    var rows_selected = $("#tblpobackstage tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[6].innerText);
    });

    if (list.length > 0) {
        var poIds = JSON.stringify(list);
        $.ajax({
            url: "/Admin/UpdatePOBackstage",
            dataType: "json",
            data: "{'poIds': '" + poIds + "', 'sts': '" + stg + "'}",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    location.reload();
                }
                else {
                    alert(result.error);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please select atleast one po.");
    }
});

$('.enqbackstage').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".enqbackstage").attr("disabled", true);
    e.preventDefault();
    var stg = $(".quotbckstg").val();
    var rows_selected = $("#tblquotbackstage tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[5].innerText);
    });

    if (list.length > 0) {
        var enqIds = JSON.stringify(list);
        $.ajax({
            url: "/Admin/UpdateQuotationBackstage",
            dataType: "json",
            data: "{'enqIds': '" + enqIds + "', 'sts': '" + stg + "'}",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    location.reload();
                }
                else {
                    alert(result.error);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please select atleast one enq.");
    }
});

$(document).on('blur', '.ecstmtrcd', function () {
    var matcode = $(".ecstmtrcd").val();
    //e.preventDefault();
    if (matcode !== "") {
        $.ajax({
            url: '/Admin/GetProductDetWMatCode',
            data: "{'matcode':'" + matcode + "'}",
            type: "POST",
            dataType: "JSON",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                var lst = res;
                if (lst === undefined || lst === "") {
                    $(".skuno").val("");
                    $(".prdid").val("");
                    $(".modelno").val("");
                    $(".prdctgid").val("");
                    $(".brndid").val("");
                    $(".hsncode").val("");
                    $(".untid").val("");
                    $(".spcrmk").val("");
                    $(".qty").val("");
                    $(".price").val("");
                }
                else {
                    $(".skuno").val(res[0].SKUNo).trigger('change.select2');
                    $(".prdid").val(res[0].ProductId);
                    $(".modelno").val(res[0].ModelNo);
                    $(".prdctgid").val(res[0].PrdCtgryId).trigger('change.select2');
                    $(".brndid").val(res[0].BrandId).trigger('change.select2');
                    $(".hsncode").val(res[0].HSNCode);
                    $(".untid").val(res[0].UnitId).trigger('change.select2');
                    $(".spcrmk").val(res[0].SpcRemark);
                    $(".qty").val(res[0].Quantity);
                    $(".price").val(res[0].Price);
                }
            },
            error: function (e) {
                alert("Failed! Please try again.");
            }
        });
    }
    else {
        $(".skuno").val("");
        $(".prdid").val("");
        $(".modelno").val("");
        $(".prdctgid").val("");
        $(".brndid").val("");
        $(".hsncode").val("");
        $(".untid").val("");
        $(".spcrmk").val("");
        $(".qty").val("");
        $(".price").val("");
    }
});

//Add PO item to temp table   
function AddTempEnqLine() {
    var lnitm = parseInt($('.enqlneitm').val());
    //Create Movie Object  
    var tmpenqline = {};
    tmpenqline.CstMtrlCode = $('.cstmtrcd').val();
    tmpenqline.SKUNo = $('.skuno option:selected').text();
    tmpenqline.ProductId = $('.prdid').val();
    tmpenqline.ModelNo = $('.modelno').val();
    tmpenqline.PrdCtgryId = $('.prdctgid option:selected').text();
    tmpenqline.BrandId = $('.brndid option:selected').text();
    tmpenqline.HSNCode = $('.hsncode').val();
    tmpenqline.SpcRemark = $('.spcrmk').val();
    tmpenqline.Quantity = $('.qty').val();
    tmpenqline.UnitId = $('.untid option:selected').text();
    tmpenqline.Price = $('.price').val();
    tmpenqline.Type = $('.type').val();

    if (tmpenqline.SKUNo === "--Select SKU No--") {
        tmpenqline.SKUNo = "";
    }
    if (tmpenqline.PrdCtgryId === "--Select Product Category--") {
        tmpenqline.PrdCtgryId = "";
    }
    if (tmpenqline.BrandId === "--Select Brand--") {
        tmpenqline.BrandId = "";
    }
    if (tmpenqline.UnitId === "--Select Unit--") {
        tmpenqline.UnitId = "";
    }
    if (tmpenqline.Type === "--Select Enq Type--") {
        tmpenqline.Type = "";
    }

    var Errors = "";
    if (tmpenqline.ProductId === "") {
        $('.errprdid').text("Product Name required");
        Errors = "Product Name required";
    }
    else {
        $('.errprdid').text("");
    }
    if (tmpenqline.PrdCtgryId === "") {
        $('.errprdctgid').text("Product Category required");
        Errors = "Product Category required";
    } else {
        $('.errprdctgid').text("");
    }
    if (tmpenqline.BrandId === "") {
        $('.errbrndid').text("Brand required");
        Errors = "Brand required";
    } else {
        $('.errbrndid').text("");
    }
    if (tmpenqline.UnitId === "") {
        $('.erruntid').text("Unit required");
        Errors = "Unit required";
    } else {
        $('.erruntid').text("");
    }
    if (tmpenqline.Quantity === "" || tmpenqline.Quantity === "0") {
        $('.errqty').text("Quantity required");
        Errors = "Quantity required";
    } else {
        $('.errqty').text("");
    }

    if (tmpenqline.Type === "") {
        $('.errtype').text("Enquiry Type required");
        Errors = "Enquiry Type required";
    } else {
        $('.errtype').text("");
    }

    if (Errors.length === 0) {
        var row = parseInt($('#tblTempEnqLine tbody tr').length);
        if (row < lnitm) {
            //Validate no duplicated Titles  
            var ExistTitle = false; // < -- Main indicator  
            $('#tblTempEnqLine > tbody  > tr').each(function () {
                var Title = $(this).find('.pcstcode').text(); // get text of current row by class selector  
                if ($('.cstmtrcd').val() !== "") {
                    if (tmpenqline.CstMtrlCode.toLowerCase() == Title.toLowerCase()) { //Compare provided and existing title
                        ExistTitle = true;
                        return false;
                    }
                }
            });

            //Add movie if title is not duplicated otherwise show error  
            if (ExistTitle === false) {
                //Create Row element with provided data  
                var Row = $('<tr>');
                $('<td>').html(tmpenqline.CstMtrlCode).addClass("pcstcode").appendTo(Row);
                $('<td>').html(tmpenqline.SKUNo).addClass("pskuno").appendTo(Row);
                $('<td>').html(tmpenqline.ProductId).addClass("pprdid").appendTo(Row);
                $('<td>').html(tmpenqline.ModelNo).addClass("pmodelno").appendTo(Row);
                $('<td>').html(tmpenqline.PrdCtgryId).addClass("ppctrid").appendTo(Row);
                $('<td>').html(tmpenqline.BrandId).addClass("pbrndid").appendTo(Row);
                $('<td>').html(tmpenqline.HSNCode).addClass("phsncode").appendTo(Row);
                $('<td>').html(tmpenqline.UnitId).addClass("punitid").appendTo(Row);
                $('<td>').html(tmpenqline.SpcRemark).addClass("pspcrmk").appendTo(Row);
                $('<td>').html(tmpenqline.Quantity).addClass("pqty").appendTo(Row);
                $('<td>').html(tmpenqline.Price).addClass("pprice").appendTo(Row);
                $('<td>').html(tmpenqline.Type).addClass("ptype").appendTo(Row);
                $('<td>').html("<div class='text-center'><button class='btn btn-danger btn-sm' onclick='Delete($(this))'>Remove</button></div>").appendTo(Row);

                //Append row to table's body  
                $('#table-body').append(Row);
                ClearForm();
                CheckSubmitBtn(); // Enable submit button  
            }
        }
        else {
            alert("You can't add more than No of Line Items");
        }
    }
}

$('.enqsubmit').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".enqsubmit").attr("disabled", true);
    $(".enqsubmit").hide();
    e.preventDefault();
    var lnitm = parseInt($('.enqlneitm').val());
    var row = parseInt($('#tblTempEnqLine tbody tr').length);
    if (row === lnitm) {

        var linkObj = $(this);
        var hdArr = new Array();
        var lnArr = new Array();
        var cstId = $('.cstid').val();
        var cstbadd = $('.cstbadd').val();
        var cstsadd = $('.cstsadd').val();
        var enqtype = $('.enqtype').val();
        var enqid = $('.enqid').val();
        var enqdate = $('.enqdate').val();
        var enddate = $('.enddate').val();
        var enqlneitm = $('.enqlneitm').val();
        var enqsentby = $('.enqsentby').val();

        if (cstId !== "" && cstbadd !== "" && cstsadd !== "" && enqid !== "" && enqtype !== "" && enqlneitm !== "0" && enqlneitm !== "" && enqsentby !== "") {

            $(".tbl tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var pcstcode = $(tds[0]).text();
                var pskuno = $(tds[1]).text();
                var pprdid = $(tds[2]).text();
                var pmodelno = $(tds[3]).text();
                var ppctrid = $(tds[4]).text();
                var pbrndid = $(tds[5]).text();
                var phsncode = $(tds[6]).text();
                var punitid = $(tds[7]).text();
                var pspcrmk = $(tds[8]).text();
                var pqty = $(tds[9]).text();
                var pprice = $(tds[10]).text();
                var ptype = $(tds[11]).text();
                if (pprice == "") {
                    pprice = 0;
                }
                if (pprdid !== "" && ppctrid !== "" && pbrndid !== "" && punitid !== "" && pqty !== "0" && pqty !== "" && ptype !== "") {
                    var lin = {
                        CustomerId: cstId,
                        CustomerBillAdd: cstbadd,
                        CustomerShipAdd: cstsadd,
                        EnqType: enqtype,
                        Type: ptype,
                        EnqId: enqid,
                        EnquiryDate: enqdate,
                        EndDate: enddate,
                        LineItems: enqlneitm,
                        EnqSentBy: enqsentby,
                        CstMtrlCode: pcstcode,
                        SKUNo: pskuno,
                        ProductId: pprdid,
                        ModelNo: pmodelno,
                        PrdCtgryId: ppctrid,
                        BrandId: pbrndid,
                        HSNCode: phsncode,
                        SpcRemark: pspcrmk,
                        Quantity: parseFloat(pqty),
                        UnitId: punitid,
                        Price: parseFloat(pprice)
                    };
                    lnArr.push(lin);
                }
            });

            if (lnArr.length > 0) {
                var enq = JSON.stringify(lnArr);

                $.ajax({
                    url: "/Admin/InsertEnquiry",
                    dataType: "json",
                    data: "{'enq': '" + enq + "'}",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        if (result.error === "") {
                            location.reload();
                        }
                        else {
                            alert(result.error);
                        }
                    },
                    error: function (xhr, status, error) {
                        var err = eval("(" + xhr.responseText + ")");
                        alert(err.Message);
                    }
                });
            }
            else {
                alert("Please add atleast 1 line item.");
                $(".enqsubmit").attr("disabled", false);
                $(".enqsubmit").show();
            }
        }
        else {
            alert("Please fill the required fields.");
            $(".enqsubmit").attr("disabled", false);
            $(".enqsubmit").show();
        }
    }
    else {
        alert("Line item not matched.");
        $(".enqsubmit").attr("disabled", false);
        $(".enqsubmit").show();
    }
    $(".enqsubmit").attr("disabled", false);
    $(".enqsubmit").attr("disabled", false);
    $(".enqsubmit").show();
});

$('.enqassign').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".enqassign").attr("disabled", true);
    $(".enqassign").hide();
    e.preventDefault();
    var asn = $(".enqasnto").val();
    var rows_selected = $("#tblassignenq tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[5].innerText);
    });

    if (list.length > 0) {
        var enqIds = JSON.stringify(list);
        $.ajax({
            url: "/Admin/AssignEnquiry",
            dataType: "json",
            data: "{'enqIds': '" + enqIds + "', 'asn': '" + asn + "'}",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    location.reload();
                }
                else {
                    alert(result.error);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please select atleast one po.");
    }
});

//$('.sousubmit').on('click', function (e) {
//    $(this).find(':submit').attr('disabled', 'disabled');
//    $(".sousubmit").attr("disabled", true);
//    $(".sousubmit").hide();
//    e.preventDefault();
//    var lnArr = new Array();
//    $(".tbl tbody tr").each(function () {
//        var tds = $(this).find("td");
//        //you could use the Find method to find the texbox or the dropdownlist and get the value.
//        var senqpid = $(tds[2]).find('.senqpid').val();
//        var sordqty = $(tds[5]).find('.sordqty').val();
//        var svenid = $(tds[8]).find('.svenid').val();
//        var svenprc = $(tds[8]).find('.svenprc').val();
//        var slvenid = $(tds[9]).find('.slvenid').val();
//        var slvenprc = $(tds[9]).find('.slvenprc').val();

//        if (senqpid !== "" /*&& senqid !== ""*/ && svenid !== "" && svenprc !== "" && svenprc !== "0" &&
//            sordqty !== "" && sordqty !== "0"  
//            /*&& slvenid !== "" && slvenprc !== "0" && slvenprc !== ""*/) {
//            var lin = {
//                EnqPId: senqpid,
//                OrderedQuantity: parseFloat(sordqty),
//                VendorId: svenid,
//                VendorPrice: parseFloat(svenprc),
//                //LastVendorId: slvenid,
//                //LastVendorPrice: parseFloat(slvenprc),
//            };
//            lnArr.push(lin);
//        }
//    });

//    if (lnArr.length > 0) {
//        var enq = JSON.stringify(lnArr);

//        $.ajax({
//            url: "/Admin/UpdateSourced",
//            dataType: "json",
//            data: "{'enq': '" + enq + "'}",
//            type: "POST",
//            contentType: "application/json; charset=utf-8",
//            success: function (result) {
//                if (result.error === "") {
//                    location.reload();
//                }
//                else {
//                    alert(result.error);
//                }
//            },
//            error: function (xhr, status, error) {
//                var err = eval("(" + xhr.responseText + ")");
//                alert(err.Message);
//            }
//        });
//    }
//    else {
//        alert("Please add atleast 1 line item.");
//    }
//    $(".sousubmit").attr("disabled", false);
//});

function AddTempVenSourced() {
    var rows_selected = $("#tblvensrc tbody tr.selected");
    var list = new Array();
    var inc = 1;
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[5].innerText);
        var tmpvensrc = {};
        tmpvensrc.CustomerName = row.cells[3].innerText;
        tmpvensrc.EnqPId = row.cells[5].innerText;
        tmpvensrc.Product = row.cells[6].innerText;
        tmpvensrc.Quantity = row.cells[7].innerText;
        tmpvensrc.Price = row.cells[9].innerText;

        var optionrel = '';
        $.ajax({
            url: '/Admin/GetVendorbyPBM',
            data: { enqpid: tmpvensrc.EnqPId },
            type: "GET",
            dataType: "JSON",
            success: function (res) {
                var relsn = res;
                if (relsn.length > 1) {
                    $('.selven1').append(optionrel);
                    $('.selven2').append(optionrel);
                    $('.selven3').append(optionrel);
                    for (var i = 0; i < relsn.length; i++) {
                        optionrel = '<option value="' + relsn[i].Name + '">' + relsn[i].Name + '</option>';
                        $('.selven1').append(optionrel);
                        $('.selven2').append(optionrel);
                        $('.selven3').append(optionrel);
                    }
                }
            },
            error: function () {
                alert("Failed! Please try again.");
            }
        });

        $('#tblvensource').find('tbody').append(
            "<tr>" +
            "<td class='w-10'> <span class='scstname'>" + tmpvensrc.CustomerName + "</span></td>" +
            /*"<td class='w-10'> <input type='text' id='EnquiriesModelList_EnqPId_" + inc + "' name='EnquiriesModelList_EnqPId_" + inc + "' data-toggle='tooltip' title='" + tmpvensrc.EnqPId + "' value='" + tmpvensrc.EnqPId + "' disabled class='form-control spid m-b-0'  type='text' /><a class='btn btn-sm bg-aqua pedtbtn'>Edit Product</a></td>" +*/
            "<td class='w-10'> <input type='text' id='EnquiriesModelList_EnqPId_" + inc + "' name='EnquiriesModelList_EnqPId_" + inc + "' data-toggle='tooltip' title='" + tmpvensrc.EnqPId + "' value='" + tmpvensrc.EnqPId + "' disabled class='form-control spid m-b-0'  type='text' /></td>" +

            "<td class='w-15 tdsprdid'>" + tmpvensrc.Product + "</td>" +

            "<td class='w-6'>  <input type='text' id='EnquiriesModelList_Price_" + inc + "' name='EnquiriesModelList_Price_" + inc + "' value='" + tmpvensrc.Price + "' disabled class='form-control svenprc m-b-0 bg-gray'  type='text' /></td>" +
            "<td class='w-6'>  <input type='text' id='EnquiriesModelList_Quantity_" + inc + "' name='EnquiriesModelList_Quantity_" + inc + "' value='" + tmpvensrc.Quantity + "' class='form-control sqty m-b-0'  type='text' /></td>" +
            "<td class='w-10'> <input type='text' id='EnquiriesModelList_Vendor1Id_" + inc + "' name='EnquiriesModelList_Vendor1Id_" + inc + "' placeholder='Vendor1 Name' value='' class='form-control sven1id sven m-b-0'  type='text' /></br><select multiple class='form-control selven1'></select></td>" +
            "<td class='w-10'> <input type='text' id='EnquiriesModelList_Vendor2Id_" + inc + "' name='EnquiriesModelList_Vendor2Id_" + inc + "' placeholder='Vendor2 Name' value='' class='form-control sven2id sven m-b-0'  type='text' /></br><select multiple class='form-control selven2'></select></td> " +
            "<td class='w-10'> <input type='text' id='EnquiriesModelList_Vendor3Id_" + inc + "' name='EnquiriesModelList_Vendor3Id_" + inc + "' placeholder='Vendor3 Name' value='' class='form-control sven3id sven m-b-0'  type='text' /></br><select multiple class='form-control selven3'></select></td> " +
            "</tr>");
        inc++;
    });

    $(".divvensourced").hide();
    $(".divvensource").show();
}

$(document).on('click', '.selven1', function () {
    var curRow = $(this).closest("tr");
    var ven = curRow.find(".selven1").val();
    var ven1 = curRow.find(".sven1id").val();
    var ven2 = curRow.find(".sven2id").val();
    var ven3 = curRow.find(".sven3id").val();
    curRow.find(".sven1id").val(ven);
    ven1 = curRow.find(".sven1id").val();
    if (ven1 === ven2 || ven1 === ven3) {
        curRow.find(".sven1id").val('');
        alert("This vendor already selected");
    }
    else {
        curRow.find(".sven1id").val(ven);
    }
});

$(document).on('click', '.selven2', function () {
    var curRow = $(this).closest("tr");
    var ven = curRow.find(".selven2").val();
    var ven1 = curRow.find(".sven1id").val();
    var ven2 = curRow.find(".sven2id").val();
    var ven3 = curRow.find(".sven3id").val();
    curRow.find(".sven2id").val(ven);
    ven2 = curRow.find(".sven2id").val();
    if (ven2 === ven1 || ven2 === ven3) {
        curRow.find(".sven2id").val('');
        alert("This vendor already selected");
    }
    else {
        curRow.find(".sven2id").val(ven);
    }
});

$(document).on('click', '.selven3', function () {
    var curRow = $(this).closest("tr");
    var ven = curRow.find(".selven3").val();
    var ven1 = curRow.find(".sven1id").val();
    var ven2 = curRow.find(".sven2id").val();
    var ven3 = curRow.find(".sven3id").val();
    curRow.find(".sven3id").val(ven);
    ven3 = curRow.find(".sven3id").val();
    if (ven3 === ven1 || ven3 === ven2) {
        curRow.find(".sven3id").val('');
        alert("This vendor already selected");
    }
    else {
        curRow.find(".sven3id").val(ven);
    }
});

$('.vensosubmit').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".vensosubmit").attr("disabled", true);
    $(".vensosubmit").hide();
    e.preventDefault();
    var lnArr = new Array();
    $(".tbl tbody tr").each(function () {
        var tds = $(this).find("td");
        //you could use the Find method to find the texbox or the dropdownlist and get the value.
        var spid = $(tds[1]).find('.spid').val();
        var sqty = $(tds[4]).find('.sqty').val();
        var sven1id = $(tds[5]).find('.sven1id').val();
        var sven2id = $(tds[6]).find('.sven2id').val();
        var sven3id = $(tds[7]).find('.sven3id').val();

        if (spid !== "" && sven1id !== "" && sqty !== "" && sqty !== "0") {
            var lin = {
                EnqPId: spid,
                Quantity: parseFloat(sqty),
                Vendor1Id: sven1id,
                Vendor2Id: sven2id,
                Vendor3Id: sven3id
            };
            lnArr.push(lin);
        }
    });

    if (lnArr.length > 0) {
        var enqs = JSON.stringify(lnArr);

        $.ajax({
            url: "/Admin/UpdateVenSource",
            dataType: "json",
            data: "{'enqs': '" + enqs + "'}",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    location.reload();
                }
                else {
                    alert(result.error);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please add atleast 1 line item.");
    }
    $(".vensosubmit").attr("disabled", false);
});

function AddTempSourced() {
    var rows_selected = $("#tblsourced tbody tr.selected");
    var list = new Array();
    var inc = 1;
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[5].innerText);
        var tmpsrc = {};
        tmpsrc.CustomerName = row.cells[3].innerText;
        tmpsrc.EnqPId = row.cells[5].innerText;
        tmpsrc.Product = row.cells[6].innerText;
        tmpsrc.Quantity = row.cells[7].innerText;
        tmpsrc.Price = row.cells[9].innerText;

        $('#tblsource').find('tbody').append(
            "<tr>" +
            /* "<td class='w-10'> <input type='text' id='EnquiriesModelList_CustomerName_" + inc + "' name='EnquiriesModelList_CustomerName_" + inc + "' data-toggle='tooltip' title='" + tmpsrc.CustomerName + "' value='" + tmpsrc.CustomerName + "' disabled required='True' class='form-control scstname m-b-0 bg-gray' type='text'></td>" +*/
            "<td class='w-10'> <span class='scstname'>" + tmpsrc.CustomerName + "</span></td>" +
            "<td class='w-10'> <input type='text' id='EnquiriesModelList_EnqPId_" + inc + "' name='EnquiriesModelList_EnqPId_" + inc + "' data-toggle='tooltip' title='" + tmpsrc.EnqPId + "' value='" + tmpsrc.EnqPId + "' disabled class='form-control spid m-b-0'  type='text' /><a class='btn btn-sm bg-aqua pedtbtn'>Edit Product</a></td>" +

            //"<td class='w-15'> <input type='text' id='EnquiriesModelList_Product_" + inc + "' name='EnquiriesModelList_Product_" + inc + "' data-toggle='tooltip' title='" + tmpsrc.Product + "' disabled value='" + tmpsrc.Product + "' class='form-control sprdid m-b-0 bg-gray'  type='text' /></td>" +

            "<td class='w-15 tdsprdid'>" + tmpsrc.Product + "</td>" +

            "<td class='w-6'>  <input type='text' id='EnquiriesModelList_Price_" + inc + "' name='EnquiriesModelList_Price_" + inc + "' value='" + tmpsrc.Price + "' disabled class='form-control svenprc m-b-0 bg-gray'  type='text' /></td>" +
            "<td class='w-6'>  <input type='text' id='EnquiriesModelList_Quantity_" + inc + "' name='EnquiriesModelList_Quantity_" + inc + "' value='" + tmpsrc.Quantity + "' class='form-control sqty m-b-0'  type='text' /></td>" +
            "<td class='w-6'>  <input type='text' id='EnquiriesModelList_ListPrice_" + inc + "' name='EnquiriesModelList_ListPrice_" + inc + "' value='' class='form-control slprc m-b-0'  type='text' /></td>" +
            "<td class='w-10'> <input type='text' id='EnquiriesModelList_Vendor1Id_" + inc + "' name='EnquiriesModelList_Vendor1Id_" + inc + "' placeholder='Vendor1 Name' value='' class='form-control sven1id sven m-b-0'  data-val='true' data-val-required='Required' /></br><input type='text' id='EnquiriesModelList_Vendor1Price_" + inc + "' name='EnquiriesModelList_Vendor1Price_" + inc + "' value='' placeholder='Price' class='form-control sven1prc onlynumdec m-b-0 float-left w-70'  data-val='true' data-val-required='Required' /><input type='text' id='EnquiriesModelList_Vendor1Discount_" + inc + "' name='EnquiriesModelList_Vendor1Discount_" + inc + "' value='' disabled placeholder='Discount' class='form-control onlynumdec v1dsc m-b-0 w-30' /></td>" +
            "<td class='w-10'> <input type='text' id='EnquiriesModelList_Vendor2Id_" + inc + "' name='EnquiriesModelList_Vendor2Id_" + inc + "' placeholder='Vendor2 Name' value='' class='form-control sven2id sven m-b-0' /></br><input type='text' id='EnquiriesModelList_Vendor2Price_" + inc + "' name='EnquiriesModelList_Vendor2Price_" + inc + "' value='' placeholder='Price' class='form-control sven2prc onlynumdec m-b-0 float-left w-70' /><input type='text' id='EnquiriesModelList_Vendor2Discount_" + inc + "' name='EnquiriesModelList_Vendor2Discount_" + inc + "' value='' disabled placeholder='Discount' class='form-control onlynumdec v2dsc m-b-0 w-30' /></td>" +
            "<td class='w-10'> <input type='text' id='EnquiriesModelList_Vendor3Id_" + inc + "' name='EnquiriesModelList_Vendor3Id_" + inc + "' placeholder='Vendor3 Name' value='' class='form-control sven3id sven m-b-0' /></br><input type='text' id='EnquiriesModelList_Vendor3Price_" + inc + "' name='EnquiriesModelList_Vendor3Price_" + inc + "' value='' placeholder='Price' class='form-control sven3prc onlynumdec m-b-0 float-left w-70' /><input type='text' id='EnquiriesModelList_Vendor3Discount_" + inc + "' name='EnquiriesModelList_Vendor3Discount_" + inc + "' value='' disabled placeholder='Discount' class='form-control onlynumdec v3dsc m-b-0 w-30' /></td>" +
            "<td class='w-6'> <select name='gst' class='form-control select2 sgst' id='gst'><option value = '0'> 0 %</option><option value='5'>5 %</option><option value='12'>12 %</option><option value='18' selected>18 %</option><option value='28'>28 %</option></select ></td>" +
            "</tr>");
        inc++;
    });

    $(".divsourced").hide();
    $(".divsource").show();
}


$(document).on('click', '.pedtbtn', function () {
    var curRow = $(this).closest("tr");
    $('#tblsource tbody tr').removeClass("selected");
    $(this).closest("tr").toggleClass('selected');
    var enqpid = curRow.find(".spid").val();
    $('#EnquiryModels_EnqPId').val(enqpid);
    var prd = curRow.find(".tdsprdid").text();
    var product = (prd.split('\nBrand :')[0]).trim();
    var brand = (prd.split('\nBrand :')[1].split('\nModel :')[0]).trim();
    var model = (prd.split('\nBrand :')[1].split('\nModel :')[1]).trim();
    $('.mprod').val(product);
    $('.mmodel').val(model);
    $("#BrandId option:contains('" + brand + "')").attr("selected", true).change();
    $('#updateModel').modal('show');
});

$('.updpmb').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".updpmb").attr("disabled", true);
    $(".updpmb").hide();
    var enqpid = $('#EnquiryModels_EnqPId').val();
    var prod = $(".mprod").val();
    var mdl = $(".mmodel").val();
    var brand = $("#BrandId").val();
    var brandtext = $("#BrandId option:selected");

    e.preventDefault();

    $.ajax({
        url: "/Admin/UpdateProductBrandModal",
        dataType: "json",
        data: "{'enqpid': '" + enqpid + "','prod': '" + prod + "','mdl': '" + mdl + "','brand': '" + brand + "'}",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.error === "") {
                var product = prod + "\nBrand :" + brandtext.text() + "\nModel :" + mdl;
                $('#tblsource tbody tr.selected').find('.tdsprdid').text(product);
                $(".updpmb").attr("disabled", false);
                $(".updpmb").show();
                $('#updateModel').modal('hide');
            }
            else {
                alert(result.error);
            }
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
    $(".updpmb").attr("disabled", false);
});

$(document).on('focus', '.sven', function () {
    var id = this.id;
    $('#' + id).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/Admin/GetAllVendorList',
                type: "POST",
                dataType: "json",
                data: { Prefix: request.term },
                success: function (data) {
                    response($.map(data, function (item) {
                        return { label: item.Name, value: item.Name };
                    }));
                    //return response(data.d);
                }
            });
        },
    });
});

//Enable Discount
$(document).on('blur', '.slprc', function () {
    var curRow = $(this).closest("tr");
    var slprc = curRow.find(".slprc").val();
    if (slprc !== "" && slprc !== "0") {
        curRow.find(".v1dsc").attr("disabled", false);
        curRow.find(".v2dsc").attr("disabled", false);
        curRow.find(".v3dsc").attr("disabled", false);
        curRow.find(".v1dsc").val("");
        curRow.find(".v2dsc").val("");
        curRow.find(".v3dsc").val("");
        curRow.find(".sven1prc").attr("disabled", true);
        curRow.find(".sven2prc").attr("disabled", true);
        curRow.find(".sven3prc").attr("disabled", true);
        curRow.find(".sven1prc").val("");
        curRow.find(".sven2prc").val("");
        curRow.find(".sven3prc").val("");
    }
    else {
        curRow.find(".v1dsc").attr("disabled", true);
        curRow.find(".v2dsc").attr("disabled", true);
        curRow.find(".v3dsc").attr("disabled", true);
        curRow.find(".v1dsc").val("");
        curRow.find(".v2dsc").val("");
        curRow.find(".v3dsc").val("");
        curRow.find(".sven1prc").attr("disabled", false);
        curRow.find(".sven2prc").attr("disabled", false);
        curRow.find(".sven3prc").attr("disabled", false);
        curRow.find(".sven1prc").val("");
        curRow.find(".sven2prc").val("");
        curRow.find(".sven3prc").val("");
    }
});
//Enable Discount

//Get Vendor 1 Price
$(document).on('blur', '.v1dsc', function () {
    var curRow = $(this).closest("tr");
    var slprc = curRow.find(".slprc").val();
    var v1dsc = curRow.find(".v1dsc").val();

    if (slprc !== "" && slprc !== "0" && v1dsc !== "" && v1dsc !== "0") {
        var prc = (parseFloat(slprc) * parseFloat(v1dsc)) / 100;
        var venprc = slprc - prc;
        /*curRow.find("td:eq(6)").find(".sven1prc").val(venprc.toFixed(2));*/
        curRow.find(".sven1prc").val(venprc.toFixed(2));
    }
    else {
        /*curRow.find("td:eq(5)").find(".sven1prc").val("");*/
        curRow.find(".sven1prc").val("");
    }
});
//Get Vendor 1 Price

//Get Vendor 2 Price
$(document).on('blur', '.v2dsc', function () {
    var curRow = $(this).closest("tr");
    var slprc = curRow.find(".slprc").val();
    var v2dsc = curRow.find(".v2dsc").val();

    if (slprc !== "" && slprc !== "0" && v2dsc !== "" && v2dsc !== "0") {
        var prc = (parseFloat(slprc) * parseFloat(v2dsc)) / 100;
        var venprc = slprc - prc;
        curRow.find(".sven2prc").val(venprc.toFixed(2));
    }
    else {
        curRow.find(".sven2prc").val("");
    }
});
//Get Vendor 2 Price

//Get Vendor 3 Price
$(document).on('blur', '.v3dsc', function () {
    var curRow = $(this).closest("tr");
    var slprc = curRow.find(".slprc").val();
    var v3dsc = curRow.find(".v3dsc").val();

    if (slprc !== "" && slprc !== "0" && v3dsc !== "" && v3dsc !== "0") {
        var prc = (parseFloat(slprc) * parseFloat(v3dsc)) / 100;
        var venprc = slprc - prc;
        curRow.find(".sven3prc").val(venprc.toFixed(2));
    }
    else {
        curRow.find(".sven3prc").val("");
    }
});
//Get Vendor 2 Price

//Get Margin
$(document).on('blur', '.senqvenprcmrg', function () {
    var curRow = $(this).closest("tr");
    var venprc = curRow.find(".senqvenprcmrg").val();
    var slprc = curRow.find(".svenprc").val();
    //e.preventDefault();
    if (venprc !== "" && venprc !== "0") {
        var mrg = (parseFloat(slprc) - parseFloat(venprc)) * 100 / parseFloat(slprc);
        curRow.find("td:eq(5)").find(".senqmarg").val(mrg.toFixed(2) + "%");
    }
    else {
        curRow.find("td:eq(5)").find(".senqmarg").val("");
    }
});
//Get Margin

$('.sosubmit').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".sosubmit").attr("disabled", true);
    $(".sosubmit").hide();
    e.preventDefault();
    var lnArr = new Array();
    var err = "";
    $(".tbl tbody tr").each(function () {
        var tds = $(this).find("td");
        //you could use the Find method to find the texbox or the dropdownlist and get the value.
        var spid = $(tds[1]).find('.spid').val();
        var sqty = $(tds[4]).find('.sqty').val();
        var slprc = $(tds[5]).find('.slprc').val();
        var sven1id = $(tds[6]).find('.sven1id').val();
        var sven1prc = $(tds[6]).find('.sven1prc').val();
        var v1dsc = $(tds[6]).find('.v1dsc').val();
        var sven2id = $(tds[7]).find('.sven2id').val();
        var sven2prc = $(tds[7]).find('.sven2prc').val();
        var v2dsc = $(tds[7]).find('.v2dsc').val();
        var sven3id = $(tds[8]).find('.sven3id').val();
        var sven3prc = $(tds[8]).find('.sven3prc').val();
        var v3dsc = $(tds[8]).find('.v3dsc').val();
        var sgst = $(tds[9]).find('.sgst').val();

        if (sven1id == "") {
            err = "error";
        }

        if (sven1prc == "") {
            err = "error";
        }

        if (sqty == "" || sqty == "0") {
            err = "error";
        }

        if (slprc === "") {
            slprc = 0;
        }
        if (sven2prc === "") {
            sven2prc = 0;
        }
        if (sven3prc === "") {
            sven3prc = 0;
        }

        if (v1dsc === "") {
            v1dsc = 0;
        }
        if (v2dsc === "") {
            v2dsc = 0;
        }
        if (v3dsc === "") {
            v3dsc = 0;
        }

        if (spid !== "" && sven1id !== "" && sven1prc !== "" && sven1prc !== "0" &&
            sqty !== "" && sqty !== "0" && sgst !== "") {
            var lin = {
                EnqPId: spid,
                ListPrice: parseFloat(slprc),
                OrderedQuantity: parseFloat(sqty),
                Vendor1Id: sven1id,
                Vendor1Price: parseFloat(sven1prc),
                Vendor1Discount: parseFloat(v1dsc),
                Vendor2Id: sven2id,
                Vendor2Price: parseFloat(sven2prc),
                Vendor2Discount: parseFloat(v2dsc),
                Vendor3Id: sven3id,
                Vendor3Price: parseFloat(sven3prc),
                Vendor3Discount: parseFloat(v3dsc),
                GST: sgst
                //LastVendorId: slvenid,
                //LastVendorPrice: parseFloat(slvenprc)
            };
            lnArr.push(lin);
        }
    });

    if (lnArr.length > 0 && err == "") {
        var enqs = JSON.stringify(lnArr);

        $.ajax({
            url: "/Admin/UpdateSourced",
            dataType: "json",
            data: "{'enqs': '" + enqs + "'}",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    //location.reload();
                    var url = $("#RedirectTo").val();
                    location.href = url;
                }
                else {
                    alert(result.error);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please fill all mandatory field.");
        $(".sosubmit").attr("disabled", false);
        $(".sosubmit").show();
    }
    $(".sosubmit").attr("disabled", false);
    $(".sosubmit").show();
});

function AddTempQuoted() {
    var rows_selected = $("#tblquoted tbody tr.selected");
    var list = new Array();
    var inc = 1;
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[5].innerText);
        var tmpquoted = {};
        tmpquoted.CustomerName = row.cells[3].innerText;
        tmpquoted.EnqPId = row.cells[5].innerText;
        tmpquoted.Product = row.cells[6].innerText;
        tmpquoted.Quantity = row.cells[7].innerText;
        tmpquoted.Price = row.cells[9].innerText;
        tmpquoted.ListPrice = row.cells[10].innerText;
        tmpquoted.GST = row.cells[11].innerText;
        tmpquoted.Vendor1 = row.cells[12].innerText;
        tmpquoted.Vendor2 = row.cells[13].innerText;
        tmpquoted.Vendor3 = row.cells[14].innerText;

        var ven1 = tmpquoted.Vendor1.split(' - ');
        if (tmpquoted.Vendor2 != "Name -\nPrice - 0\nDiscount - 0") {
            var ven2 = tmpquoted.Vendor2.split(' - ');
            tmpquoted.Vendor2 = ven2[1].split('\nPrice')[0] + " - " + ven2[2].split('\nDiscount')[0] + " - " + ven2[3];
        }
        else {
            tmpquoted.Vendor2 = "";
            ven2 = 0;
        }
        if (tmpquoted.Vendor3 != "Name -\nPrice - 0\nDiscount - 0") {
            var ven3 = tmpquoted.Vendor3.split(' - ');
            tmpquoted.Vendor3 = ven3[1].split('\nPrice')[0] + " - " + ven3[2].split('\nDiscount')[0] + " - " + ven3[3];
        }
        else {
            tmpquoted.Vendor3 = "";
            ven3 = 0;
        }
        var vexist = 0;
        tmpquoted.Vendor1 = ven1[1].split('\nPrice')[0] + " - " + ven1[2].split('\nDiscount')[0] + " - " + ven1[3];
        if (ven1 !== 0 && ven2 !== 0 && ven3 !== 0) {
            tmpquoted.Vendor1Price = Math.min(parseFloat(ven1[2]), parseFloat(ven2[2]), parseFloat(ven3[2]));
            tmpquoted.Vendor1Discount = Math.max(parseFloat(ven1[3]), parseFloat(ven2[3]), parseFloat(ven3[3])) + " %";
            vexist = 3;
        }
        if (ven1 !== 0 && ven2 !== 0 && ven3 === 0) {
            tmpquoted.Vendor1Price = Math.min(parseFloat(ven1[2]), parseFloat(ven2[2]));
            tmpquoted.Vendor1Discount = Math.max(parseFloat(ven1[3]), parseFloat(ven2[3])) + " %";
            vexist = 2;
        }
        if (ven1 !== 0 && ven2 === 0 && ven3 === 0) {
            tmpquoted.Vendor1Price = parseFloat(ven1[2]);
            tmpquoted.Vendor1Discount = parseFloat(ven1[3]) + " %";
            vexist = 1;
        }

        var seq1 = 0, seq2 = 0, seq3 = 0;
        if ((tmpquoted.Vendor1).includes(tmpquoted.Vendor1Price)) {
            seq1 = tmpquoted.Vendor1;
            seq2 = tmpquoted.Vendor2;
            seq3 = tmpquoted.Vendor3;
        }
        else if ((tmpquoted.Vendor2).includes(tmpquoted.Vendor1Price)) {
            seq1 = tmpquoted.Vendor2;
            seq2 = tmpquoted.Vendor1;
            seq3 = tmpquoted.Vendor3;
        }
        else if ((tmpquoted.Vendor3).includes(tmpquoted.Vendor1Price)) {
            seq1 = tmpquoted.Vendor3;
            seq2 = tmpquoted.Vendor1;
            seq3 = tmpquoted.Vendor2;
        }

        if (vexist === 3) {
            var rt = "<select name='selvendor' class='form-control select2 selven' id='selvendor'>" +
                "<option value='" + seq1 + "'> " + seq1.split(' - ')[0] + "</option>" +
                "<option value='" + seq2 + "'> " + seq2.split(' - ')[0] + "</option>" +
                "<option value='" + seq3 + "'> " + seq3.split(' - ')[0] + "</option>" +
                "</select>";
        }
        else if (vexist === 2) {
            var rt = "<select name='selvendor' class='form-control select2 selven' id='selvendor'>" +
                "<option value='" + seq1 + "'> " + seq1.split(' - ')[0] + "</option>" +
                "<option value='" + seq2 + "'> " + seq2.split(' - ')[0] + "</option>" +
                "</select>";
        }
        else if (vexist === 1) {
            var rt = "<select name='selvendor' class='form-control select2 selven' id='selvendor'>" +
                "<option value='" + seq1 + "'> " + seq1.split(' - ')[0] + "</option>" +
                "</select>";
        }

        if (tmpquoted.ListPrice !== "0") {
            $('#tblquote').find('tbody').append(
                "<tr>" +
                "<td class='w-10'><input type='text' id='EnquiriesModelList_CustomerName_" + inc + "' name='EnquiriesModelList_CustomerName_" + inc + "' data-toggle='tooltip' title='" + tmpquoted.CustomerName + "' value='" + tmpquoted.CustomerName + "' disabled required='True' class='form-control scstname m-b-0 bg-gray' type='text'></td>" +
                "<td class='w-10'><input type='text' id='EnquiriesModelList_EnqPId_" + inc + "' name='EnquiriesModelList_EnqPId_" + inc + "' data-toggle='tooltip' title='" + tmpquoted.EnqPId + "' value='" + tmpquoted.EnqPId + "' disabled class='form-control spid m-b-0 bg-gray'  type='text' /></td>" +
                "<td class='w-15'><input type='text' id='EnquiriesModelList_Product_" + inc + "' name='EnquiriesModelList_Product_" + inc + "' data-toggle='tooltip' title='" + tmpquoted.Product + "' disabled value='" + tmpquoted.Product + "' class='form-control sprdid m-b-0 bg-gray'  type='text' /></td>" +
                "<td class='w-6'><input type='text' id='EnquiriesModelList_Price_" + inc + "' name='EnquiriesModelList_Price_" + inc + "' value='" + tmpquoted.Price + "' disabled class='form-control svenprc m-b-0 bg-gray'  type='text' /></td>" +
                "<td class='w-6'><input type='text' id='EnquiriesModelList_Quantity_" + inc + "' name='EnquiriesModelList_Quantity_" + inc + "' value='" + tmpquoted.Quantity + "' disabled class='form-control sqty m-b-0 bg-gray'  type='text' /></td>" +
                "<td class='w-6'><input type='text' id='EnquiriesModelList_ListPrice_" + inc + "' name='EnquiriesModelList_ListPrice_" + inc + "' value='" + tmpquoted.ListPrice + "' disabled class='form-control lsprc m-b-0 bg-gray' disabled type='text' /></td>" +
                "<td class='w-10'>" + rt + "</br > " +
                "<input type='text' id='EnquiriesModelList_Vendor1Price_" + inc + "' name='EnquiriesModelList_Vendor1Price_" + inc + "' value='" + tmpquoted.Vendor1Price + "' placeholder='Vendor1 Price' class='form-control sven1prc onlynumdec m-b-0 float-left w-70' disabled/><input type='text' id='EnquiriesModelList_Vendor1Discount_" + inc + "' name='EnquiriesModelList_Vendor1Discount_" + inc + "' value='" + tmpquoted.Vendor1Discount + "' placeholder='Discount' class='form-control sven1dsc onlynumdec m-b-0 float-left w-30' disabled/></td > " +
                "<td class='w-10'><input type='text' id='EnquiriesModelList_QuotePrice_" + inc + "' name='EnquiriesModelList_QuotePrice_" + inc + "' placeholder='Quote Price' value='' class='form-control squotprc m-b-0'  type='text' disabled/></br><input type='text' id='EnquiriesModelList_Margin_" + inc + "' name='EnquiriesModelList_Margin_" + inc + "' value='' placeholder='Margin' class='form-control smarg onlynumdec m-b-0 float-left w-70' disabled/><input type='text' id='EnquiriesModelList_QuoteDiscount_" + inc + "' name='EnquiriesModelList_QuoteDiscount_" + inc + "' value='' placeholder='Discount' class='form-control sqtdsc onlynumdec m-b-0 float-left w-30' /></td > " +
                "<td class='w-6'><input type='text' id='EnquiriesModelList_GST_" + inc + "' name='EnquiriesModelList_GST_" + inc + "' value='" + tmpquoted.GST + "' disabled class='form-control sgst m-b-0 bg-gray'  type='text' /></td>" +
                "</tr>");
        }
        else {
            $('#tblquote').find('tbody').append(
                "<tr>" +
                "<td class='w-10'><input type='text' id='EnquiriesModelList_CustomerName_" + inc + "' name='EnquiriesModelList_CustomerName_" + inc + "' data-toggle='tooltip' title='" + tmpquoted.CustomerName + "' value='" + tmpquoted.CustomerName + "' disabled required='True' class='form-control scstname m-b-0 bg-gray' type='text'></td>" +
                "<td class='w-10'><input type='text' id='EnquiriesModelList_EnqPId_" + inc + "' name='EnquiriesModelList_EnqPId_" + inc + "' data-toggle='tooltip' title='" + tmpquoted.EnqPId + "' value='" + tmpquoted.EnqPId + "' disabled class='form-control spid m-b-0 bg-gray'  type='text' /></td>" +
                "<td class='w-15'><input type='text' id='EnquiriesModelList_Product_" + inc + "' name='EnquiriesModelList_Product_" + inc + "' data-toggle='tooltip' title='" + tmpquoted.Product + "' disabled value='" + tmpquoted.Product + "' class='form-control sprdid m-b-0 bg-gray'  type='text' /></td>" +
                "<td class='w-6'><input type='text' id='EnquiriesModelList_Price_" + inc + "' name='EnquiriesModelList_Price_" + inc + "' value='" + tmpquoted.Price + "' disabled class='form-control svenprc m-b-0 bg-gray'  type='text' /></td>" +
                "<td class='w-6'><input type='text' id='EnquiriesModelList_Quantity_" + inc + "' name='EnquiriesModelList_Quantity_" + inc + "' value='" + tmpquoted.Quantity + "' disabled class='form-control sqty m-b-0 bg-gray'  type='text' /></td>" +
                "<td class='w-6'><input type='text' id='EnquiriesModelList_ListPrice_" + inc + "' name='EnquiriesModelList_ListPrice_" + inc + "' value='" + tmpquoted.ListPrice + "' disabled class='form-control lsprc m-b-0 bg-gray' disabled type='text' /></td>" +
                "<td class='w-10'>" + rt + "</br > " +
                "<input type='text' id='EnquiriesModelList_Vendor1Price_" + inc + "' name='EnquiriesModelList_Vendor1Price_" + inc + "' value='" + tmpquoted.Vendor1Price + "' placeholder='Vendor1 Price' class='form-control sven1prc onlynumdec m-b-0 float-left w-70' disabled/><input type='text' id='EnquiriesModelList_Vendor1Discount_" + inc + "' name='EnquiriesModelList_Vendor1Discount_" + inc + "' value='" + tmpquoted.Vendor1Discount + "' placeholder='Discount' class='form-control sven1dsc onlynumdec m-b-0 float-left w-30' disabled/></td > " +
                "<td class='w-10'><input type='text' id='EnquiriesModelList_QuotePrice_" + inc + "' name='EnquiriesModelList_QuotePrice_" + inc + "' placeholder='Quote Price' value='' class='form-control squotprc m-b-0'  type='text'  /></br><input type='text' id='EnquiriesModelList_Margin_" + inc + "' name='EnquiriesModelList_Margin_" + inc + "' value='' placeholder='Margin' class='form-control smarg onlynumdec m-b-0 float-left w-70' /><input type='text' id='EnquiriesModelList_QuoteDiscount_" + inc + "' name='EnquiriesModelList_QuoteDiscount_" + inc + "' value='' placeholder='Discount' class='form-control sqtdsc onlynumdec m-b-0 float-left w-30' disabled /></td > " +
                "<td class='w-6'><input type='text' id='EnquiriesModelList_GST_" + inc + "' name='EnquiriesModelList_GST_" + inc + "' value='" + tmpquoted.GST + "' disabled class='form-control sgst m-b-0 bg-gray'  type='text' /></td>" +
                "</tr>");
        }
        inc++;
    });

    $(".divquoted").hide();
    $(".divquote").show();
}

//Get Margin
$(document).on('blur', '.squotprc', function () {
    var curRow = $(this).closest("tr");
    var squotprc = curRow.find(".squotprc").val();
    var sven1prc = curRow.find(".sven1prc").val();
    var smarg = curRow.find(".smarg").val();
    //e.preventDefault();
    if (squotprc !== "" && squotprc !== "0" && smarg === "") {
        var mrg = (parseFloat(squotprc) - parseFloat(sven1prc)) * 100 / parseFloat(squotprc);
        curRow.find("td:eq(7)").find(".smarg").val(mrg.toFixed(2) + "%");
        curRow.find("td:eq(8)").find(".sgst").focus();
    }
});
//Get Margin

//Get Quoted Price
$(document).on('blur', '.smarg', function () {
    var curRow = $(this).closest("tr");
    var sven1prc = curRow.find(".sven1prc").val();
    var smrg = curRow.find(".smarg").val();
    var squotprc = curRow.find(".squotprc").val();
    //e.preventDefault();
    if (smrg !== "" && smrg !== "0" && squotprc === "") {
        var mrg = (parseFloat(sven1prc) / (100 - parseFloat(smrg))) * 100;
        curRow.find("td:eq(7)").find(".squotprc").val(mrg.toFixed(2));
        curRow.find("td:eq(8)").find(".sgst").focus();
    }
});
//Get Quoted Price

//Get Vendor Price
$(document).on('change', '.selven', function () {
    var curRow = $(this).closest("tr");
    var sven = curRow.find(".selven").val();
    var sprc = sven.split(' - ')[1];
    var sdsc = sven.split(' - ')[2];
    curRow.find("td:eq(6)").find(".sven1prc").val(sprc);
    curRow.find("td:eq(6)").find(".sven1dsc").val(sdsc + " %");
});
//Get Vendor Price

//Get Quote Price
$(document).on('blur', '.sqtdsc', function () {
    var curRow = $(this).closest("tr");
    var lsprc = curRow.find(".lsprc").val();
    var sqtdsc = curRow.find(".sqtdsc").val();
    var sven1prc = curRow.find(".sven1prc").val();
    var smarg = curRow.find(".smarg").val();

    if (lsprc !== "" && lsprc !== "0" && sqtdsc !== "" && sqtdsc !== "0") {
        var prc = (parseFloat(lsprc) * parseFloat(sqtdsc)) / 100;
        var qtprc = lsprc - prc;
        curRow.find(".squotprc").val(qtprc.toFixed(2));

        var mrg = (parseFloat(qtprc) - parseFloat(sven1prc)) * 100 / parseFloat(qtprc);
        curRow.find(".smarg").val(mrg.toFixed(2) + "%");
        curRow.find(".sgst").focus();

    }
    else {
        curRow.find(".squotprc").val("");
        curRow.find(".smarg").val("");
    }

    //e.preventDefault();

});
//Get Quote Price

$('.quotedsubmit').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".quotedsubmit").attr("disabled", true);
    $(".quotedsubmit").hide();
    e.preventDefault();
    var lnArr = new Array();
    $(".tbl tbody tr").each(function () {
        var tds = $(this).find("td");
        //you could use the Find method to find the texbox or the dropdownlist and get the value.
        var spid = $(tds[1]).find('.spid').val();
        var sven = $(tds[6]).find('.selven').val();
        var sven1prc = $(tds[6]).find('.sven1prc').val();
        var sven1dsc = $(tds[6]).find('.sven1dsc').val();
        var squotprc = $(tds[7]).find('.squotprc').val();
        var sqtdsc = $(tds[7]).find('.sqtdsc').val();
        var smarg = $(tds[7]).find('.smarg').val();
        var sgst = $(tds[8]).find('.sgst').val();

        if (sven1dsc !== "" && sven1dsc !== "0") {
            sven1dsc = sven1dsc.split('%')[0];
        }
        else {
            sven1dsc = 0;
        }

        if (sqtdsc !== "" && sqtdsc !== "0") {
            sqtdsc = sqtdsc.split('%')[0];
        }
        else {
            sqtdsc = 0;
        }

        if (smarg !== "" && smarg !== "0") {
            smarg = smarg.split('%')[0];
        }
        else {
            smarg = 0;
        }

        if (spid !== "" && sven !== "" && sven1prc !== "" && sven1prc !== "0" &&
            squotprc !== "" && squotprc !== "0" && sgst !== "") {
            var lin = {
                EnqPId: spid,
                VendorId: sven,
                VendorPrice: parseFloat(sven1prc),
                VendorDiscount: parseFloat(sven1dsc),
                QuotePrice: parseFloat(squotprc),
                QuoteDiscount: parseFloat(sqtdsc),
                Margin: parseFloat(smarg),
                GST: sgst
                //LastVendorId: slvenid,
                //LastVendorPrice: parseFloat(slvenprc)
            };
            lnArr.push(lin);
        }
    });

    if (lnArr.length > 0) {
        var enqs = JSON.stringify(lnArr);

        $.ajax({
            url: "/Admin/UpdateQuoted",
            dataType: "json",
            data: "{'enqs': '" + enqs + "'}",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    location.reload();
                }
                else {
                    alert(result.error);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please add atleast 1 line item.");
    }
    $(".sosubmit").attr("disabled", false);
});

function AddTempQuotation() {
    var rows_selected = $("#tblQuotation tbody tr.selected");
    var list = new Array();
    var inc = 1;
    var ccstId = "";
    var venid = "";
    var cstid = "";
    var eIdNo = "";
    var cvenid = "";
    $("#tblquot > tbody > tr").remove();
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        var index = $("#tblQuotation tbody tr.selected").index(this);
        if (index == 0) {
            ccstId = row.cells[3].innerText;
            eIdNo = row.cells[4].innerText;
            cvenid = row.cells[10].innerText;
        }
        var cstId = row.cells[3].innerText;
        var eeid = row.cells[4].innerText;
        var veneid = row.cells[10].innerText;

        if (ccstId !== "" && cvenid != "" && eIdNo != "") {
            if (ccstId == cstId /*&& cvenid == veneid*/) {
                list.push(row.cells[5].innerText);
                venid = row.cells[10].innerText;
                cstid = row.cells[3].innerText;
                var tmpquotsrc = {};
                tmpquotsrc.CustomerName = row.cells[3].innerText;
                tmpquotsrc.EnqPId = row.cells[5].innerText;
                tmpquotsrc.Product = row.cells[6].innerText;
                tmpquotsrc.Quantity = row.cells[7].innerText;
                tmpquotsrc.Unit = row.cells[8].innerText;
                tmpquotsrc.VendorId = row.cells[10].innerText;
                tmpquotsrc.QuotePrice = row.cells[12].innerText;
                tmpquotsrc.GST = row.cells[13].innerText;
                var amnt = parseFloat(tmpquotsrc.Quantity) * parseFloat(tmpquotsrc.QuotePrice);
                $('#tblquot').find('tbody').append(
                    "<tr class='selected'>" +
                    "<td class='w-15'> <input type='text' id='EnquiriesModelList_CustomerName_" + inc + "' name='EnquiriesModelList_CustomerName_" + inc + "' data-toggle='tooltip' title='" + tmpquotsrc.CustomerName + "' value='" + tmpquotsrc.CustomerName + "' disabled required='True' class='form-control scstname m-b-0' type='text'></td>" +
                    "<td class='w-10'> <input type='text' id='EnquiriesModelList_EnqPId_" + inc + "' name='EnquiriesModelList_EnqPId_" + inc + "' data-toggle='tooltip' title='" + tmpquotsrc.EnqPId + "' value='" + tmpquotsrc.EnqPId + "' disabled class='form-control senqpid m-b-0'  type='text' /></td>" +
                    "<td class='w-20'> <input type='text' id='EnquiriesModelList_Product_" + inc + "' name='EnquiriesModelList_Product_" + inc + "' data-toggle='tooltip' title='" + tmpquotsrc.Product + "' value='" + tmpquotsrc.Product + "' disabled class='form-control sprdid m-b-0'  type='text' /></td>" +
                    "<td class='w-8'>  <input type='text' id='EnquiriesModelList_Quantity_" + inc + "' name='EnquiriesModelList_Quantity_" + inc + "' value='" + tmpquotsrc.Quantity + "' disabled class='form-control sqty m-b-0'  type='text' /></td>" +
                    "<td class='w-10'> <input type='text' id='EnquiriesModelList_Unit_" + inc + "' name='EnquiriesModelList_Unit_" + inc + "' value='" + tmpquotsrc.Unit + "' disabled class='form-control sunit m-b-0'  type='text' /></td>" +
                    "<td class='w-6'>  <input type='text' id='EnquiriesModelList_UnitPrice_" + inc + "' name='EnquiriesModelList_UnitPrice_" + inc + "' value='" + tmpquotsrc.QuotePrice + "' placeholder='Unit Price' disabled class='form-control svunitprc m-b-0' /></td>" +
                    "<td class='w-6'> <input type='text' id='EnquiriesModelList_Discount_" + inc + "' name='EnquiriesModelList_Discount_" + inc + "' value='' placeholder='Discount' class='form-control sdisc m-b-0' /></br><input type='text' id='EnquiriesModelList_Value_" + inc + "' name='EnquiriesModelList_Value_" + inc + "' value='' placeholder='Value' class='form-control svalue m-b-0' /></td>" +
                    "<td class='w-6'> <input type='text' id='EnquiriesModelList_TotalPrice_" + inc + "' name='EnquiriesModelList_TotalPrice_" + inc + "' value='" + amnt + "' placeholder='TotalPrice' disabled class='form-control stotprc m-b-0' />" +
                    "<td class='w-6'> <input type='text' id='EnquiriesModelList_GST_" + inc + "' name='EnquiriesModelList_GST_" + inc + "' value='" + tmpquotsrc.GST + "' placeholder='GST' disabled class='form-control svengst m-b-0' /></td > " +
                    "<td class='w-10'> <input type='text' id='EnquiriesModelList_IndLeadTime_" + inc + "' name='EnquiriesModelList_IndLeadTime_" + inc + "' value='' placeholder='Lead Time' class='form-control indleadtime m-b-0' /></td > " +
                    "</tr>");
                inc++;
                //});
                if (cstid !== "") {
                    $.ajax({
                        url: '/Admin/GetCustomerByName',
                        data: { cstid: cstid },
                        type: "GET",
                        dataType: "JSON",
                        success: function (res) {
                            var relsn = res;
                            $('#QuotationModels_CustomerBillingAddress').empty();
                            if (relsn.length === 0) {
                                $("#QuotationModels_CustomerBillingAddress").attr("required", true);
                                $("#QuotationModels_CustomerBillingAddress").attr("disabled", true);
                            }
                            else if (relsn.length === 1) {
                                $("#QuotationModels_CustomerBillingAddress").attr("disabled", false);
                                var optionrel = '<option value="' + relsn[0].Id + '">' + relsn[0].Name + '</option>';
                                $('#QuotationModels_CustomerBillingAddress').append(optionrel);
                                $('#QuotationModels_CustomerBillingAddress').val(relsn[0].Id);
                            }
                            else if (relsn.length > 1) {
                                $('#QuotationModels_CustomerBillingAddress').val("");
                                $("#QuotationModels_CustomerBillingAddress").attr("disabled", false);
                                var optionrel = '<option value="">--Select Customer Billing Address--</option>';
                                $('#QuotationModels_CustomerBillingAddress').append(optionrel);
                                $("#QuotationModels_CustomerBillingAddress").attr("required", true);
                                for (var i = 0; i < relsn.length; i++) {
                                    var optionrel = '<option value="' + relsn[i].Id + '">' + relsn[i].Name + '</option>';
                                    $('#QuotationModels_CustomerBillingAddress').append(optionrel);
                                }
                            }
                        },
                        error: function () {
                            alert("Failed! Please try again.");
                        }
                    });
                }

                if (cstid !== "") {
                    $.ajax({
                        url: '/Admin/GetCustomerPaymentTerms',
                        data: { cstid: cstid },
                        type: "GET",
                        dataType: "JSON",
                        success: function (res) {
                            var relsn = res;
                            $('.pterms').val();
                            if (relsn.length !== 0) {
                                $(".pterms").val(relsn[0].PTerms);
                            }
                        },
                        error: function () {
                            alert("Failed! Please try again.");
                        }
                    });
                }
                else {
                    $(".pterms").val("");
                }
                //Create Movie Object  
                $(".divsourced").hide();
                $(".divgen").show();
            }
        }
        else
            if (eIdNo != "" && cvenid != "") {
                if (eIdNo == eeid && cvenid == veneid) {
                    //$.each(rows_selected, function (index, row) {
                    // Create a hidden element
                    list.push(row.cells[5].innerText);
                    venid = row.cells[10].innerText;
                    cstid = row.cells[3].innerText;
                    var tmpquotsrc = {};
                    tmpquotsrc.CustomerName = row.cells[3].innerText;
                    tmpquotsrc.EnqPId = row.cells[5].innerText;
                    tmpquotsrc.Product = row.cells[6].innerText;
                    tmpquotsrc.Quantity = row.cells[7].innerText;
                    tmpquotsrc.Unit = row.cells[8].innerText;
                    tmpquotsrc.VendorId = row.cells[10].innerText;
                    tmpquotsrc.QuotePrice = row.cells[12].innerText;
                    tmpquotsrc.GST = row.cells[13].innerText;
                    var amnt = parseFloat(tmpquotsrc.Quantity) * parseFloat(tmpquotsrc.QuotePrice);
                    $('#tblquot').find('tbody').append(
                        "<tr class='selected'>" +
                        "<td class='w-15'> <input type='text' id='EnquiriesModelList_CustomerName_" + inc + "' name='EnquiriesModelList_CustomerName_" + inc + "' data-toggle='tooltip' title='" + tmpquotsrc.CustomerName + "' value='" + tmpquotsrc.CustomerName + "' disabled required='True' class='form-control scstname m-b-0' type='text'></td>" +
                        "<td class='w-12'> <input type='text' id='EnquiriesModelList_EnqPId_" + inc + "' name='EnquiriesModelList_EnqPId_" + inc + "' data-toggle='tooltip' title='" + tmpquotsrc.EnqPId + "' value='" + tmpquotsrc.EnqPId + "' disabled class='form-control senqpid m-b-0'  type='text' /></td>" +
                        "<td class='w-20'> <input type='text' id='EnquiriesModelList_Product_" + inc + "' name='EnquiriesModelList_Product_" + inc + "' data-toggle='tooltip' title='" + tmpquotsrc.Product + "' value='" + tmpquotsrc.Product + "' disabled class='form-control sprdid m-b-0'  type='text' /></td>" +
                        "<td class='w-8'>  <input type='text' id='EnquiriesModelList_Quantity_" + inc + "' name='EnquiriesModelList_Quantity_" + inc + "' value='" + tmpquotsrc.Quantity + "' disabled class='form-control sqty m-b-0'  type='text' /></td>" +
                        "<td class='w-10'> <input type='text' id='EnquiriesModelList_Unit_" + inc + "' name='EnquiriesModelList_Unit_" + inc + "' value='" + tmpquotsrc.Unit + "' disabled class='form-control sunit m-b-0'  type='text' /></td>" +
                        "<td class='w-8'>  <input type='text' id='EnquiriesModelList_UnitPrice_" + inc + "' name='EnquiriesModelList_UnitPrice_" + inc + "' value='" + tmpquotsrc.QuotePrice + "' placeholder='Unit Price' disabled class='form-control svunitprc m-b-0' /></td>" +
                        "<td class='w-8'> <input type='text' id='EnquiriesModelList_Discount_" + inc + "' name='EnquiriesModelList_Discount_" + inc + "' value='' placeholder='Discount' class='form-control sdisc m-b-0' /></br><input type='text' id='EnquiriesModelList_Value_" + inc + "' name='EnquiriesModelList_Value_" + inc + "' value='' placeholder='Value' class='form-control svalue m-b-0' /></td>" +
                        "<td class='w-8'> <input type='text' id='EnquiriesModelList_TotalPrice_" + inc + "' name='EnquiriesModelList_TotalPrice_" + inc + "' value='' placeholder='TotalPrice' disabled class='form-control stotprc m-b-0' />" +
                        "<td class='w-10'> <input type='text' id='EnquiriesModelList_GST_" + inc + "' name='EnquiriesModelList_GST_" + inc + "' value='" + tmpquotsrc.GST + "' placeholder='GST' disabled class='form-control svengst m-b-0' /></td > " +
                        "</tr>");
                    inc++;
                    //});
                    if (cstid !== "") {
                        $.ajax({
                            url: '/Admin/GetCustomerByName',
                            data: { cstid: cstid },
                            type: "GET",
                            dataType: "JSON",
                            success: function (res) {
                                var relsn = res;
                                $('#QuotationModels_CustomerBillingAddress').empty();
                                if (relsn.length === 0) {
                                    $("#QuotationModels_CustomerBillingAddress").attr("required", true);
                                    $("#QuotationModels_CustomerBillingAddress").attr("disabled", true);
                                }
                                else if (relsn.length === 1) {
                                    $("#QuotationModels_CustomerBillingAddress").attr("disabled", false);
                                    var optionrel = '<option value="' + relsn[0].Id + '">' + relsn[0].Name + '</option>';
                                    $('#QuotationModels_CustomerBillingAddress').append(optionrel);
                                    $('#QuotationModels_CustomerBillingAddress').val(relsn[0].Id);
                                }
                                else if (relsn.length > 1) {
                                    $('#QuotationModels_CustomerBillingAddress').val("");
                                    $("#QuotationModels_CustomerBillingAddress").attr("disabled", false);
                                    var optionrel = '<option value="">--Select Customer Billing Address--</option>';
                                    $('#QuotationModels_CustomerBillingAddress').append(optionrel);
                                    $("#QuotationModels_CustomerBillingAddress").attr("required", true);
                                    for (var i = 0; i < relsn.length; i++) {
                                        var optionrel = '<option value="' + relsn[i].Id + '">' + relsn[i].Name + '</option>';
                                        $('#QuotationModels_CustomerBillingAddress').append(optionrel);
                                    }
                                }
                            },
                            error: function () {
                                alert("Failed! Please try again.");
                            }
                        });
                    }

                    if (cstid !== "") {
                        $.ajax({
                            url: '/Admin/GetVendorPaymentTerms',
                            data: { cstid: cstid },
                            type: "GET",
                            dataType: "JSON",
                            success: function (res) {
                                var relsn = res;
                                $('.pterms').val();
                                if (relsn.length !== 0) {
                                    $(".pterms").val(relsn[0].PTerms);
                                }
                            },
                            error: function () {
                                alert("Failed! Please try again.");
                            }
                        });
                    }
                    else {
                        $(".pterms").val("");
                    }
                    //Create Movie Object  
                    $(".divsourced").hide();
                    $(".divgen").show();
                }
            }
        pIdNo = row.cells[4].innerText;
    });
}
// Iterate over all selected checkboxes

//Get Margin
$(document).on('blur', '.sdisc', function () {
    var curRow = $(this).closest("tr");
    var sdisc = curRow.find(".sdisc").val();
    var svunitprc = curRow.find(".svunitprc").val();
    var sqty = curRow.find(".sqty").val();
    //e.preventDefault();
    if (sdisc !== "" && sdisc !== "0" && svunitprc !== "" && svunitprc !== "0") {
        var mrg = parseFloat(svunitprc) - ((parseFloat(svunitprc) * parseFloat(sdisc)) / 100);
        var tot = parseFloat(sqty) * parseFloat(mrg);
        curRow.find("td:eq(6)").find(".svalue").val(mrg.toFixed(2));
        curRow.find("td:eq(7)").find(".stotprc").val(tot.toFixed(2));
    }
});
//Get Margin

//Get Margin
$(document).on('blur', '.svalue', function () {
    var curRow = $(this).closest("tr");
    var svalue = curRow.find(".svalue").val();
    var svunitprc = curRow.find(".svunitprc").val();
    var sqty = curRow.find(".sqty").val();
    //e.preventDefault();
    if (svalue !== "" && svalue !== "0" && svunitprc !== "" && svunitprc !== "0") {
        var mrg = (parseFloat(svunitprc) - parseFloat(svalue)) * 100 / parseFloat(svunitprc);
        var tot = parseFloat(sqty) * parseFloat(svalue);
        curRow.find("td:eq(6)").find(".sdisc").val(mrg.toFixed(2));
        curRow.find("td:eq(7)").find(".stotprc").val(tot.toFixed(2));
    }
});
//Get Margin

$(".quot").hide();
$('#enqcalculate').on('click', function (e) {
    e.preventDefault();
    var vba = $('.vba option:selected').text();
    var bba = $('.bba option:selected').text();
    if (vba != "" && vba != '--Select Customer Billing Address--' && bba != "" && bba != '--Select Buyer Billing Address--') {
        var vsts = vba.split('-').pop();
        var bsts = bba.split('-').pop();

        var pnfamnt = $('.pnfamnt').val();
        var frghtamnt = $('.frghtamnt').val();

        var pnfamnta = 0;
        var frghtamnta = 0;

        var tamountbeforetax = 0, totl_cgst = 0, totl_sgst = 0, totl_igst = 0;
        var cgstPercentage = 0, sgstPercentage = 0, igstPercentage = 0, cgstAmt = 0, igstAmt = 0, sgstAmt = 0;
        // Iterate over all selected checkboxes
        var i = 0;
        $("#tblquot tbody tr").each(function () {
            var tds = $(this).find("td");
            if (i == 0) {
                pnfamnt = parseFloat(pnfamnt);
                frghtamnt = parseFloat(frghtamnt);

                pnfamnta = parseFloat(pnfamnt);
                frghtamnta = parseFloat(frghtamnt);
            }
            else {
                pnfamnt = 0;
                frghtamnt = 0;
            }
            var amountBeforeTax = parseFloat($(tds[7]).find('.stotprc').val());
            tamountbeforetax += parseFloat(amountBeforeTax);
            var gstPercentage = parseFloat($(tds[8]).find('.svengst').val());
            if (vsts.toLowerCase() == bsts.toLowerCase()) {
                cgstPercentage = gstPercentage / 2;
                sgstPercentage = gstPercentage / 2;
                cgstAmt = (amountBeforeTax + pnfamnt + frghtamnt) * cgstPercentage / 100;
                sgstAmt = (amountBeforeTax + pnfamnt + frghtamnt) * sgstPercentage / 100;
            }
            else {
                igstPercentage = gstPercentage;
                igstAmt = (amountBeforeTax + pnfamnt + frghtamnt) * igstPercentage / 100;
            }
            totl_cgst += cgstAmt;
            totl_sgst += sgstAmt;
            totl_igst += igstAmt;
            i++;
        });

        $(".totamnt").val(ReplaceNumberWithCommas(tamountbeforetax.toFixed(2)));
        $(".cgstamnt").val(ReplaceNumberWithCommas(totl_cgst.toFixed(2)));
        $(".sgstamnt").val(ReplaceNumberWithCommas(totl_sgst.toFixed(2)));
        $(".igstamnt").val(ReplaceNumberWithCommas(totl_igst.toFixed(2)));

        $(".totamntgst").val(ReplaceNumberWithCommas((totl_cgst + totl_igst + totl_sgst).toFixed(2)));

        $(".netamnt").val(ReplaceNumberWithCommas((tamountbeforetax + totl_cgst + totl_igst + totl_sgst + pnfamnta + frghtamnta).toFixed(2)));
        $(".quot").show();
    }
});

function ReplaceNumberWithCommas(yourNumber) {
    //Seperates the components of the number
    var components = yourNumber.toString().split(".");
    //Comma-fies the first part
    components[0] = components[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //Combines the two sections
    return components.join(".");
}

$('#chksameadd').change(function () {
    if ($(this).is(":checked")) {
        $("#QuotationModels_IsShippingAddressSame").val("1");
        $(".shpname").val('');
        $(".shpadd").val('');
        $(".shpcty").val('');
        $(".shpsts").val('');
        $(".shppin").val('');
        $(".shpcnt").val('');
        $(".shpgst").val('');
        $(".shppan").val('');
        $(".shpname").prop('readonly', true);
        $(".shpadd").prop('readonly', true);
        $(".shpcty").prop('readonly', true);
        $(".shpsts").prop('readonly', true);
        $(".shppin").prop('readonly', true);
        $(".shpcntct").prop('readonly', true);
        $(".shpgst").prop('readonly', true);
        $(".shppan").prop('readonly', true);
    } else {
        $("#QuotationModels_IsShippingAddressSame").val("0");
        $(".shpname").val('');
        $(".shpadd").val('');
        $(".shpcty").val('');
        $(".shpsts").val('');
        $(".shppin").val('');
        $(".shpcnt").val('');
        $(".shpgst").val('');
        $(".shppan").val('');
        $(".shpname").prop('readonly', false);
        $(".shpadd").prop('readonly', false);
        $(".shpcty").prop('readonly', false);
        $(".shpsts").prop('readonly', false);
        $(".shppin").prop('readonly', false);
        $(".shpcntct").prop('readonly', false);
        $(".shpgst").prop('readonly', false);
        $(".shppan").prop('readonly', false);
    }
});

$('.quot').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".quot").attr("disabled", true);
    $(".quot").hide();
    e.preventDefault();
    var lnArr = new Array();
    var enqtype = $('.enqtype').val();
    var vbid = $('.vba').val();
    var bbid = $('.bba').val();
    var issame = $('#QuotationModels_IsShippingAddressSame').val();
    var shpname = $('.shpname').val();
    var shpadd = $('.shpadd').val();
    var shpcty = $('.shpcty').val();
    var shpsts = $('.shpsts').val();
    var shppin = $('.shppin').val();
    var shpcntct = $('.shpcntct').val();
    var shpgst = $('.shpgst').val();
    var shppan = $('.shppan').val();

    var pnfamnt = $('.pnfamnt').val().replace(/,/g, "");
    var frghtamnt = $('.frghtamnt').val().replace(/,/g, "");
    var totamnt = $('.totamnt').val().replace(/,/g, "");
    var cgstamnt = $('.cgstamnt').val().replace(/,/g, "");
    var sgstamnt = $('.sgstamnt').val().replace(/,/g, "");
    var igstamnt = $('.igstamnt').val().replace(/,/g, "");
    var totamntgst = $('.totamntgst').val().replace(/,/g, "");
    var netamnt = $('.netamnt').val().replace(/,/g, "");

    var tcond = $('.tcond').val();
    var ldtime = $('.ldtime').val();
    var instk = $('.instk').val();
    var pfchrg = $('.pfchrg').val();
    var pterms = $('.pterms').val();
    var frtrms = $('.frtrms').val();
    var motrns = $('.motrns').val();
    var wrnty = $('.wrnty').val();
    var valofquot = $('.valofquot').val();
    var misc = $('.misc').val();
    var remark = $('.remark').val();
    var lmremark = $('.lmremark').val();

    if (vbid !== "" && bbid !== "") {
        $(".tbl tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var senqpid = $(tds[1]).find('.senqpid').val();
            var svunitprc = $(tds[5]).find('.svunitprc').val();
            var sdisc = $(tds[6]).find('.sdisc').val();
            var indleadtime = $(tds[9]).find('.indleadtime').val();
            if (sdisc === "") {
                sdisc = 0;
            }

            if (senqpid !== "" && svunitprc !== "" && svunitprc !== "0") {
                var lin = {
                    EnqPId: senqpid,
                    QuotePrice: svunitprc,
                    IndLeadTime: indleadtime,
                    Discount: sdisc,
                    EnqType: enqtype,
                    CustomerBillingAddress: vbid,
                    BuyerBillingAddress: bbid,
                    IsShippingAddressSame: issame,
                    BuyerShippingName: shpname,
                    BuyerShippingAddress: shpadd,
                    BuyerShippingCity: shpcty,
                    BuyerShippingState: shpsts,
                    BuyerShippingPincode: shppin,
                    BuyerShippingContact: shpcntct,
                    BuyerShippingGST: shpgst,
                    BuyerShippingPAN: shppan,
                    PNFAmount: parseFloat(pnfamnt),
                    FreightAmount: parseFloat(frghtamnt),
                    TotalAmount: parseFloat(totamnt),
                    CGSTAmount: parseFloat(cgstamnt),
                    SGSTAmount: parseFloat(sgstamnt),
                    IGSTAmount: parseFloat(igstamnt),
                    TotalAmountGST: parseFloat(totamntgst),
                    NetAmount: parseFloat(netamnt),
                    TACondition: tcond,
                    LeadTime: ldtime,
                    InStock: instk,
                    PackFwdCharges: pfchrg,
                    PaymentTerms: pterms,
                    FrieghtTerms: frtrms,
                    ModeOfTransport: motrns,
                    Warranty: wrnty,
                    ValidityOfQuot: valofquot,
                    Misc: misc,
                    Remarks: remark,
                    LMRemarks: lmremark,
                };
                lnArr.push(lin);
            }
        });

        if (lnArr.length > 0) {
            var enq = JSON.stringify(lnArr);

            $.ajax({
                url: "/Admin/UpdateQuotation",
                dataType: "json",
                data: "{'enq': '" + enq + "' }",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.error === "") {
                        location.reload();
                    }
                    else {
                        alert(result.error);
                    }
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        }
        else {
            alert("Please add atleast 1 line item.");
        }
    }
    else {
        alert("Please fill the required fields.");
    }
    $(".quot").attr("disabled", false);
});


$('.quotapprove').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".quotapprove").attr("disabled", true);
    $(".quotapprove").hide();
    e.preventDefault();
    var rows_selected = $("#tblQuotationApprove tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[5].innerText);
    });

    if (list.length > 0) {
        var enqIds = JSON.stringify(list);
        $.ajax({
            url: "/Admin/ApproveQuotation",
            dataType: "json",
            data: "{'enqIds': '" + enqIds + "'}",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    location.reload();
                }
                else {
                    alert(result.error);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please select atleast one po.");
    }
});


$('.quotnotapprove').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".quotnotapprove").attr("disabled", true);
    $(".quotnotapprove").hide();
    e.preventDefault();
    var rows_selected = $("#tblQuotationApprove tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[6].innerText);
    });
    var napprmk = $(".napprmk").val();
    if (list.length > 0) {
        if (napprmk != "") {
            var quotNos = JSON.stringify(list);
            $.ajax({
                url: "/Admin/QuotationNotApprovedList",
                dataType: "json",
                data: "{'quotNos': '" + quotNos + "','napprmk': '" + napprmk + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.error === "") {
                        location.reload();
                    }
                    else {
                        alert(result.error);
                    }
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        } else {
            alert("Please enter remarks");
            $(this).find(':submit').attr('disabled', 'disabled');
            $(".quotnotapprove").attr("disabled", true);
            $(".quotnotapprove").show();
        }
    }
    else {
        alert("Please select atleast one po.");
    }
});

$('.enqregret').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".enqregret").attr("disabled", true);
    $(".enqregret").hide();
    e.preventDefault();
    var rows_selected = $("#tblsourced tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[5].innerText);
    });
    var regrmk = $(".regrmk").val();
    if (list.length > 0) {
        if (regrmk != "") {
            var enqNos = JSON.stringify(list);
            $.ajax({
                url: "/Admin/EnquiryRegretList",
                dataType: "json",
                data: "{'enqNos': '" + enqNos + "','regrmk': '" + regrmk + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.error === "") {
                        location.reload();
                    }
                    else {
                        alert(result.error);
                    }
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        } else {
            alert("Please enter remarks");
            $(".enqregret").attr("disabled", false);
            $(".enqregret").show();
        }
    }
    else {
        alert("Please select atleast one enq.");
        $(".enqregret").attr("disabled", false);
        $(".enqregret").show();
    }
});

$('.enqhold').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".enqhold").attr("disabled", true);
    $(".enqhold").hide();
    e.preventDefault();
    var rows_selected = $("#tblsourced tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[5].innerText);
    });
    var regrmk = $(".regrmk").val();
    if (list.length > 0) {
        if (regrmk != "") {
            var enqNos = JSON.stringify(list);
            $.ajax({
                url: "/Admin/EnquiryHoldList",
                dataType: "json",
                data: "{'enqNos': '" + enqNos + "','regrmk': '" + regrmk + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.error === "") {
                        location.reload();
                    }
                    else {
                        alert(result.error);
                    }
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        } else {
            alert("Please enter remarks");
            $(".enqhold").attr("disabled", false);
            $(".enqhold").show();
        }
    }
    else {
        alert("Please select atleast one enq.");
        $(".enqhold").attr("disabled", false);
        $(".enqhold").show();
    }
});

$('.wcrapprove').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".wcrapprove").attr("disabled", true);
    e.preventDefault();
    var rows_selected = $("#tblWeeklyCustomerReport tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes

    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        var lin = {
            CustomerId: row.cells[2].innerText,
            EnquiryReceived: row.cells[4].innerText,
            EnquiryLineItems: row.cells[5].innerText,
            QuotedEnquiry: row.cells[6].innerText,
            QuotedLineItems: row.cells[7].innerText,
            QuotedValue: row.cells[8].innerText,
            TAT: row.cells[9].innerText,
            POReceived: row.cells[10].innerText,
            POValue: row.cells[11].innerText,
            Delivery: row.cells[12].innerText.split('%')[0] + ""
        };
        list.push(lin);
    });

    if (list.length > 0) {
        var cstIds = JSON.stringify(list);
        $.ajax({
            url: "/Admin/ApproveWeeklyCustomerReport",
            dataType: "json",
            data: "{'cstIds': '" + cstIds + "'}",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.error === "") {
                    location.reload();
                }
                else {
                    alert(result.error);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
    else {
        alert("Please select atleast one customer.");
        $(this).find(':submit').attr('disabled', false);
        $(".wcrapprove").attr("disabled", false);
    }
});

$('.enqstssubmit').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $(".enqstssubmit").attr("disabled", true);
    $(".enqstssubmit").hide();
    e.preventDefault();
    var rows_selected = $("#tblEnquiryStatus tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[4].innerText);
    });
    var stsrmk = $(".stsrmk").val();
    var enqsts = $(".enqsts").val();
    if (list.length > 0) {
        if (stsrmk != "" && enqsts != "--Select Status--") {
            var quotNos = JSON.stringify(list);
            $.ajax({
                url: "/Admin/UpdateEnquiryStatusList",
                dataType: "json",
                data: "{'quotNos': '" + quotNos + "','stsrmk': '" + stsrmk + "','enqsts': '" + enqsts + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.error === "") {
                        location.reload();
                    }
                    else {
                        alert(result.error);
                    }
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        } else {
            alert("Please enter remarks");
            $(this).find(':submit').attr('disabled', 'disabled');
            $(".enqstssubmit").attr("disabled", true);
            $(".enqstssubmit").show();
        }
    }
    else {
        alert("Please select atleast one po.");
    }
});