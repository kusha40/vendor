
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
        "searching": false,
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
        "searching": false,
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
            { 'targets': 16, 'width': '40', 'orderable': false }       //POAssingTo
        ],
        select: {
            style: 'multi',
        },
        "scrollX": true,
        "paging": false,
        "searching": false,
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
        "searching": false,
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
        "searching": false,
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
        "searching": false,
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
        "searching": false,
        "info": false
    });
    tblPOApproved.on('order.dt search.dt', function () {
        tblPOApproved.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblPOApproved.cell(cell).invalidate('dom');
        });
    }).draw();

    var tblpodetails = $('#tblpodetails').DataTable({
        "columnDefs": [
            { 'targets': 0, 'orderable': false },       //SNo
            { 'targets': 1, 'orderable': false },       //OrderDate
            { 'targets': 2, 'orderable': false },       //CustomerName
            { 'targets': 3, 'orderable': false },       //POId
            { 'targets': 4, 'orderable': false },       //PONumber
            { 'targets': 5, 'orderable': false },       //Vendor
            { 'targets': 6, 'orderable': false },       //VendorPrice
            { 'targets': 7, 'orderable': false },       //Price
            { 'targets': 8, 'orderable': false },       //Margin
            { 'targets': 9, 'orderable': false },       //Download
            { 'targets': 10, 'orderable': false },      //Download
        ],
        "paging": false,
        "searching": false,
        "info": false,
        "scrollX": true
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
            }
            else {
                $(".noofdays").prop('readonly', true);
            }
        }
        else {
            $(".noofdays").prop('readonly', true);
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
        tmpposrc.Price = row.cells[10].innerText;

        tmpposrc.GST = row.cells[13].innerText;

        $('#tblposource').find('tbody').append(
            "<tr>" +
            "<td class='w-10'> <input type='text' id='PurchaseOrdersModelList_CustomerName_" + inc + "' name='PurchaseOrdersModelList_CustomerName_" + inc + "' value='" + tmpposrc.CustomerName + "' disabled required='True' class='form-control scstname m-b-0 bg-gray' type='text'></td>" +
            "<td class='w-10'> <input type='text' id='PurchaseOrdersModelList_PONumber_" + inc + "' name='PurchaseOrdersModelList_PONumber_" + inc + "' value='" + tmpposrc.PONumber + "' class='form-control spono m-b-0 bg-gray' disabled  type='text' /></td> " +
            "<td class='w-10'> <input type='text' id='PurchaseOrdersModelList_POPId_" + inc + "' name='PurchaseOrdersModelList_POPId_" + inc + "' value='" + tmpposrc.POPId + "' disabled class='form-control spopid m-b-0 bg-gray'  type='text' /></td>" +
            "<td class='w-15'> <input type='text' id='PurchaseOrdersModelList_Product_" + inc + "' name='PurchaseOrdersModelList_Product_" + inc + "' value='" + tmpposrc.Product + "' disabled class='form-control spopid m-b-0 bg-gray'  type='text' /></td>" +
            "<td class='w-8'> <input type='text' id='PurchaseOrdersModelList_Price_" + inc + "' name='PurchaseOrdersModelList_Price_" + inc + "' value='" + tmpposrc.Price + "' disabled class='form-control spoprice m-b-0 bg-gray'  type='text' /></td>" +
            "<td class='w-6'> <input type='text' id='PurchaseOrdersModelList_Quantity_" + inc + "' name='PurchaseOrdersModelList_Quantity_" + inc + "' value='" + tmpposrc.Quantity + "' disabled class='form-control spoqty m-b-0 bg-gray'  type='text' /></td>" +
            "<td class='w-4'> <input type='text' id='PurchaseOrdersModelList_GST_" + inc + "' name='PurchaseOrdersModelList_GST_" + inc + "' value='" + tmpposrc.GST + "' class='form-control spogst onlynumdec m-b-0'  type='text' /></td>" +
            "<td class='w-10'> <input type='text' id='PurchaseOrdersModelList_EnqId_" + inc + "' name='PurchaseOrdersModelList_EnqId_" + inc + "' value='' disabled class='form-control senqid m-b-0 bg-gray'  type='text' /></td>" +
            "<td class='w-15'> <input type='text' id='PurchaseOrdersModelList_VendorId_" + inc + "' name='PurchaseOrdersModelList_VendorId_" + inc + "' placeholder='Vendor Name' value='' class='form-control svenid m-b-0'  type='text' /></br><input type='text' id='PurchaseOrdersModelList_VendorPrice_" + inc + "' name='PurchaseOrdersModelList_VendorPrice_" + inc + "' value='' placeholder='Vendor Price' class='form-control svenprc svenprcmrg onlynumdec m-b-0 w-70 float-left' /><input type='text' id='PurchaseOrdersModelList_Margin_" + inc + "' name='PurchaseOrdersModelList_Margin_" + inc + "' value='' disabled placeholder='Margin' class='form-control onlynumdec posmarg m-b-0 w-30' /></td>" +
            "<td class='w-15'> <input type='text' id='PurchaseOrdersModelList_LastVendorId_" + inc + "' name='PurchaseOrdersModelList_LastVendorId_" + inc + "' disabled placeholder='Last Vendor Name' value='' class='form-control slvenid m-b-0 bg-gray' /></br><input type='text' id='PurchaseOrdersModelList_LastVendorPrice_" + inc + "' disabled name='PurchaseOrdersModelList_LastVendorPrice_" + inc + "' value='' placeholder='Last Vendor Price' class='form-control slvenprc m-b-0 bg-gray' /></td>" +
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

//$(document).on('blur', '.senqid', function () {
//    var curRow = $(this).closest("tr");
//    var enqid = curRow.find(".senqid").val();
//    var cstName = curRow.find(".scstname").val();
//    //e.preventDefault();
//    if (enqid !== "") {
//        $.ajax({
//            url: '/Admin/GetVendorPrice',
//            data: "{'enqid':'" + enqid + "'}",
//            type: "POST",
//            dataType: "JSON",
//            contentType: "application/json; charset=utf-8",
//            success: function (res) {
//                if (res[0] === undefined || res[0] === "") {
//                    curRow.find("td:eq(8)").find(".svenid").val("");
//                    curRow.find("td:eq(8)").find(".svenprc").val("");
//                    curRow.find("td:eq(9)").find(".slvenid").val("");
//                    curRow.find("td:eq(9)").find(".slvenprc").val("");
//                    alert("Vendor is not registered with us Please register and then enter enquiry Id.");
//                }
//                else {
//                    if (res[0].CustomerName === cstName) {
//                        if (res[0].Status == "1") {
//                            curRow.find("td:eq(8)").find(".svenid").val(res[0].VendorName);
//                            curRow.find("td:eq(8)").find(".svenprc").val(res[0].VendorPrice);
//                            curRow.find("td:eq(9)").find(".slvenid").val(res[0].VendorName);
//                            curRow.find("td:eq(9)").find(".slvenprc").val(res[0].VendorPrice);
//                        }
//                        else {
//                            curRow.find("td:eq(8)").find(".svenid").val("");
//                            curRow.find("td:eq(8)").find(".svenprc").val("");
//                            curRow.find("td:eq(9)").find(".slvenid").val(res[0].VendorName);
//                            curRow.find("td:eq(9)").find(".slvenprc").val(res[0].VendorPrice);
//                        }
//                    }
//                    else {
//                        alert("This enquiry id is not quoted with this customer");
//                        curRow.find("td:eq(7)").find(".senqid").val("");
//                        curRow.find("td:eq(7)").find(".senqid").focus();
//                    }
//                }
//            },
//            error: function (e) {
//                alert("Failed! Please try again. ");
//            }
//        });
//    }
//    else {
//        curRow.find("td:eq(8)").find(".svenid").val("");
//        curRow.find("td:eq(8)").find(".svenprc").val("");
//        curRow.find("td:eq(9)").find(".slvenid").val("");
//        curRow.find("td:eq(8)").find(".slvenprc").val("");
//    }
//});

//Get Margin
$(document).on('blur', '.svenprcmrg', function () {
    var curRow = $(this).closest("tr");
    var venprc = curRow.find(".svenprcmrg").val();
    var slprc = curRow.find(".spoprice").val();
    //e.preventDefault();
    if (venprc !== "" && venprc !== "0") {
        var mrg = (parseFloat(slprc) - parseFloat(venprc)) * 100 / parseFloat(slprc);
        curRow.find("td:eq(8)").find(".posmarg").val(mrg.toFixed(2)+"%");
    }
    else {
        curRow.find("td:eq(8)").find(".posmarg").val("");
    }
});
//Get Margin

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
        if (rcvqty !== "" && rcvqty !== "0") {
            var untprc = parseFloat(vprc) / parseFloat(qty);
            var tot = parseFloat(untprc) * parseFloat(rcvqty);
            var totwtax = parseFloat(tot) + (parseFloat(tot) * parseFloat(gst) / 100);

            curRow.find(".tot").html(tot);
            curRow.find(".totwtax").html(totwtax);
        }
    }
    else {
        curRow.find(".ircvqty").val(remqty);
        curRow.find(".tot").html(0);
        curRow.find(".totwtax").html(0);
        alert("Receive Quantity is greater than remaining Quantity");
    }
});


//Add PO sourced to temp table   
function AddTempPOGenerate() {
    var rows_selected = $("#tblPOGenerate tbody tr.selected");
    var list = new Array();
    var inc = 1;
    var venid = "";
    var pIdNo = "";
    $("#tblpogen > tbody > tr").remove();
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        var index = $("#tblPOGenerate tbody tr.selected").index(this);
        if (index == 0) {
            pIdNo = row.cells[4].innerText;
        }
        var peid = row.cells[4].innerText;
        if (pIdNo != "") {
            if (pIdNo == peid) {
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
        $('#posubmit').show();
    } else {
        //$('#SubmitMoviesBtn').attr("disabled", "disabled");
        $('#posubmit').hide();
    }
}
//Add PO item to temp table  

$("#pogen").hide();
$('#pocalculate').on('click', function (e) {
    e.preventDefault();
    var vba = $('.vba option:selected').text();
    var bba = $('.bba option:selected').text();
    if (vba != "" && vba != '--Select Vendor Billing Address--' && bba != "" && bba != '--Select Buyer Billing Address--') {
        var vsts = vba.split('-').pop();
        var bsts = bba.split('-').pop();

        var tamountbeforetax = 0, totl_cgst = 0, totl_sgst = 0, totl_igst = 0, totalTax = 0, netAmount = 0;
        var gstPercentage = 0, cgstPercentage = 0, sgstPercentage = 0, igstPercentage = 0, cgstAmt = 0, igstAmt = 0, sgstAmt = 0;
        // Iterate over all selected checkboxes
        $("#tblpogen tbody tr").each(function () {
            var tds = $(this).find("td");

            var amountBeforeTax = parseFloat($(tds[8]).find('.svenprc').val());
            tamountbeforetax += parseFloat(amountBeforeTax);
            var gstPercentage = parseFloat($(tds[9]).find('.svengst').val());
            if (vsts.toLowerCase() == bsts.toLowerCase()) {
                cgstPercentage = gstPercentage / 2;
                sgstPercentage = gstPercentage / 2;
                cgstAmt = amountBeforeTax * cgstPercentage / 100;
                sgstAmt = amountBeforeTax * sgstPercentage / 100;
            }
            else {
                igstPercentage = gstPercentage;
                igstAmt = amountBeforeTax * igstPercentage / 100;
            }
            totl_cgst += cgstAmt;
            totl_sgst += sgstAmt;
            totl_igst += igstAmt;
        });

        $(".totamnt").val(ReplaceNumberWithCommas(tamountbeforetax.toFixed(2)));
        $(".cgstamnt").val(ReplaceNumberWithCommas(totl_cgst.toFixed(2)));
        $(".sgstamnt").val(ReplaceNumberWithCommas(totl_sgst.toFixed(2)));
        $(".igstamnt").val(ReplaceNumberWithCommas(totl_igst.toFixed(2)));

        $(".totamntgst").val(ReplaceNumberWithCommas((totl_cgst + totl_igst + totl_sgst).toFixed(2)));

        $(".netamnt").val(ReplaceNumberWithCommas((tamountbeforetax + totl_cgst + totl_igst + totl_sgst).toFixed(2)));
        $("#pogen").show();
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
    $(".poassign").attr("disabled", true);
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

$('#posubmit').on('click', function (e) {
    $(this).find(':submit').attr('disabled', 'disabled');
    $("#posubmit").attr("disabled", true);
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
    $("#posubmit").attr("disabled", false);
});

$('.posousubmit').on('click', function (e) {
    $(".posousubmit").attr("disabled", true);
    $(this).find(':submit').attr('disabled', 'disabled');
    e.preventDefault();
    var lnArr = new Array();
    $(".tbl tbody tr").each(function () {
        var tds = $(this).find("td");
        //you could use the Find method to find the texbox or the dropdownlist and get the value.
        var spopid = $(tds[2]).find('.spopid').val();
        var spogst = $(tds[6]).find('.spogst').val();
        var senqid = $(tds[7]).find('.senqid').val();
        var svenid = $(tds[8]).find('.svenid').val();
        var svenprc = $(tds[8]).find('.svenprc').val();
        var slvenid = $(tds[9]).find('.slvenid').val();
        var slvenprc = $(tds[9]).find('.slvenprc').val();
        if (spopid !== "" /*&& senqid !== ""*/ && spogst != "" && svenid !== "" && svenprc !== "" && svenprc !== "0"
            /*&& slvenid !== "" && slvenprc !== "0" && slvenprc !== ""*/) {
            var lin = {
                POPId: spopid,
                EnqId: senqid,
                VendorId: svenid,
                VendorPrice: parseFloat(svenprc),
                //LastVendorId: slvenid,
                //LastVendorPrice: parseFloat(slvenprc),
                GST: parseFloat(spogst)
            };
            lnArr.push(lin);
        }
    });

    if (lnArr.length > 0) {
        var pos = JSON.stringify(lnArr);

        $.ajax({
            url: "/Admin/UpdatePurchaseOrderSourced",
            dataType: "json",
            data: "{'pos': '" + pos + "'}",
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
    $(".posousubmit").attr("disabled", false);
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

$('#pogen').on('click', function (e) {
    $("#pogen").attr("disabled", true);
    $(this).find(':submit').attr('disabled', 'disabled');
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
            var svenprc = $(tds[8]).find('.svenprc').val();

            if (spopid !== "" && svenprc !== "" && svenprc !== "0") {
                var lin = {
                    POPId: spopid,
                    VendorPrice: svenprc,
                    POType: ptype,
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
        }
    }
    else {
        alert("Please fill the required fields.");
    }
    $("#pogen").attr("disabled", false);
});

$('#poapprove').on('click', function (e) {
    $("#poapprove").attr("disabled", true);
    e.preventDefault();
    var rows_selected = $("#tblPOApprove tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[5].innerText);
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


$('#prapprove').on('click', function (e) {
    $("#prapprove").attr("disabled", true);
    e.preventDefault();
    var rows_selected = $("#tblPRApproval tbody tr.selected");
    var list = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, row) {
        // Create a hidden element
        list.push(row.cells[6].innerText);
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
    $("#mrsubmit").attr("disabled", true);
    $(this).find(':submit').attr('disabled', 'disabled');
    e.preventDefault();
    var fUpload = $("#InvStockModels_VendorInvoice").get(0);
    var files = fUpload.files;
    var fileData = new FormData();
    var list = new Array();
    // Iterate over all selected checkboxes
    $(".tbl tbody tr").each(function () {
        var tds = $(this).find("td");
        //you could use the Find method to find the texbox or the dropdownlist and get the value.
        var popId = $(tds[1]).html();
        var qty = parseFloat($(tds[6]).find('.ircvqty').val());

        if (popId !== "" && qty !== "" && qty !== "0" && files.length > 0) {
            fileData.append(files[0].name, files[0]);
            fileData.append('POPId', popId);
            var lin = {
                POPId: popId,
                Quantity: qty
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