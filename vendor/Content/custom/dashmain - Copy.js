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

/* General Start */

$(document).ready(function () {
    $('.onlynumdec').keypress(function (event) {
        return isNumber(event, this);
    });

    $('.onlynumhyphen').keypress(function (event) {
        return isNumberHyp(event, this);
    });

    //$('#tblpurordline').on('blur', '.quantity', function () {
    //    AddNewRow(this, "item-data", "tblpurordline");
    //});

    $(".addnewrow").blur(function (event) {
        var tblId = $(this).closest('table').attr('id');
        AddNewRow(this, "item-data", tblId);
    });

    $(document).on('blur', '.iunitprice', function () {
        var currentRow = $(this).closest("tr");
        var uc = currentRow.find("td:eq(3)").find("input").val();
        var qt = currentRow.find("td:eq(4)").find("input").val();
        if (uc !== "" && qt !== "") {
            var amnt = uc * qt;
            currentRow.find("td:eq(5)").find("input").val(amnt);
        }
        else {
            currentRow.find("td:eq(5)").find("input").val("");
        }
    });

    $(document).on('blur', '.iquantity', function () {
        var currentRow = $(this).closest("tr");
        var uc = currentRow.find("td:eq(3)").find("input").val();
        var qt = currentRow.find("td:eq(4)").find("input").val();
        if (uc !== "" && qt !== "") {
            var amnt = uc * qt;
            currentRow.find("td:eq(5)").find("input").val(amnt);
        }
        else {
            currentRow.find("td:eq(5)").find("input").val("");
        }
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

    $(".vendorcode").blur(function (event) {
        var code = $(this).val();
        if (code !== "") {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetVendorByCode",
                data: { code: code },
                dataType: "json",
                success: function (res) {
                    if (res.length > 0) {
                        $(".vendorname").val(res[0].VendorName);
                        $(".vendorname").closest("div").find("input").focus();
                    }
                    else {
                        $(".vendorcode").val("");
                        $(".vendorname").val("");
                        $(".vendorcode").closest("div").find("input").focus();
                    }
                },

                error: function () {
                    alert("Failed to get the vendor name.");
                    $(".vendorcode").val("");
                    $(".vendorname").val("");
                    $(".vendorcode").closest("div").find("input").focus();
                }
            });
        }
    });

    $(".itemcode").blur(function (event) {
        var code = $(this).val();
        if (code !== "") {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetItemByCode",
                data: { code: code },
                dataType: "json",
                success: function (res) {
                    if (res.length > 0) {
                        $(".itemname").val(res[0].ItemName);
                    }
                    else {
                        $(".itemcode").val("");
                        $(".itemname").val("");
                        $('.itemcode').closest("div").find("input").focus();
                    }
                },

                error: function () {
                    alert("Failed to get the item name.");
                    $(".itemname").val("");
                }
            });
        }
    });

    $(".empcode").blur(function (event) {
        var code = $(this).val();
        if (code !== "") {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetEmployeeByCode",
                data: { code: code },
                dataType: "json",
                success: function (res) {
                    if (res.length > 0) {
                        $(".empname").val(res[0].EmpName);
                        $(".empname").closest("div").find("input").focus();
                    }
                    else {
                        $(".empcode").val("");
                        $(".empname").val("");
                        $(".empcode").closest("div").find("input").focus();
                    }
                },

                error: function () {
                    alert("Failed to get the vendor name.");
                    $(".empcode").val("");
                    $(".empname").val("");
                    $(".empcode").closest("div").find("input").focus();
                }
            });
        }
    });

    $(document).on("blur", ".iitemcode", function (event) {
        var currentRow = $(this).closest("tr");
        var code = currentRow.find("td").find("input.iitemcode").val();
        if (code) {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetItemByCode",
                data: { code: code },
                dataType: "json",
                success: function (res) {
                    if (res.length > 0) {
                        currentRow.find("td").find(".iitemname").val(res[0].ItemName);
                        currentRow.find("td").find(".iunitprice").val(res[0].UnitPrice);
                        currentRow.find("td").find("input.iitemname").focus();
                    }
                    else {
                        currentRow.find("td").find(".iitemname").val("");
                        currentRow.find("td").find(".iunitprice").val("");
                        currentRow.find("td").find("input.iitemcode").focus();
                    }
                }
            });
        }
    });

   
    $('#sel_item_list').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50px', 'searchable': false, 'orderable': false, 'className': 'select-checkbox' },   //Select.
            { 'targets': 1, 'width': '50px', 'searchable': false, 'orderable': false },  //Id Hidden
            { 'targets': 2 },       //ItemCode
            { 'targets': 3 },       //ItemName
            { 'targets': 4 },       //Description1
            { 'targets': 5 },       //UnitOfMeasure
            { 'targets': 6 }        //UnitPrice
        ],
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        "order": [2, 'asc'],
        "paging": true
    });

    $('#sel_item_list tbody').on('click', 'tr', function () {
        $('#sel_item_list tbody tr').removeClass("selected");
        $(this).toggleClass('selected');
    });

    $("#sel_item_list_filter input").keypress(function () {
        $('#sel_item_list tbody tr').removeClass("selected");
    });

    $("#sel_item_filter input").keypress(function () {
        $('#sel_item tbody tr').removeClass("selected");
    });

    $('#sel_item').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50px', 'searchable': false, 'orderable': false, 'className': 'select-checkbox' },   //Select.
            { 'targets': 1, 'width': '50px', 'searchable': false, 'orderable': false },  //Id Hidden
            { 'targets': 2 },       //ItemCode
            { 'targets': 3 },       //ItemName
            { 'targets': 4 },       //Description1
            { 'targets': 5 }       //UnitPrice
        ],
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        "order": [2, 'asc'],
        "paging": true
    });

    $('#sel_item tbody').on('click', 'tr', function () {
        $('#sel_item tbody tr').removeClass("selected");
        $(this).toggleClass('selected');
    });

    $('.tbl tbody').on('click', 'tr', function () {
        $('.tbl tbody tr').removeClass("selected");
        $(this).toggleClass('selected');
    });

    $('.pftbl tbody').on('click', 'tr', function () {
        $('.pftbl tbody tr').removeClass("selected");
        $(this).toggleClass('selected');
    });

    $('#btn_SelItem').click(function () {
        var tbl = $('#sel_item_list').DataTable();
        var encitemcode = $.map(tbl.rows('.selected').data(), function (item) {
            return item[2];
        });
        var encitemname = $.map(tbl.rows('.selected').data(), function (item) {
            return item[3];
        });
        var unitprice = $.map(tbl.rows('.selected').data(), function (item) {
            return item[5];
        });

        var parser = new DOMParser;
        var domitemcode = parser.parseFromString(
            '<!doctype html><body>' + encitemcode,
            'text/html');
        var decitemcode = domitemcode.body.textContent;

        var domitemname = parser.parseFromString(
            '<!doctype html><body>' + encitemname,
            'text/html');
        var decitemname = domitemname.body.textContent;

        $('.tbl tbody tr.selected').find('.iitemcode').val(decitemcode);
        $('.tbl tbody tr.selected').find('.iitemname').val(decitemname);
        $('.tbl tbody tr.selected').find('.iunitprice').val(unitprice);
        $('.tbl tbody tr.selected').find('.iquantity').val("");
        $('.tbl tbody tr.selected').find('.iamount').val("");
        $('.tbl tbody tr.selected').find('input.iitemcode').focus();
        $('#sel_item_list tbody tr').removeClass("selected");
    });

    $('#btn_SelItemForFrm').click(function () {
        var tbl = $('#sel_item').DataTable();
        var encitemcode = $.map(tbl.rows('.selected').data(), function (item) {
            return item[2];
        });
        var encitemname = $.map(tbl.rows('.selected').data(), function (item) {
            return item[3];
        });

        var parser = new DOMParser;
        var domitemcode = parser.parseFromString(
            '<!doctype html><body>' + encitemcode,
            'text/html');
        var decitemcode = domitemcode.body.textContent;

        var domitemname = parser.parseFromString(
            '<!doctype html><body>' + encitemname,
            'text/html');
        var decitemname = domitemname.body.textContent;

        $('.itemcode').val(decitemcode);
        $('.itemname').val(decitemname);
        $('input.itemname').focus();
        $('#sel_item tbody tr').removeClass("selected");
    });

    var sel_po_list = $('#sel_po_list').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false, 'className': 'select-checkbox' },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Id Hidden
            { 'targets': 2, 'width': '100' },       //Purchase Order
            { 'targets': 3, 'width': '100' },       //Vendor Name
            { 'targets': 4, 'width': '100' },       //Contact
            { 'targets': 5, 'width': '200' }       //Order Date
        ],
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        "order": [3, 'asc'],
        "paging": true
    });

    $('#sel_po_list tbody').on('click', 'tr', function () {
        $('#sel_po_list tbody tr').removeClass('selected');
        //$(':checkbox').each(function () {
        //    this.checked = false;
        //});
        $(this).toggleClass('selected');
    });

    $("#sel_po_list_filter input").keypress(function () {
        $('#sel_po_list tbody tr').removeClass("selected");
    });

    $('#btn_SelPO').click(function () {
        var tbl = $('#sel_po_list').DataTable();
        var selpo = $.map(tbl.rows('.selected').data(), function (item) {
            return item[2];
        });
        $('.ponum').val(selpo.toString());
        $('.ponum').closest("div").find("input").focus();
    });

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

    $('#JobCardPFLineList tbody').on('click', 'tr', function () {
        $('#JobCardPFLineList tbody tr').removeClass('selected');
        $(this).toggleClass('selected');
    });

    var sel_emps_list = $('#sel_emps_list').DataTable({
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

    $(document).on("click", ".empsearch", function (e) {
        var rowid = $(this).data("id").replace(' ', '');
        $("#empsModal").removeData("rid"); //remove
        $("#empsModal").data("rid", rowid); //setter
    });

    $('#btn_SelEmps').click(function () {
        var tbl = $('#sel_emps_list').DataTable();
        var empcode = $.map(tbl.rows('.selected').data(), function (item) {
            return item[2];
        });
        var empname = $.map(tbl.rows('.selected').data(), function (item) {
            return item[3];
        });

        $(".selected .iempscode").val(empcode);
        $(".selected .iempsname").val(empname);
        $('#sel_emps_list tbody tr').removeClass('selected');

        var refid = $('#empsModal').data("rid").replace(' ', '');
        $('#' + refid).val(empcode);
        $('#' + refid).focus();
    });

    //$(".iempsname").on('blur', function () {
    //    var its = $(".iempsname").before($(".btn").attr('id')); 
    //    alert(its);
    //    //$("#spnTest3").before($("<i></i>").text("before() "));
    //    //$('#JobCardPFLineList tbody tr').removeClass('selected');
    //    //$(this).toggleClass('selected');
    //});

    $('#sel_emps_list tbody').on('click', 'tr', function () {
        $(this).toggleClass('selected');
    });

});

/* General End */

/* Master Start */

$(document).ready(function () {

    //UOM table
    var tblUOM = $('#tblUOM').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2 }   //UOMName
        ],
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

    //ItemType table
    var tblItemType = $('#tblItemType').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2 }   //ItemType
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    tblItemType.on('order.dt search.dt', function () {
        tblItemType.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblItemType.cell(cell).invalidate('dom');
        });
    }).draw();
    //ItemType table

    //Item table
    var tblItem = $('#tblItem').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '80' },   //ItemCode
            { 'targets': 3, 'width': '200' },   //ItemName
            { 'targets': 4, 'width': '100' },   //Description1
            { 'targets': 5, 'width': '80' },   //Description2
            { 'targets': 6, 'width': '80' },   //ItemType
            { 'targets': 7, 'width': '80' }   //UOM
        ],
        "scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    tblItem.on('order.dt search.dt', function () {
        tblItem.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblItem.cell(cell).invalidate('dom');
        });
    }).draw();
    //Item table

    //Assembly Step table
    var tblAssemblyStep = $('#tblAssemblyStep').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //PFCode
            { 'targets': 3, 'width': '100' },   //PFName
            { 'targets': 4, 'width': '200' }   //Description
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    tblAssemblyStep.on('order.dt search.dt', function () {
        tblAssemblyStep.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblAssemblyStep.cell(cell).invalidate('dom');
        });
    }).draw();
    //Assembly Step table

    //Grading Step table
    var tblGradingStep = $('#tblGradingStep').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //PFCode
            { 'targets': 3, 'width': '100' },   //PFName
            { 'targets': 4, 'width': '200' }   //Description
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    tblGradingStep.on('order.dt search.dt', function () {
        tblGradingStep.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblGradingStep.cell(cell).invalidate('dom');
        });
    }).draw();
    //Grading Step table

    //Tax table
    var tblTax = $('#tblTax').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //TaxCode
            { 'targets': 3, 'width': '200' },   //Description
            { 'targets': 4, 'width': '100' },   //Tax
            //{ 'targets': 5, 'width': '100' },   //State
            //{ 'targets': 6, 'width': '100' }   //Country
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    tblTax.on('order.dt search.dt', function () {
        tblTax.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblTax.cell(cell).invalidate('dom');
        });
    }).draw();
    //Tax table

    $('#TaxModels_SCTax').on('keypress', function (event) {
        return isNumber(event, this);
    });

    //Discount table
    var Discountlist = $('#Discountlist').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //DiscountCode
            { 'targets': 3, 'width': '100' },   //Discount (%)
            { 'targets': 4, 'width': '200' },   //Description1
            { 'targets': 5, 'width': '200' }    //Description2
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    Discountlist.on('order.dt search.dt', function () {
        Discountlist.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            Discountlist.cell(cell).invalidate('dom');
        });
    }).draw();
    //Discount table

    $('#DiscountModels_Disc').on('keypress', function (event) {
        return isNumber(event, this);
    });

    //Warehouse table
    var tblWarehouse = $('#tblWarehouse').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //WarehouseCode
            { 'targets': 3, 'width': '150' },   //WarehouseName
            { 'targets': 4, 'width': '100' },   //Incharge
            { 'targets': 5, 'width': '100' },   //Contact1
            { 'targets': 6, 'width': '100' },   //Contact2
            { 'targets': 7, 'width': '100' },  //Address1
            { 'targets': 8, 'width': '120' }   //Address2
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

    //Grading Range Table

    var grdrange = $('#grdrange').DataTable({
        "paging": true,
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1 },   //Action
            { 'targets': 2 }   //Range
        ]
        //"order": [2, 'asc']
    });

    grdrange.on('order.dt search.dt', function () {
        grdrange.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            grdrange.cell(cell).invalidate('dom');
        });
    }).draw();

    //Grading Range Table


    //Capacity Grading table
    var tblCapacityGrading = $('#tblCapacityGrading').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'searchable': false, 'orderable': false },
            { 'targets': 2 },       //ItemCode
            { 'targets': 3 },       //Description
            { 'targets': 4 }       //Capacity Grading
        ],
        "paging": true
    });
    tblCapacityGrading.on('order.dt search.dt', function () {
        tblCapacityGrading.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblCapacityGrading.cell(cell).invalidate('dom');
        });
    }).draw();
    //Capacity Grading table

    $('#CapacityGradingModels_CapacityGrade').keypress(function (event) {
        return isNumberHyp(event, this);
    });

    $("#CapacityGradingModels_ItemCode").change(function (event) {
        var itemcode = $(this).val();
        if (itemcode !== "") {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetItem",
                data: { itemcode: itemcode },
                dataType: "json",
                success: function (res) {
                    var lst = res;
                    if (lst.length === 0) {
                        $("#CapacityGradingModels_ItemCode").val("");
                    }
                }
            });
        }
    });

    //IR Grading table
    var tblIRGrading = $('#tblIRGrading').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'searchable': false, 'orderable': false },
            { 'targets': 2 },       //ItemCode
            { 'targets': 3 },       //Description
            { 'targets': 4 },       //Capacity Grading
            { 'targets': 5 }        //IRGrade
        ],
        "paging": true
    });
    tblIRGrading.on('order.dt search.dt', function () {
        tblIRGrading.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblIRGrading.cell(cell).invalidate('dom');
        });
    }).draw();
    //IR Grading table

    $('#IRGradingModels_IRGrade').keypress(function (event) {
        return isNumberHyp(event, this);
    });

    $("#IRGradingModels_ItemCode").blur(function (event) {
        var itemcode = $(this).val();
        if (itemcode !== "") {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetIRItem",
                data: { itemcode: itemcode },
                dataType: "json",
                success: function (res) {
                    var lst = res;
                    if (lst.length > 0) {
                        $.ajax({
                            type: "GET",
                            url: "/Dashboard/GetCapacityGrading",
                            data: { itemcode: itemcode },
                            dataType: "json",
                            success: function (res) {
                                var lstb = res;
                                $('#IRGradingModels_IRGrade').val("");
                                $('#IRCapacityGrade').empty();
                                if (lstb.length === 0) {
                                    $('#IRCapacityGrade').attr("required", true);
                                    $('#IRCapacityGrade').attr("disabled", true);
                                }
                                else if (lstb.length === 1) {
                                    $('#IRCapacityGrade').attr("disabled", false);
                                    var options = '<option value="' + lstb[0].CapacityGrade + '">' + lstb[0].CapacityGrade + '</option>';
                                    $('#IRCapacityGrade').append(options);
                                } else if (lstb.length > 1) {
                                    $('#IRCapacityGrade').attr("disabled", false);
                                    var optionm = '<option value="">--Select Capacity Grading--</option>';
                                    $('#IRCapacityGrade').append(optionm);
                                    $('#IRCapacityGrade').attr("required", true);
                                    for (var i = 0; i < lstb.length; i++) {
                                        optionm = '<option value="' + lstb[i].CapacityGrade + '">' + lstb[i].CapacityGrade + '</option>';
                                        $('#IRCapacityGrade').append(optionm);
                                    }
                                }
                                else {
                                    $('#IRCapacityGrade').empty();
                                }
                            }
                        });
                    }
                    else {
                        $("#IRGradingModels_ItemCode").val("");
                        $('#IRCapacityGrade').empty();
                    }
                }
            });
        }
    });

    $("#IRCapacityGrade").change(function (event) {
        var capgrd = $(this).val();
        if (capgrd !== "") {
            $('#IRGradingModels_CapacityGrade').val(capgrd);
        }
    });

    //Voltage Grading table
    var tblVoltageGrading = $('#tblVoltageGrading').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'searchable': false, 'orderable': false },
            { 'targets': 2 },       //ItemCode
            { 'targets': 3 },       //Description
            { 'targets': 4 },       //Capacity Grading
            { 'targets': 5 },        //IRGrade
            { 'targets': 5 }        //VoltageGrade
        ],
        "paging": true
    });
    tblVoltageGrading.on('order.dt search.dt', function () {
        tblVoltageGrading.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblVoltageGrading.cell(cell).invalidate('dom');
        });
    }).draw();
    //Voltage Grading table

    $('#VoltageGradingModels_VoltageGrade').keypress(function (event) {
        return isNumberHyp(event, this);
    });

    $("#VoltageGradingModels_ItemCode").change(function (event) {
        var itemcode = $(this).val();
        if (itemcode !== "") {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetItem",
                data: { itemcode: itemcode },
                dataType: "json",
                success: function (res) {
                    var lst = res;
                    if (lst.length > 0) {
                        $.ajax({
                            type: "GET",
                            url: "/Dashboard/GetCapacityGrading",
                            data: { itemcode: itemcode },
                            dataType: "json",
                            success: function (res) {
                                var lstb = res;
                                $('#VoltageGradingModels_CapacityGrade').val("");
                                $('#VoltageGradingModels_IRGrade').val("");
                                $('#VoltageCapacityGrade').empty();
                                if (lstb.length === 0) {
                                    $('#VoltageCapacityGrade').attr("required", true);
                                    $('#VoltageCapacityGrade').attr("disabled", true);
                                }
                                else if (lstb.length === 1) {
                                    $('#VoltageCapacityGrade').attr("disabled", false);
                                    var options = '<option value="' + lstb[0].CapacityGrade + '">' + lstb[0].CapacityGrade + '</option>';
                                    $('#VoltageCapacityGrade').append(options);
                                    var capgrd = lstb[0].CapacityGrade;
                                    $.ajax({
                                        type: "GET",
                                        url: "/Dashboard/GetIRGrading",
                                        data: { itemcode: itemcode, capgrd: capgrd },
                                        dataType: "json",
                                        success: function (res) {
                                            var lstb = res;
                                            $('#VoltageIRGrade').empty();
                                            if (lstb.length === 0) {
                                                $('#VoltageIRGrade').attr("required", true);
                                                $('#VoltageIRGrade').attr("disabled", true);
                                            }
                                            else if (lstb.length === 1) {
                                                $('#VoltageIRGrade').attr("disabled", false);
                                                var options = '<option value="' + lstb[0].IRGrade + '">' + lstb[0].IRGrade + '</option>';
                                                $('#VoltageIRGrade').append(options);

                                            } else if (lstb.length > 1) {
                                                $('#VoltageIRGrade').attr("disabled", false);
                                                var optionm = '<option value=""> --Select IR Grade-- </option>';
                                                $('#VoltageIRGrade').append(optionm);
                                                $('#VoltageIRGrade').attr("required", true);
                                                for (var i = 0; i < lstb.length; i++) {
                                                    optionm = '<option value="' + lstb[i].IRGrade + '">' + lstb[i].IRGrade + '</option>';
                                                    $('#VoltageIRGrade').append(optionm);
                                                }
                                            }
                                            else {
                                                $('#VoltageIRGrade').empty();
                                            }
                                        }
                                    });
                                } else if (lstb.length > 1) {
                                    $('#VoltageCapacityGrade').attr("disabled", false);
                                    var optionm = '<option value=""> --Select Capacity Grading-- </option>';
                                    $('#VoltageCapacityGrade').append(optionm);
                                    $('#VoltageCapacityGrade').attr("required", true);
                                    for (var i = 0; i < lstb.length; i++) {
                                        optionm = '<option value="' + lstb[i].CapacityGrade + '">' + lstb[i].CapacityGrade + '</option>';
                                        $('#VoltageCapacityGrade').append(optionm);
                                    }
                                }
                                else {
                                    $('#VoltageCapacityGrade').empty();
                                }
                            }
                        });
                    }
                    else {
                        $('#VoltageGradingModels_ItemCode').val("");
                        $('#VoltageCapacityGrade').empty();
                        $('#VoltageIRGrade').empty();
                    }
                }
            });

        }
    });

    $("#VoltageCapacityGrade").change(function (event) {
        var capgrade = $(this).val();
        var itemcode = $('#VoltageGradingModels_ItemCode').val();
        if (capgrade !== "") {
            $('#VoltageGradingModels_CapacityGrade').val(capgrade);
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetIRGrading",
                data: { itemcode: itemcode, capgrade: capgrade },
                dataType: "json",
                success: function (res) {
                    var lstb = res;
                    $('#VoltageGradingModels_IRGrade').val("");
                    $('#VoltageIRGrade').empty();
                    if (lstb.length === 0) {
                        $('#VoltageIRGrade').attr("required", true);
                        $('#VoltageIRGrade').attr("disabled", true);
                    }
                    else if (lstb.length === 1) {
                        $('#VoltageIRGrade').attr("disabled", false);
                        var options = '<option value="' + lstb[0].IRGrade + '">' + lstb[0].IRGrade + '</option>';
                        $('#VoltageIRGrade').append(options);
                        $('#VoltageGradingModels_IRGrade').val(lstb[0].IRGrade);
                    } else if (lstb.length > 1) {
                        $('#VoltageIRGrade').attr("disabled", false);
                        var optionm = '<option value=""> --Select IR Grade-- </option>';
                        $('#VoltageIRGrade').append(optionm);
                        $('#VoltageIRGrade').attr("required", true);
                        for (var i = 0; i < lstb.length; i++) {
                            optionm = '<option value="' + lstb[i].IRGrade + '">' + lstb[i].IRGrade + '</option>';
                            $('#VoltageIRGrade').append(optionm);
                        }
                    }
                    else {
                        $('#VoltageIRGrade').empty();
                    }
                }
            });
        }
    });

    $("#VoltageIRGrade").change(function (event) {
        var irgrd = $(this).val();
        if (irgrd !== "") {
            $('#VoltageGradingModels_IRGrade').val(irgrd);
        }
    });


    //Setting table
    var tblSetting = $('#tblSetting').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //Group
            { 'targets': 3, 'width': '100' },   //Name
            { 'targets': 4, 'width': '200' }   //ValueType
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    tblSetting.on('order.dt search.dt', function () {
        tblSetting.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblSetting.cell(cell).invalidate('dom');
        });
    }).draw();
    //Setting table

});

/* Master End */

/* Purchase Start */
$(document).ready(function () {
    //Vendor table
    var vendors = $('#tblvendors').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //VendorCode
            { 'targets': 3, 'width': '150' },   //VendorName
            { 'targets': 4, 'width': '100' },   //Company
            { 'targets': 5, 'width': '100' },   //Contact1
            { 'targets': 6, 'width': '100' },   //Contact2
            { 'targets': 7, 'width': '100' },   //Fax
            { 'targets': 8, 'width': '100' },   //WebsiteURL
            { 'targets': 9, 'width': '100' },   //Email
            { 'targets': 10, 'width': '100' },  //Address1
            { 'targets': 11, 'width': '120' },  //Address2
            { 'targets': 12, 'width': '100' },  //City
            { 'targets': 13, 'width': '100' },  //State
            { 'targets': 14, 'width': '100' },  //Country
            { 'targets': 15, 'width': '80' },  //Pincode
            { 'targets': 16, 'width': '80' }  //Logo
        ],
        "scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    vendors.on('order.dt search.dt', function () {
        vendors.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            vendors.cell(cell).invalidate('dom');
        });
    }).draw();
    //Vendor table

    //Purchase Order Table
    var tblpurchaseorder = $('#tblpurchaseorder').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //PONumber
            { 'targets': 3, 'width': '150' },   //OrderDate
            { 'targets': 4, 'width': '100' },   //VendorCode
            { 'targets': 5, 'width': '200' }    //Notes
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    tblpurchaseorder.on('order.dt search.dt', function () {
        tblpurchaseorder.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblpurchaseorder.cell(cell).invalidate('dom');
        });
    }).draw();
    //Purchase Order Table

    var sel_vendor_list = $('#sel_vendor_list').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false, 'className': 'select-checkbox' },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Id Hidden
            { 'targets': 2, 'width': '100' },       //Vendor Code
            { 'targets': 3, 'width': '100' },       //Vendor Name
            { 'targets': 4, 'width': '100' },       //Contact
            { 'targets': 5, 'width': '200' }       //Address
        ],
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        "order": [3, 'asc'],
        "paging": true
    });

    $("#sel_vendor_list_filter input").keypress(function () {
        $('#sel_vendor_list tbody tr').removeClass("selected");
    });

    $('#sel_vendor_list tbody').on('click', 'tr', function () {
        $('#sel_vendor_list tbody tr').removeClass('selected');
        //$(':checkbox').each(function () {
        //    this.checked = false;
        //});
        $(this).toggleClass('selected');
    });

    $('#btn_SelVendor').click(function () {
        var tbl = $('#sel_vendor_list').DataTable();
        var ids = $.map(tbl.rows('.selected').data(), function (item) {
            return item[1];
        });
        var vcode = $.map(tbl.rows('.selected').data(), function (item) {
            return item[2];
        });
        var vname = $.map(tbl.rows('.selected').data(), function (item) {
            return item[3];
        });
        $('.vendorcode').val(vcode.toString());
        $('.vendorname').val(vname.toString());
        $('.vendorcode').focus();
        //$('#PurOrdHdrModels_VendorCode').val(vcode.toString());
        //$('#PurOrdHdrModels_VendorName').val(vname.toString());
        //$('input[name="PurOrdHdrModels.VendorCode"]').focus();
        $('#sel_vendor_list tbody tr').removeClass("selected");
    });

    //$('#tblpurordline').on('blur', '.quantity', function () {
    //    AddNewRow(this, "item-data", "tblpurordline");
    //});

    //$('#tblpurordline').on('keypress', '.onlynumdec', function (event) {
    //    return isNumber(event, this);
    //});

    $('#posubmit').on('click', function (e) {
        $("#posubmit").attr("disabled", true);
        e.preventDefault();
        var linkObj = $(this);
        var hdArr = new Array();
        var lnArr = new Array();
        var ponumber = $('.ponumber').val();
        var vencode = $('.vendorcode').val();
        var orddate = $('.orderdate').val();
        var expdate = $('.expdate').val();
        var notes = $('.notes').val();
        var frmact = $('.frmact').val();
        if (orddate !== "" && expdate!=="" && ponumber !== "" && vencode !== "") {
            var pheader = {
                OrderDate: orddate,
                ExpRcvDate: expdate,
                PONumber: ponumber,
                VendorCode: vencode,
                Notes: notes
            };
            hdArr.push(pheader);

            $(".tbl tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var lineno = $(tds[0]).find('.ilineno').val();
                var itmcode = $(tds[1]).find('.iitemcode').val();
                var qty = $(tds[3]).find('.iquantity').val();
                if (lineno !== "" && itmcode !== "" && qty !== "") {
                    var lin = {
                        LineNo: lineno,
                        ItemCode: itmcode,
                        Quantity: parseFloat(qty)
                    };
                    lnArr.push(lin);
                }
            });

            if (lnArr.length > 0) {
                var poh = JSON.stringify(hdArr);
                var pol = JSON.stringify(lnArr);

                $.ajax({
                    url: "/Dashboard/UpsertPurchaserOrder",
                    dataType: "json",
                    data: "{'poh': '" + poh + "', 'pol': '" + pol + "', 'act': '" + frmact + "'}",
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
        }
        else {
            alert("Please fill the required fields.");
        }

        $("#posubmit").attr("disabled", false);
    });

    //POReceipt Table
    var POReceiptlinelist1 = $('#POReceiptlinelist1').DataTable({
        "paging": false,
        "searching": false,
        "lengthChange": false,
        "bPaginate": false,
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1 },   //ItemCode
            { 'targets': 2 },   //ItemName
            { 'targets': 3 },   //Quantity
            { 'targets': 4 },    //ReceiveQuantity
            { 'targets': 5 },   //ScrapQuantity
            { 'targets': 6 }    //RemainingQuantity
        ],
        "order": [2, 'asc']
    });

    POReceiptlinelist1.on('order.dt search.dt', function () {
        POReceiptlinelist1.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            POReceiptlinelist1.cell(cell).invalidate('dom');
        });
    }).draw();
    //Purchase Order Table

    $("#POReceiptModels_InvoiceNo").on('blur', function (event) {
        var inv = $("#POReceiptModels_InvoiceNo").val();
        if (inv !== "") {
            $.ajax({
                url: '/Dashboard/InvoiceExist',
                data: { inv: inv },
                type: "GET",
                dataType: "JSON",
                success: function (res) {
                    var lst = res;
                    if (lst.length > 0) {
                        alert("Invoice No. already Exist");
                        $("#POReceiptModels_InvoiceNo").val("");
                        $("#POReceiptModels_InvoiceNo").focus();
                    }
                },
                error: function () {
                    alert("Failed! Please try again.");
                    $("#POReceiptModels_InvoiceNo").val("");
                }
            });
        }
        else {
            $("#PurchaseOrderModels_VendorCode").val("");
        }
    });

    $('#POReceiptlinelist').on('blur', '.receivequantity', function () {
        var currentRow = $(this).closest("tr");
        var itemcodec = currentRow.find("td:eq(1)").find("input").val();
        var qtyc = currentRow.find("td:eq(3)").find("input").val();
        var qtys = currentRow.find("td:eq(4)").find("input").val();
        var adr = "0";
        $("#POReceiptlinelist1 tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var itmcode = $(tds[1]).html().trim();
            if (itmcode === itemcodec) {
                var quantity = $(tds[6]).html().trim();
                if ((qtyc + qtys) > quantity) {
                    currentRow.find("td:eq(3)").find("input").focus();
                    currentRow.find("td:eq(3)").find("input").val("");
                    alert("Issue quantity is greater than request quantity");
                }
                else {
                    adr = "1";
                }
            }
        });
        if (adr === "1") {
            AddNewRow(this, "item-data", "POReceiptlinelist");
        }
    });

    $('#POReceiptlinelist').on('blur', '.iscrapqty', function () {
        var currentRow = $(this).closest("tr");
        var itemcodec = currentRow.find("td:eq(1)").find("input").val();
        var qtyc = currentRow.find("td:eq(3)").find("input").val();
        var qtys = currentRow.find("td:eq(4)").find("input").val();
        var adr = "0";
        $("#POReceiptlinelist1 tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var itmcode = $(tds[1]).html().trim();
            if (itmcode === itemcodec) {
                var quantity = $(tds[6]).html().trim();
                if ((qtyc + qtys) > quantity) {
                    currentRow.find("td:eq(4)").find("input").focus();
                    currentRow.find("td:eq(4)").find("input").val("");
                    alert("Issue quantity is greater than request quantity");
                }
                else {
                    adr = "1";
                }
            }
        });
        if (adr === "1") {
            AddNewRow(this, "item-data", "POReceiptlinelist");
        }
    });

    $('#porsubmit').on('click', function (e) {

        $("#porsubmit").attr("disabled", true);
        e.preventDefault();
        var hdArr = new Array();
        var lnArr = new Array();
        var ponum = $('.ponum').val();
        var receiptno = $('.receiptno').val();
        var releaseno = $('.releaseno').val();
        var receivedate = $('.receivedate').val();
        var vendinvoiceno = $('.vendinvoiceno').val();
        var warehousecode = $('.warehousecode').val();
        var notes = $('.notes').val();
        var frmact = $('.frmact').val();
        if (ponum !== "" && receiptno !== "" && releaseno !== "" &&
            receivedate !== "" && vendinvoiceno !== "" &&
            (warehousecode !== "-- Select Warehouse --" && warehousecode !== "")) {
            var rheader = {
                ReceiptNo: receiptno,
                ReleaseNo: releaseno,
                ReceiveDate: receivedate,
                PONo: ponum,
                VendInvoiceNo: vendinvoiceno,
                WarehouseCode: warehousecode,
                Notes: notes
            };
            hdArr.push(rheader);

            $(".tbl tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var lineno = $(tds).find('.ilineno').val();
                var itemcode = $(tds).find('.iitemcode').val();
                var receivingqty = $(tds).find('.ireceivingqty').val();
                var scrapqty = $(tds).find('.iscrapqty').val();
                if (scrapqty === "") {
                    scrapqty = 0;
                }
                if (lineno !== "" && itemcode !== "" && receivingqty !== "" && receivingqty > 0) {
                    var rlin = {
                        ReceiptNo: receiptno,
                        ReleaseNo: releaseno,
                        LineNo: lineno,
                        ItemCode: itemcode,
                        VenInvQty: parseFloat(receivingqty) + parseFloat(scrapqty),
                        ReceiveQty: parseFloat(receivingqty),
                        ScrapQty: parseFloat(scrapqty)
                    };
                    lnArr.push(rlin);
                }
            });
            if (lnArr.length > 0) {
                var rh = JSON.stringify(hdArr);
                var rl = JSON.stringify(lnArr);

                $.ajax({
                    url: "/Dashboard/UpsertPOReceipt",
                    dataType: "json",
                    data: "{'rh': '" + rh + "', 'rl': '" + rl + "', 'act': '" + frmact + "' }",
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
                alert("No receipt's line.");
            }
        }
        else {
            alert("Please fill the required fields.");
        }

        $("#porsubmit").attr("disabled", false);
    });

    $("#gradingmaterialissue").on('blur', '.iissueqty', function () {
       var currentRow = $(this).closest("tr");
           var tqty = currentRow.find("td:eq(4)").find("input").val();
           var isqty = currentRow.find("td:eq(5)").find("input").val();
        if (tqty !== "" && isqty !== "") {
            if (parseFloat(isqty) > parseFloat(tqty)) {
                $("#gmisubmit").attr("disabled", true);
                alert("Issue quantity is greater than available quantity");
                currentRow.find("td:eq(5)").find("input").val("");
                currentRow.find("td:eq(5)").find("input").focus();
            }
            else {
                $("#gmisubmit").attr("disabled", false);
            }
        }
        else
        {
            $("#gmisubmit").attr("disabled", true);
            alert("Quantity is not available");
            currentRow.find("td:eq(5)").find("input").val("");
            currentRow.find("td:eq(5)").find("input").focus();
        }
    });


    $('#gmisubmit').on('click', function (e) {

        $("#gmisubmit").attr("disabled", true);
        e.preventDefault();
        var hdArr = new Array();
        var lnArr = new Array();
        var jobcardno = $('.jobcardno').val();
        var jobcardtype = $('.jobcardtype').val();
        var releaseno = $('.releaseno').val();
        var issuedate = $('.issuedate').val();
        var warehousecode = $('.warehousecode').val();
        var notes = $('.notes').val();
        var frmact = $('.frmact').val();
        if (jobcardno !== "" && jobcardtype !== "" && releaseno !== "" &&
            issuedate !== "" && (warehousecode !== "-- Select Warehouse --" && warehousecode !== "")) {
            var iheader = {
                JobCardNo: jobcardno,
                JobCardType: jobcardtype,
                ReleaseNo: releaseno,
                IssueDate: issuedate,
                WarehouseCode: warehousecode,
                Notes: notes
            };
            hdArr.push(iheader);

            $(".tbl tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var lineno = $(tds).find('.ilineno').val();
                var itemcode = $(tds).find('.iitemcode').val();
                var issueqty = $(tds).find('.iissueqty').val();
                if (lineno !== "" && itemcode !== "" && issueqty !== "" && issueqty > 0) {
                    var ilin = {
                        JobCardNo: jobcardno,
                        JobCardType: jobcardtype,
                        LineNo: lineno,
                        ItemCode: itemcode,
                        IssueQty: parseFloat(issueqty)
                    };
                    lnArr.push(ilin);
                }
            });
            if (lnArr.length > 0) {
                var ih = JSON.stringify(hdArr);
                var il = JSON.stringify(lnArr);

                $.ajax({
                    url: "/Dashboard/UpsertGradingMaterialIssue",
                    dataType: "json",
                    data: "{'ih': '" + ih + "', 'il': '" + il + "', 'act': '" + frmact + "' }",
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
                alert("No material issue lines are found.");
            }
        }
        else {
            alert("Please fill the required fields.");
        }

        $("#gmisubmit").attr("disabled", false);
    });

    //POReceipt Table
    var tblporeceipt = $('#tblporeceipt').DataTable({
        "paging": true,
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1 },   //PONumber
            { 'targets': 2 },   //OrderDate
            { 'targets': 3 },   //VendorCode
            { 'targets': 4 },   //InvoiceNo
            { 'targets': 5 },   //WarehouseCode
            { 'targets': 6 }    //Notes
        ]
        //"order": [2, 'asc']
    });

    tblporeceipt.on('order.dt search.dt', function () {
        tblporeceipt.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblporeceipt.cell(cell).invalidate('dom');
        });
    }).draw();
    //POReceipt Table

    //POReceipt Table
    var POReceiptItemline = $('#POReceiptItemline').DataTable({
        "paging": true,
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1 },   //ItemCode
            { 'targets': 2 },   //ItemName
            { 'targets': 3 },   //ReceiveQuantity
            { 'targets': 4 },   //ScrapQuantity
        ],
        "order": [2, 'asc']
    });

    POReceiptItemline.on('order.dt search.dt', function () {
        POReceiptItemline.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            POReceiptItemline.cell(cell).invalidate('dom');
        });
    }).draw();
    //POReceipt Table

});
/* Purchase End */

/* Store Start */

$(document).ready(function () {

    //Complete CS Job Card table

    $("#IssueGrdJobCardItemLineList1").on("blur", ".iitemcode", function (event) {
        var currentRow = $(this).closest("tr");
        var itemcode = currentRow.find("td:eq(1)").find("input").val();
        var itmId = $(this).attr("id");
        var adr = "0";
        if (itemcode !== undefined || itemcode !== "") {
            $("#IssueGrdJobCardItemLineList tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var itmcode = $(tds[1]).html().trim();
                if (itemcode === itmcode) {
                    adr = "1";
                    return false;
                }
                else {
                    adr = "0";
                }
            });
            if (adr !== "0") {
                $.ajax({
                    type: "GET",
                    url: "/Dashboard/GetGrdIssueQuantity",
                    data: { itemcode: itemcode },
                    dataType: "json",
                    success: function (res) {
                        var lstwb = res;
                        if (lstwb.length > 0) {
                            currentRow.find("td:eq(3)").find("input").val(lstwb[0].Quantity);
                        }
                        else {
                            currentRow.find("td:eq(3)").find("input").val("");
                            currentRow.find("td:eq(3)").find("input").focus();
                        }
                    }
                });
            }
            else {
                currentRow.find("td:eq(1)").find("input").val("");
                currentRow.find("td:eq(2)").find("input").val("");
                currentRow.find("td:eq(3)").find("input").val("");
                currentRow.find("td:eq(4)").find("input").val("");
                currentRow.find("td:eq(1)").find("input").focus();
                alert("Item does not exist in Grading Job Card");
            }
        }
    });

    $('#IssueGrdJobCardItemLineList1').on('blur', '.iissuequantity', function () {
        var currentRow = $(this).closest("tr");
        var itemcodec = currentRow.find("td:eq(1)").find("input").val();
        var qtyc = 0;
        var qt = currentRow.find("td:eq(4)").find("input").val();
        if (qt !== "") {
            qtyc = qt;
        }
        var qty = currentRow.find("td:eq(3)").find("input").val();
        if (parseFloat(qtyc) <= parseFloat(qty)) {
            var adr = "0";
            $("#IssueGrdJobCardItemLineList tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var itmcode = $(tds[1]).html().trim();
                if (itmcode === itemcodec) {
                    var quantity = $(tds[4]).html().trim();
                    if (qtyc > parseFloat(quantity)) {
                        currentRow.find("td:eq(4)").find("input").focus();
                        currentRow.find("td:eq(4)").find("input").val("");
                        alert("Issue quantity is greater than request quantity");
                    }
                    else {
                        adr = "1";
                    }
                }
            });
            //if (adr === "1") {
            //  AddNewRow(this, "item-data", "IssueGrdJobCardItemLineList1");
            //}
        }
        else {
            currentRow.find("td:eq(4)").find("input").val("");
            currentRow.find("td:eq(4)").find("input").focus();
            alert("Issue quantity is greater than available quantity");
        }
    });

    $('#igrdjcsubmit').on('click', function (e) {
        $("#igrdjcsubmit").attr("disabled", true);
        e.preventDefault();
        var lnArr = new Array();
        var jcnumber = $("#GrdJobCardHdrModels_JobCardNo").val();
        var frmact = $('.frmact').val();
        $(".tbl tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var lineno = $(tds[0]).find('.ilineno').val();
            var itmcode = $(tds[1]).find('.iitemcode').val();
            var qty = $(tds[4]).find('.iissuequantity').val();
            if (itmcode !== "" && itmcode !== undefined && qty !== "" && qty !== "0") {
                var lin = {
                    JobCardNo: jcnumber,
                    LineNo: lineno,
                    ItemCode: itmcode,
                    Quantity: parseFloat(qty)
                };
                lnArr.push(lin);
            }
        });

        if (lnArr.length > 0) {
            var gjcl = JSON.stringify(lnArr);
            $.ajax({
                url: "/Dashboard/InsertGrdIssueJobCardItem",
                dataType: "json",
                data: "{'igrdjcitems': '" + gjcl + "', 'act': '" + frmact + "' }",
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
            alert("Please fill the required fields.");
        }
        $("#igrdjcsubmit").attr("disabled", false);
    });

    //Store table
    var tblStoreList = $('#tblStoreList').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1 },       //Barcode
            { 'targets': 2 },       //ItemCode
            { 'targets': 3 },       //Description
            { 'targets': 4 }        //Quantity
        ],
        "order": [2, 'asc'],
        "paging": true
    });
    tblStoreList.on('order.dt search.dt', function () {
        tblStoreList.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblStoreList.cell(cell).invalidate('dom');
        });
    }).draw();
    //Store table

    //Capacity table
    var tblCapacityList = $('#tblCapacityList').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1 },
            { 'targets': 2 },       //ItemCode
            { 'targets': 3 },       //Description
            { 'targets': 4 },       //Capacity Grading
            { 'targets': 5 }        //Quantity
        ],
        "paging": true
    });
    tblCapacityList.on('order.dt search.dt', function () {
        tblCapacityList.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblCapacityList.cell(cell).invalidate('dom');
        });
    }).draw();
    //Capacity table

    $("#CapacityModels_ItemCode").on("blur", function (e) {
        var itemcode = $('#CapacityModels_ItemCode').val();
        if (itemcode !== undefined || itemcode !== "") {
            if (itemcode !== "") {
                $.ajax({
                    type: "GET",
                    url: "/Dashboard/GetCapBarcode",
                    data: { itemcode: itemcode },
                    dataType: "json",
                    success: function (res) {
                        var lstb = res;
                        $('#Barcode').empty();
                        if (lstb.length === 0) {
                            $('#Barcode').attr("required", true);
                            $('#Barcode').attr("disabled", true);
                            //$('#' + rowid).selectpicker('refresh');
                        }
                        else if (lstb.length === 1) {
                            $('#Barcode').attr("disabled", false);
                            var optionbc = '<option value="' + lstb[0].Barcode + '">' + lstb[0].Barcode + '</option>';
                            $('#Barcode').append(optionbc);
                            var bcode = lstb[0].Barcode;
                            $('#CapacityModels_Barcode').val(bcode);
                            $.ajax({
                                type: "GET",
                                url: "/Dashboard/GetCapQuantity",
                                data: { itemcode: itemcode, bcode: bcode },
                                dataType: "json",
                                success: function (res) {
                                    var lstwb = res;
                                    $("#CapacityModels_Quantity").val(lstwb[0].Quantity);
                                    if ($("#CapacityModels_Quantity").val() !== "0") {
                                        var coUrl = '/Dashboard/GetCapacityGrading';
                                        $.getJSON(coUrl, { itemcode: itemcode }, function (response) {
                                            $('#tblCapacity').DataTable().destroy();
                                            $('#tblCapacity').find('tbody').find('tr').remove();
                                            var inc = 1;
                                            $.each(response, function (index, item) {
                                                $('#tblCapacity').find('tbody').append(
                                                    "<tr>" +
                                                    "<td class='w-10'> <input class='form-control' id='CapacityModelList_LineNo_" + inc + "' name='CapacityModelList_LineNo_" + inc + "' value=" + inc + " disabled required='True' type='text'></td>" +
                                                    "<td class='w-10'> <input type='text' id='CapacityModelList_CapacityGrade_" + inc + "' name='CapacityModelList_CapacityGrade_" + inc + "' value=" + item.CapacityGrade + " class='form-control capacitygrade' disabled /></td> " +
                                                    "<td class='w-10'> <input type='text' id='CapacityModelList_Quantity_" + inc + "' name='CapacityModelList_Quantity_" + inc + "' value='' class='form-control quantity' /></td>" +
                                                    "</tr>");
                                                inc++;
                                            });
                                        });
                                    }
                                }
                            });
                        } else if (lstb.length > 1) {
                            $('#Barcode').attr("disabled", false);
                            var optionbc = '<option value="">--Select Barcode--</option>';
                            $('#Barcode').append(optionbc);
                            $('#Barcode').attr("required", true);
                            for (var i = 0; i < lstb.length; i++) {
                                optionbc = '<option value="' + lstb[i].Barcode + '">' + lstb[i].Barcode + '</option>';
                                $('#Barcode').append(optionbc);
                            }
                        }
                        else {
                            $('#Barcode').empty();
                        }
                    }
                });
            }
        }
    });

    $("#Barcode").change(function (event) {
        var bcode = $(this).val();
        $('#CapacityModels_Barcode').val(bcode);
        var itemcode = $('#CapacityModels_ItemCode').val();
        if (bcode !== "") {
            $('#CapacityModels_Barcode').val(bcode);
            $('#tblCapacity').DataTable().destroy();
            $('#tblCapacity').find('tbody').find('tr').remove();
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetCapQuantity",
                data: { itemcode: itemcode, bcode: bcode },
                dataType: "json",
                success: function (res) {
                    var lstwb = res;
                    $("#CapacityModels_Quantity").val(lstwb[0].Quantity);
                    if ($("#CapacityModels_Quantity").val() !== "0") {
                        var coUrl = '/Dashboard/GetCapacityGrading';
                        $.getJSON(coUrl, { itemcode: itemcode }, function (response) {
                            $('#tblCapacity').DataTable().destroy();
                            $('#tblCapacity').find('tbody').find('tr').remove();
                            var inc = 1;
                            $.each(response, function (index, item) {
                                $('#tblCapacity').find('tbody').append(
                                    "<tr>" +
                                    "<td class='w-10'> <input class='form-control' id='CapacityModelList_LineNo_" + inc + "' name='CapacityModelList_LineNo_" + inc + "' value=" + inc + " disabled required='True' type='text'></td>" +
                                    "<td class='w-10'> <input type='text' id='CapacityModelList_CapacityGrade_" + inc + "' name='CapacityModelList_CapacityGrade_" + inc + "' value=" + item.CapacityGrade + " class='form-control capacitygrade' disabled /></td> " +
                                    "<td class='w-10'> <input type='text' id='CapacityModelList_Quantity_" + inc + "' name='CapacityModelList_Quantity_" + inc + "' value='' class='form-control quantity' /></td>" +
                                    "</tr>");
                                inc++;
                            });
                        });
                    }
                }
            });
        }
    });

    var totaQty = 0;
    $("#tblCapacity").on("blur", ".iquantity", function (event) {
        var currentRow = $(this).closest("tr");
        var total = $('#CapacityModels_Quantity').val();
        totaQty = parseFloat(total);
        var tQty = 0;
        $("#tblCapacity tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var qty = $(tds[2]).find('.iquantity').val();
            if (qty !== "" && qty !== "0") {
                tQty = parseFloat(tQty) + parseFloat(qty);
            }
        });
        if (tQty > totaQty) {
            currentRow.find("td:eq(2)").find("input").val("");
            currentRow.find("td:eq(2)").find("input").focus();
            alert('Capacity grading quantity is greater than available quantity');
        }
    });


    $('#capsubmit').on('click', function (e) {
        e.preventDefault();
        var list = new Array();
        var list1 = new Array();
        var grdjcno = $('#CapacityModels_GradeJobCardNo').val();
        var itemcode = $('#CapacityModels_ItemCode').val();
        var barcode = $('#CapacityModels_Barcode').val();
        var quantity = $('#CapacityModels_Quantity').val();
        if (itemcode !== "" && barcode !== "" && barcode !== "--Select Barcode--" && quantity !== "" && quantity !== "0" && grdjcno !== "") {
            var capheader = {
                GradeJobCardNo: grdjcno,
                ItemCode: itemcode,
                Barcode: barcode
            };
            list.push(capheader);
            $("#tblCapacity tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var capgrade = $(tds[1]).find('.icapacitygrade').val();
                var qty = $(tds[2]).find('.iquantity').val();
                if (capgrade !== "" && qty !== "") {
                    var incritm = {
                        CapacityGrade: capgrade,
                        CGQuantity: parseFloat(qty)
                    };
                    list1.push(incritm);
                }
            });

            var caphead = JSON.stringify(list);
            var capitem = JSON.stringify(list1);
            if (caphead.length > 0 && capitem.length > 0) {
                $.ajax({
                    url: "/Dashboard/InsertCapacity",
                    dataType: "json",
                    data: "{'caphead': '" + caphead + "', 'capitem': '" + capitem + "' }",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        location.reload();
                    },
                    error: function () {

                    }
                });
            }
        }
    });

    //IRL table
    var tblIRl = $('#tblIRl').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1 },       //
            { 'targets': 2 },       //Grade Job Card No
            { 'targets': 3 },       //ItemCode
            { 'targets': 4 }        //Description
        ],
        "paging": true
    });
    tblIRl.on('order.dt search.dt', function () {
        tblIRl.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblIRl.cell(cell).invalidate('dom');
        });
    }).draw();
    //IRL table

    //IR table
    var tblIRList = $('#tblIRList').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1 },
            { 'targets': 2 },       //ItemCode
            { 'targets': 3 },       //Description
            { 'targets': 4 },       //Capacity Grading
            { 'targets': 5 },       //IR Grading
            { 'targets': 6 }        //Quantity
        ],
        "paging": true
    });
    tblIRList.on('order.dt search.dt', function () {
        tblIRList.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblIRList.cell(cell).invalidate('dom');
        });
    }).draw();
    //IR table

    $("#IRModels_ItemCode").on("blur", function (e) {
        var itemcode = $('#IRModels_ItemCode').val();
        if (itemcode !== undefined || itemcode !== "") {
            $('#tblIR').DataTable().destroy();
            $('#tblIR').find('tbody').find('tr').remove();
            if (itemcode !== "") {
                $.ajax({
                    type: "GET",
                    url: "/Dashboard/GetIRCapacityGrade",
                    data: { itemcode: itemcode },
                    dataType: "json",
                    success: function (res) {
                        var lstw = res;
                        $('#CapGrade').empty();
                        if (lstw.length === 0) {
                            $('#CapGrade').attr("required", true);
                            $('#CapGrade').attr("disabled", true);
                            //$('#' + rowid).selectpicker('refresh');
                        }
                        else if (lstw.length === 1) {
                            $('#CapGrade').attr("disabled", false);
                            var optionbc = '<option value="' + lstw[0].CapacityGrade + '">' + lstw[0].CapacityGrade + '</option>';
                            $('#CapGrade').append(optionbc);
                            var capgrade = lstw[0].CapacityGrade;
                            $('#IRModels_CapacityGrade').val(capgrade);
                            var coUrl = '/Dashboard/GetIRGrading';
                            $.getJSON(coUrl, { itemcode: itemcode, capgrade: capgrade }, function (response) {
                                $('#tblIR').DataTable().destroy();
                                $('#tblIR').find('tbody').find('tr').remove();
                                var inc = 1;
                                $.each(response, function (index, item) {
                                    $('#tblIR').find('tbody').append(
                                        "<tr>" +
                                        "<td class='w-10'> <input class='form-control' id='IRModelList_LineNo_" + inc + "' name='IRModelList_LineNo_" + inc + "' value=" + inc + " disabled required='True' type='text'></td>" +
                                        "<td class='w-10'> <input type='text' id='IRModelList_IRGrade_" + inc + "' name='IRModelList_IRGrade_" + inc + "' value=" + item.IRGrade + " class='form-control irgrade' disabled /></td> " +
                                        "<td class='w-10'> <input type='text' id='IRModelList_Quantity_" + inc + "' name='IRModelList_Quantity_" + inc + "' value='' class='form-control quantity' /></td>" +
                                        "</tr>");
                                    inc++;
                                });
                            });
                            $.ajax({
                                type: "GET",
                                url: "/Dashboard/GetIRCapacityGradeQuantity",
                                data: { itemcode: itemcode, bcode: bcode, capgrade: capgrade },
                                dataType: "json",
                                success: function (res) {
                                    var lstwb = res;
                                    $("#IRModels_Quantity").val(lstwb[0].Quantity);
                                }
                            });
                        } else if (lstw.length > 1) {
                            $('#CapGrade').attr("disabled", false);
                            var optionc = '<option value="">--Select Capacity Grade--</option>';
                            $('#CapGrade').append(optionc);
                            $('#CapGrade').attr("required", true);
                            for (var i = 0; i < lstw.length; i++) {
                                optionc = '<option value="' + lstw[i].CapacityGrade + '">' + lstw[i].CapacityGrade + '</option>';
                                $('#CapGrade').append(optionc);
                            }
                        }
                        else {
                            $('#CapGrade').empty();
                        }
                    }
                });
            }
        }
    });

    $("#CapGrade").change(function (event) {
        var capgrade = $(this).val();
        $('#IRModels_CapacityGrade').val(capgrade);
        var itemcode = $('#IRModels_ItemCode').val();
        $('#tblIR').DataTable().destroy();
        $('#tblIR').find('tbody').find('tr').remove();
        if (capgrade !== "") {
            var coUrl = '/Dashboard/GetIRGrading';
            $.getJSON(coUrl, { itemcode: itemcode, capgrade: capgrade }, function (response) {
                $('#tblIR').DataTable().destroy();
                $('#tblIR').find('tbody').find('tr').remove();
                var inc = 1;
                $.each(response, function (index, item) {
                    $('#tblIR').find('tbody').append(
                        "<tr>" +
                        "<td class='w-10'> <input class='form-control' id='IRModelList_LineNo_" + inc + "' name='IRModelList_LineNo_" + inc + "' value=" + inc + " disabled required='True' type='text'></td>" +
                        "<td class='w-10'> <input type='text' id='IRModelList_IRGrade_" + inc + "' name='IRModelList_IRGrade_" + inc + "' value=" + item.IRGrade + " class='form-control irgrade' disabled /></td> " +
                        "<td class='w-10'> <input type='text' id='IRModelList_Quantity_" + inc + "' name='IRModelList_Quantity_" + inc + "' value='' class='form-control quantity' /></td>" +
                        "</tr>");
                    inc++;
                });
            });
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetIRCapacityGradeQuantity",
                data: { itemcode: itemcode, capgrade: capgrade },
                dataType: "json",
                success: function (res) {
                    var lstwb = res;
                    $("#IRModels_Quantity").val(lstwb[0].Quantity);
                }
            });
        }
    });

    $("#tblIR").on("blur", ".iquantity", function (event) {
        var currentRow = $(this).closest("tr");
        var total = $('#IRModels_Quantity').val();
        var ttaQty = parseFloat(total);
        var tQty = 0;
        $("#tblIR tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var qty = $(tds[2]).find('.iquantity').val();
            if (qty !== "" && qty !== "0") {
                tQty = parseFloat(tQty) + parseFloat(qty);
            }
        });
        if (tQty > ttaQty) {
            currentRow.find("td:eq(2)").find("input").val("");
            currentRow.find("td:eq(2)").find("input").focus();
            alert('IR grading quantity is greater than available quantity');
        }
    });

    $('#tblIR').on('keypress', '.quantity', function (event) {
        return isNumber(event, this);
    });

    $('#irsubmit').on('click', function (e) {
        e.preventDefault();
        var list = new Array();
        var list1 = new Array();
        var gjcn = $('#IRModels_GradeJobCardNo').val();
        var itemcode = $('#IRModels_ItemCode').val();
        var capgrade = $('#IRModels_CapacityGrade').val();
        var quantity = $('#IRModels_Quantity').val();
        if (gjcn !== "" && itemcode !== "" && capgrade !== "--Select Capacity Grading--" && capgrade !== "" && quantity !== "" && quantity !== "0") {
            var irheader = {
                GradeJobCardNo: gjcn,
                ItemCode: itemcode,
                CapacityGrade: capgrade
            };
            list.push(irheader);
            $("#tblIR tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var irgrade = $(tds[1]).find('.iirgrade').val();
                var qty = $(tds[2]).find('.iquantity').val();
                if (irgrade !== "" && qty !== "") {
                    var incritm = {
                        IRGrade: irgrade,
                        IRQuantity: parseFloat(qty)
                    };
                    list1.push(incritm);
                }
            });

            var irhead = JSON.stringify(list);
            var iritem = JSON.stringify(list1);
            if (irhead.length > 0 && iritem.length > 0) {
                $.ajax({
                    url: "/Dashboard/InsertIR",
                    dataType: "json",
                    data: "{'irhead': '" + irhead + "', 'iritem': '" + iritem + "' }",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        location.reload();
                    },
                    error: function () {

                    }
                });
            }
        }
    });

    //Voltagel table
    var tblVoltagel = $('#tblVoltagel').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1 },       //
            { 'targets': 2 },       //Grade Job Card No
            { 'targets': 3 },       //ItemCode
            { 'targets': 4 }        //Description
        ],
        "paging": true
    });
    tblVoltagel.on('order.dt search.dt', function () {
        tblVoltagel.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblVoltagel.cell(cell).invalidate('dom');
        });
    }).draw();
    //Voltagel table

    //Voltage table
    var tblVoltageList = $('#tblVoltageList').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1 },
            { 'targets': 2 },       //ItemCode
            { 'targets': 3 },       //Description
            { 'targets': 4 },       //Capacity Grading
            { 'targets': 5 },       //IR Grading
            { 'targets': 6 },       //Voltage Grading
            { 'targets': 7 }        //Quantity
        ],
        "paging": true
    });
    tblVoltageList.on('order.dt search.dt', function () {
        tblVoltageList.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblVoltageList.cell(cell).invalidate('dom');
        });
    }).draw();
    //Voltage table

    $("#VoltageModels_ItemCode").on("blur", function (e) {
        var itemcode = $('#VoltageModels_ItemCode').val();
        $('#tblVoltage').DataTable().destroy();
        $('#tblVoltage').find('tbody').find('tr').remove();
        if (itemcode !== undefined || itemcode !== "") {
            if (itemcode !== "") {
                $.ajax({
                    type: "GET",
                    url: "/Dashboard/GetVoltageCapacityGrade",
                    data: { itemcode: itemcode },
                    dataType: "json",
                    success: function (res) {
                        var lstw = res;
                        $('#CapGrade').empty();
                        if (lstw.length === 0) {
                            $('#CapGrade').attr("required", true);
                            $('#CapGrade').attr("disabled", true);
                            //$('#' + rowid).selectpicker('refresh');
                        }
                        else if (lstw.length === 1) {
                            $('#CapGrade').attr("disabled", false);
                            var optionbc = '<option value="' + lstw[0].CapacityGrade + '">' + lstw[0].CapacityGrade + '</option>';
                            $('#CapGrade').append(optionbc);
                            var capgrade = lstw[0].CapacityGrade;
                            $('#VoltageModels_CapacityGrade').val(capgrade);
                            $.ajax({
                                type: "GET",
                                url: "/Dashboard/GetVoltageIRGrade",
                                data: { itemcode: itemcode, capgrade: capgrade },
                                dataType: "json",
                                success: function (res) {
                                    var lst = res;
                                    $('#IRGrade').empty();
                                    if (lst.length === 0) {
                                        $('#IRGrade').attr("required", true);
                                        $('#IRGrade').attr("disabled", true);
                                        //$('#' + rowid).selectpicker('refresh');
                                    }
                                    else if (lst.length === 1) {
                                        $('#IRGrade').attr("disabled", false);
                                        var optionbc = '<option value="' + lst[0].IRGrade + '">' + lst[0].IRGrade + '</option>';
                                        $('#IRGrade').append(optionbc);
                                        var irgrade = lst[0].IRGrade;
                                        $('#VoltageModels_IRGrade').val(irgrade);
                                        var coUrl = '/Dashboard/GetVoltageGrading';
                                        $.getJSON(coUrl, { itemcode: itemcode, capgrade: capgrade, irgrade: irgrade }, function (response) {
                                            $('#tblVoltage').DataTable().destroy();
                                            $('#tblVoltage').find('tbody').find('tr').remove();
                                            var inc = 1;
                                            $.each(response, function (index, item) {
                                                $('#tblVoltage').find('tbody').append(
                                                    "<tr>" +
                                                    "<td class='w-10'> <input class='form-control' id='VoltageModelList_LineNo_" + inc + "' name='VoltageModelList_LineNo_" + inc + "' value=" + inc + " disabled required='True' type='text'></td>" +
                                                    "<td class='w-10'> <input type='text' id='VoltageModelList_VoltageGrade_" + inc + "' name='VoltageModelList_VoltageGrade_" + inc + "' value=" + item.VoltageGrade + " class='form-control voltagegrade' disabled /></td> " +
                                                    "<td class='w-10'> <input type='text' id='VoltageModelList_Quantity_" + inc + "' name='VoltageModelList_Quantity_" + inc + "' value='' class='form-control quantity' /></td>" +
                                                    "</tr>");
                                                inc++;
                                            });
                                        });
                                        $.ajax({
                                            type: "GET",
                                            url: "/Dashboard/GetVoltageIRQuantity",
                                            data: { itemcode: itemcode, capgrade: capgrade, irgrade: irgrade },
                                            dataType: "json",
                                            success: function (res) {
                                                var lstwb = res;
                                                $("#VoltageModels_Quantity").val(lstwb[0].Quantity);
                                            }
                                        });

                                    } else if (lst.length > 1) {
                                        $('#IRGrade').attr("disabled", false);
                                        var optionc = '<option value="">--Select IR Grade--</option>';
                                        $('#IRGrade').append(optionc);
                                        $('#IRGrade').attr("required", true);
                                        for (var i = 0; i < lst.length; i++) {
                                            optionc = '<option value="' + lst[i].IRGrade + '">' + lst[i].IRGrade + '</option>';
                                            $('#IRGrade').append(optionc);
                                        }
                                    }
                                    else {
                                        $('#IRGrade').empty();
                                    }
                                }
                            });

                        } else if (lstw.length > 1) {
                            $('#CapGrade').attr("disabled", false);
                            var optionc = '<option value="">--Select Capacity Grade--</option>';
                            $('#CapGrade').append(optionc);
                            $('#CapGrade').attr("required", true);
                            for (var i = 0; i < lstw.length; i++) {
                                optionc = '<option value="' + lstw[i].CapacityGrade + '">' + lstw[i].CapacityGrade + '</option>';
                                $('#CapGrade').append(optionc);
                            }
                        }
                        else {
                            $('#CapGrade').empty();
                        }
                    }
                });
            }
        }
    });

    $("#CapGrade").change(function (event) {
        var capgrade = $(this).val();
        $('#VoltageModels_CapacityGrade').val(capgrade);
        var itemcode = $('#VoltageModels_ItemCode').val();
        $('#tblVoltage').DataTable().destroy();
        $('#tblVoltage').find('tbody').find('tr').remove();
        if (capgrade !== "") {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetVoltageIRGrade",
                data: { itemcode: itemcode, capgrade: capgrade },
                dataType: "json",
                success: function (res) {
                    var lst = res;
                    $('#IRGrade').empty();
                    if (lst.length === 0) {
                        $('#IRGrade').attr("required", true);
                        $('#IRGrade').attr("disabled", true);
                        //$('#' + rowid).selectpicker('refresh');
                    }
                    else if (lst.length === 1) {
                        $('#IRGrade').attr("disabled", false);
                        var optionbc = '<option value="' + lst[0].IRGrade + '">' + lst[0].IRGrade + '</option>';
                        $('#IRGrade').append(optionbc);
                        var irgrade = lst[0].IRGrade;
                        $('#VoltageModels_IRGrade').val(irgrade);
                        var coUrl = '/Dashboard/GetVoltageGrading';
                        $.getJSON(coUrl, { itemcode: itemcode, capgrade: capgrade, irgrade: irgrade }, function (response) {
                            $('#tblVoltage').DataTable().destroy();
                            $('#tblVoltage').find('tbody').find('tr').remove();
                            var inc = 1;
                            $.each(response, function (index, item) {
                                $('#tblVoltage').find('tbody').append(
                                    "<tr>" +
                                    "<td class='w-10'> <input class='form-control' id='VoltageModelList_LineNo_" + inc + "' name='VoltageModelList_LineNo_" + inc + "' value=" + inc + " disabled required='True' type='text'></td>" +
                                    "<td class='w-10'> <input type='text' id='VoltageModelList_VoltageGrade_" + inc + "' name='VoltageModelList_VoltageGrade_" + inc + "' value=" + item.VoltageGrade + " class='form-control voltagegrade' disabled /></td> " +
                                    "<td class='w-10'> <input type='text' id='VoltageModelList_Quantity_" + inc + "' name='VoltageModelList_Quantity_" + inc + "' value='' class='form-control quantity' /></td>" +
                                    "</tr>");
                                inc++;
                            });
                        });
                        $.ajax({
                            type: "GET",
                            url: "/Dashboard/GetVoltageIRQuantity",
                            data: { itemcode: itemcode, capgrade: capgrade, irgrade: irgrade },
                            dataType: "json",
                            success: function (res) {
                                var lstwb = res;
                                $("#VoltageModels_Quantity").val(lstwb[0].Quantity);
                            }
                        });

                    } else if (lst.length > 1) {
                        $('#IRGrade').attr("disabled", false);
                        var optionc = '<option value="">--Select IR Grade--</option>';
                        $('#IRGrade').append(optionc);
                        $('#IRGrade').attr("required", true);
                        for (var i = 0; i < lst.length; i++) {
                            optionc = '<option value="' + lst[i].IRGrade + '">' + lst[i].IRGrade + '</option>';
                            $('#IRGrade').append(optionc);
                        }
                    }
                    else {
                        $('#IRGrade').empty();
                    }
                }
            });
        }
    });

    $("#IRGrade").change(function (event) {
        var irgrade = $(this).val();
        $('#VoltageModels_IRGrade').val(irgrade);
        var itemcode = $('#VoltageModels_ItemCode').val();
        //var bcode = $('#VoltageModels_Barcode').val();
        var capgrade = $('#VoltageModels_CapacityGrade').val();
        $('#tblVoltage').DataTable().destroy();
        $('#tblVoltage').find('tbody').find('tr').remove();
        if (irgrade !== "") {
            $('#VoltageModels_IRGrade').val(irgrade);
            var coUrl = '/Dashboard/GetVoltageGrading';
            $.getJSON(coUrl, { itemcode: itemcode, capgrade: capgrade, irgrade: irgrade }, function (response) {
                $('#tblVoltage').DataTable().destroy();
                $('#tblVoltage').find('tbody').find('tr').remove();
                var inc = 1;
                $.each(response, function (index, item) {
                    $('#tblVoltage').find('tbody').append(
                        "<tr>" +
                        "<td class='w-10'> <input class='form-control' id='VoltageModelList_LineNo_" + inc + "' name='VoltageModelList_LineNo_" + inc + "' value=" + inc + " disabled required='True' type='text'></td>" +
                        "<td class='w-10'> <input type='text' id='VoltageModelList_VoltageGrade_" + inc + "' name='VoltageModelList_VoltageGrade_" + inc + "' value=" + item.VoltageGrade + " class='form-control voltagegrade' disabled /></td> " +
                        "<td class='w-10'> <input type='text' id='VoltageModelList_Quantity_" + inc + "' name='VoltageModelList_Quantity_" + inc + "' value='' class='form-control quantity' /></td>" +
                        "</tr>");
                    inc++;
                });
            });
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetVoltageIRQuantity",
                data: { itemcode: itemcode, capgrade: capgrade, irgrade: irgrade },
                dataType: "json",
                success: function (res) {
                    var lstwb = res;
                    $("#VoltageModels_Quantity").val(lstwb[0].Quantity);
                }
            });
        }
    });

    var ttQty = 0;
    $("#tblVoltage").on("blur", ".quantity", function (event) {
        var currentRow = $(this).closest("tr");
        var total = $('#VoltageModels_Quantity').val();
        ttQty = parseFloat(total);
        var tQty = 0;
        $("#tblVoltage tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var qty = $(tds[2]).find('.iquantity').val();
            if (qty !== "" && qty !== "0") {
                tQty = parseFloat(tQty) + parseFloat(qty);
            }
        });
        if (tQty > ttQty) {
            currentRow.find("td:eq(2)").find("input").val("");
            currentRow.find("td:eq(2)").find("input").focus();
            alert('Voltage grading quantity is greater than available quantity');
        }
    });

    $('#tblVoltage').on('keypress', '.quantity', function (event) {
        return isNumber(event, this);
    });

    $('#voltagesubmit').on('click', function (e) {
        e.preventDefault();
        var list = new Array();
        var list1 = new Array();
        var itemcode = $('#VoltageModels_ItemCode').val();
        var capgrade = $('#VoltageModels_CapacityGrade').val();
        var irgrade = $('#VoltageModels_IRGrade').val();
        var quantity = $('#VoltageModels_Quantity').val();
        var gjcn = $('#VoltageModels_GradeJobCardNo').val();
        if (gjcn !== "" && itemcode !== "" && capgrade !== "" && irgrade !== "" && quantity !== "" && quantity !== "0") {
            var voltageheader = {
                GradeJobCardNo: gjcn,
                ItemCode: itemcode,
                CapacityGrade: capgrade,
                IRGrade: irgrade
            };
            list.push(voltageheader);
            $("#tblVoltage tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var voltagegrade = $(tds[1]).find('.ivoltagegrade').val();
                var qty = $(tds[2]).find('.iquantity').val();
                if (voltagegrade !== "" && qty !== "") {
                    var incritm = {
                        VoltageGrade: voltagegrade,
                        VoltageQuantity: parseFloat(qty)
                    };
                    list1.push(incritm);
                }
            });

            var voltagehead = JSON.stringify(list);
            var voltageitem = JSON.stringify(list1);
            if (voltagehead.length > 0 && voltageitem.length > 0) {
                $.ajax({
                    url: "/Dashboard/InsertVoltage",
                    dataType: "json",
                    data: "{'voltagehead': '" + voltagehead + "', 'voltageitem': '" + voltageitem + "' }",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        location.reload();
                    },
                    error: function () {

                    }
                });
            }
        }
    });

});

/* Store End */


/* Work Start */

//Work Order Table
$(document).ready(function () {


    var workorderlist = $('#workorderlist').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //WorkOrderNo
            { 'targets': 3, 'width': '150' },   //OrderDate
            { 'targets': 4, 'width': '100' },   //DeliveryDate
            { 'targets': 4, 'width': '100' },   //CustomerCode
            { 'targets': 5, 'width': '200' }    //Notes
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    workorderlist.on('order.dt search.dt', function () {
        workorderlist.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            workorderlist.cell(cell).invalidate('dom');
        });
    }).draw();
    //Work Order Table

    // $('#salesOrderlinelist').on('blur', '.amount', function () {
    //   AddNewRow(this, "item-data", "salesOrderlinelist");
    //});


    var sel_customer_list = $('#sel_customer_list').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false, 'className': 'select-checkbox' },   //SNo.
            { 'targets': 1, 'width': '100' },       //CustomerCode
            { 'targets': 2, 'width': '100' },       //Name
            { 'targets': 3, 'width': '100' },       //Contact
            { 'targets': 4, 'width': '200' }       //Address
        ],
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        "order": [3, 'asc'],
        "paging": true
    });

    $("#sel_customer_list_filter input").keypress(function () {
        $('#sel_customer_list tbody tr').removeClass("selected");
    });

    $('#sel_customer_list tbody').on('click', 'tr', function () {
        $('#sel_customer_list tbody tr').removeClass("selected");
        $(this).toggleClass('selected');
    });

    $('#btn_SelCustomer').click(function () {
        var tbl = $('#sel_customer_list').DataTable();
        var custcode = $.map(tbl.rows('.selected').data(), function (item) {
            return item[1];
        });
        var custname = $.map(tbl.rows('.selected').data(), function (item) {
            return item[2];
        });
        $('.custcode').val(custcode.toString());
        $('.custname').val(custname.toString());
        $('#sel_customer_list tbody tr').removeClass("selected");
    });


    $('#wosubmit').on('click', function (e) {
        $("#wosubmit").attr("disabled", true);
        e.preventDefault();
        var linkObj = $(this);
        var hdArr = new Array();
        var lnArr = new Array();
        var wonumber = $('.wonumber').val();
        var empcode = $('.empcode').val();
        var orddate = $('.orderdate').val();
        var dlvdate = $('.deliverydate').val();
        var notes = $('.notes').val();
        var frmact = $('.frmact').val();
        if (wonumber !== "" && empcode !== "" && orddate !== "") {
            var pheader = {
                OrderDate: orddate,
                DeliveryDate: dlvdate,
                WONumber: wonumber,
                SlsPerCode: empcode,
                Notes: notes
            };
            hdArr.push(pheader);

            $(".tbl tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var lineno = $(tds[0]).find('.ilineno').val();
                var itmcode = $(tds[1]).find('.iitemcode').val();
                var unitprice = $(tds[3]).find('.iunitprice').val();
                var qty = $(tds[4]).find('.iquantity').val();
                if (lineno !== "" && itmcode !== "" && unitprice !== "" && qty !== "") {
                    var lin = {
                        LineNo: lineno,
                        ItemCode: itmcode,
                        UnitPrice: parseFloat(unitprice),
                        Quantity: parseFloat(qty)
                    };
                    lnArr.push(lin);
                }
            });
            var woh = JSON.stringify(hdArr);
            var wol = JSON.stringify(lnArr);
            if (wol.length > 0) {
                $.ajax({
                    url: "/Dashboard/UpsertWorkOrder",
                    dataType: "json",
                    data: "{'woh': '" + woh + "', 'wol': '" + wol + "', 'act': '" + frmact + "'}",
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
        }
        else {
            alert("Please fill the required fields.");
        }

        $("#wosubmit").attr("disabled", false);
    });

});

/* Work End */


/* Inventory Start */
$(document).ready(function () {

    //AdocMaterialIssues Table
    var AdocMaterialIssuesList = $('#tblAdocMaterialIssues').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '150' },  //EmpCode
            { 'targets': 2, 'width': '150' },   //EmpName
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    AdocMaterialIssuesList.on('order.dt search.dt', function () {
        AdocMaterialIssuesList.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            AdocMaterialIssuesList.cell(cell).invalidate('dom');
        });
    }).draw();
    //AdocMaterialIssues Table

    $("#tblAdocMaterialIssue").on("blur", ".iitemcode", function (event) {
        var currentRow = $(this).closest("tr");
        var itmcode = currentRow.find("td:eq(1)").find(".iitemcode").val()                
        currentRow.find("td:eq(3)").find("input").val("");
        if (itmcode !== undefined || itmcode !== "") {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetQuantity",
                data: { itemcode: itmcode },
                dataType: "json",
                success: function (res) {
                    var lstwb = res;
                        currentRow.find("td:eq(3)").find("input").val(lstwb[0].RemainingQty);
                }
            });
        }
    });

    $(document).on('blur', '.iqty', function () {
       var currentRow = $(this).closest("tr");
           var tqty = currentRow.find("td:eq(3)").find("input").val();
           var isqty = currentRow.find("td:eq(4)").find("input").val();
        if (tqty !== "" && isqty !== "") {
            if (parseFloat(isqty) > parseFloat(tqty)) {
                $("#adocsubmit").attr("disabled", true);
                $("#adocrsubmit").attr("disabled", true);
                alert("Issue quantity is greater than available quantity");
                currentRow.find("td:eq(4)").find("input").val("");
                currentRow.find("td:eq(4)").find("input").focus();
            }
            else {
                $("#adocsubmit").attr("disabled", false);
                $("#adocrsubmit").attr("disabled", false);
            }
        }
        else
        {
            alert("Quantity is not available");
            currentRow.find("td:eq(4)").find("input").val("");
            currentRow.find("td:eq(4)").find("input").focus();
        }
    });

    $('#adocsubmit').on('click', function (e) {
        $("#adocsubmit").attr("disabled", true);
        e.preventDefault();
        var linkObj = $(this);
        var hdArr = new Array();
        var lnArr = new Array();
        var jobcardno = $('.jobcardno').val();
        var empcode = $('.empcode').val();
        var issuedate = $('.issuedate').val().trim();
        var notes = $('.notes').val();
        var frmact = $('.frmact').val();
        if (jobcardno !== "" && empcode !== "" && issuedate !== "") {
            var pheader = {
                JobCardNo: jobcardno,
                EmpCode: empcode,
                IssueDate: issuedate,
                Notes: notes
            };
            hdArr.push(pheader);

            $(".tbl tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var lineno = $(tds[0]).find('.ilineno').val();
                var itmcode = $(tds[1]).find('.iitemcode').val();
                var issueqty = $(tds[4]).find('.iissueqty').val();
                if (lineno !== "" && itmcode !== "" && issueqty !== "") {
                    var lin = {
                        JobCardNo: jobcardno,
                        LineNo: lineno,
                        ItemCode: itmcode,
                        IssueQty: parseFloat(issueqty)
                    };
                    lnArr.push(lin);
                }
            });

            if (lnArr.length > 0) {
                var ih = JSON.stringify(hdArr);
                var il = JSON.stringify(lnArr);

                $.ajax({
                    url: "/Dashboard/UpsertAdocMaterialIssue",
                    dataType: "json",
                    data: "{'ih': '" + ih + "', 'il': '" + il + "', 'act': '" + frmact + "' }",
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
                alert("No material issue lines are found.");
            }
        }
        else {
            alert("Please fill the required fields.");
        }

        $("#adocsubmit").attr("disabled", false);
    });

    $('#adocrsubmit').on('click', function (e) {
        $("#adocrsubmit").attr("disabled", true);
        e.preventDefault();
        var linkObj = $(this);
        var lnArr = new Array();
        var empcode = $('.empcode').val();
        var notes = $('.notes').val();
        var frmact = $('.frmact').val();
        $(".tbl tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var lineno = $(tds[0]).find('.ilineno').val();
            var itmcode = $(tds[1]).find('.iitemcode').val();
            var retqty = $(tds[4]).find('.iquantity').val();
            if (lineno !== "" && itmcode !== "" && retqty !== "") {
                var lin = {
                    EmpCode:empcode,
                    Notes: notes,
                    LineNo: lineno,
                    ItemCode: itmcode,
                    Quantity: parseFloat(retqty)
                };
                lnArr.push(lin);
            }
        });

        if (lnArr.length > 0) {
            var il = JSON.stringify(lnArr);

            $.ajax({
                url: "/Dashboard/UpsertAdocMaterialReturn",
                dataType: "json",
                data: "{'il': '" + il + "', 'act': '" + frmact + "' }",
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
            alert("No material return lines are found.");
        }

        $("#adocsubmit").attr("disabled", false);
    });

    //BOM Table
    var BOMList = $('#BOMList').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '200', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //ParItem
            { 'targets': 3, 'width': '150' }   //ParItemName
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    BOMList.on('order.dt search.dt', function () {
        BOMList.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            BOMList.cell(cell).invalidate('dom');
        });
    }).draw();
    //BOM Table

    //Start BOMItemList
    var sel_bomitem_list = $('#sel_bomitem_list').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100' },   //ProductCode
            { 'targets': 2, 'width': '100' },   //ItemCode
            { 'targets': 3, 'width': '200' },   //ItemName
            { 'targets': 4, 'width': '100' }    //Quantity
        ],
        "order": [1, 'asc'],
        "paging": true
    });
    sel_bomitem_list.on('order.dt search.dt', function () {
        sel_bomitem_list.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            sel_bomitem_list.cell(cell).invalidate('dom');
        });
    }).draw();
    //Complete BOMItemList



    $(document).on("blur", ".titem", function (event) {
        var currentRow = $(this).closest("tr");
        var code = $('.titem').val();
        if (code !== undefined || code !== "") {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetItemByCode",
                data: { code: code },
                dataType: "json",
                success: function (res) {
                    var lst = res;
                    if (lst.length > 0) {
                        $('.titemname').val(lst[0].ItemName);

                    }
                    else {
                        $('.titemname').val("");
                        $('.titemname').focus();
                    }
                }
            });
        }
    });

    $('#bomsubmit').on('click', function (e) {
        $("#bomsubmit").attr("disabled", true);
        e.preventDefault();
        var linkObj = $(this);
        var lnArr = new Array();
        var bomcode = $('.bomcode').val();
        var paritem = $('.itemcode').val();
        var frmact = $('.frmact').val();
        if (bomcode !== "" && paritem !== "") {
            $(".tbl tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var lineno = $(tds[0]).find('.ilineno').val();
                var itmcode = $(tds[1]).find('.iitemcode').val();
                var qty = $(tds[3]).find('.iquantity').val();
                if (lineno !== "" && itmcode !== "" && qty !== "") {
                    var lin = {
                        BOMCode: bomcode,
                        ParItem: paritem,
                        LineNo: lineno,
                        CompItem: itmcode,
                        Quantity: parseFloat(qty)
                    };
                    lnArr.push(lin);
                }
            });

            if (lnArr.length > 0) {
                var bom = JSON.stringify(lnArr);
                $.ajax({
                    url: "/Dashboard/UpsertBillOfMaterial",
                    dataType: "json",
                    data: "{'bom': '" + bom + "', 'act': '" + frmact + "'}",
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
        }
        else {
            alert("Please fill the required fields.");
        }

        $("#bomsubmit").attr("disabled", false);
    });

    //$("#upsubmit").on("click", function (e) {
        //e.preventDefault();
        //var hdArr = new Array();
        //var userId = $('#UserId').val();
        //$("input:checkbox[class=chk]").each(function () {
            //if($(this).is(":checked")){
                //var allchk = {
                //Id: $(this).attr("id"),
                //Value: $(this).val(),
                //UserId :userId
            //};
            //hdArr.push(allchk);
                //alert("Id: " + $(this).attr("id") + " Value: " + $(this).val() + " Checked: " + $(this).is(":checked"));
            //}      
        //});
        //alert(Hi);
    //});

    $("#upsubmit").on("click", function (e) {
        e.preventDefault();
        var hdArr = new Array();
        var userId = $('#UserPermissionModels_UserId').val();
        $("input:checkbox[class=chk]").each(function () {
                var allchk = {
                Name: $(this).attr("id"),
                Value: $(this).val(),
                Checked: $(this).is(":checked"),
                UserId :userId
            };
            hdArr.push(allchk);
        });  
        if (hdArr.length > 0) {
            var frmact = "";
            var pgn = JSON.stringify(hdArr);
            $.ajax({
                url: "/Dashboard/UpsertUserPermission",
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
            alert("");
        }
        alert(Hi);
    });

    //Cell Grading table
    var cellgrading = $('#tblcellgrading').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2 },   //ItemCode
            { 'targets': 3 },   //ItemName
            { 'targets': 4 },   //GradingType
            { 'targets': 5 }   //Range
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    cellgrading.on('order.dt search.dt', function () {
        cellgrading.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            cellgrading.cell(cell).invalidate('dom');
        });
    }).draw();
    //Cell Grading table

    //Start stocks
    var stocks = $('#tblstocks').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50px', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '60px' },   //ItemCode
            { 'targets': 2, 'width': '200px' },  //ItemName
            { 'targets': 3, 'width': '50px' },   //Quantity
            { 'targets': 4, 'width': '50px' },   //ScrapQty
            { 'targets': 5, 'width': '50px' },    //Warehousecode
            { 'targets': 6, 'width': '100px' }    //WarehouseName
        ],
        "order": [1, 'asc'],
        "paging": true
    });
    stocks.on('order.dt search.dt', function () {
        stocks.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            stocks.cell(cell).invalidate('dom');
        });
    }).draw();
    //Complete stocks

    //Start stocks
    var stocksreport = $('#tblstocksreport').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50px', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '60px' },   //ItemCode
            { 'targets': 2, 'width': '200px' },  //ItemName
            { 'targets': 3, 'width': '50px' },   //Quantity
            { 'targets': 4, 'width': '50px' },   //ScrapQty
            { 'targets': 5, 'width': '50px' },    //Warehousecode
            { 'targets': 6, 'width': '100px' }    //WarehouseName
        ],
        "scrollX":true,
        "order": [1, 'asc'],
        "paging": true,
        dom: 'Bfrtip',
        "buttons": [
            {
                extend: 'print',
                text: '<i class="fa fa-print"></i> Print',
                title: "Stock Report",
                autoPrint: false,
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'excel',
                text: '<i class="fa fa-print"></i> Excel',
                title: "Stock Report",
                exportOptions: {
                    columns: ':visible'
                }
            }, 'colvis'
        ]
    });
    stocksreport.on('order.dt search.dt', function () {
        stocksreport.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            stocksreport.cell(cell).invalidate('dom');
        });
    }).draw();
    //Complete stocks Report

    //POReceipt Table
    var tblporeceiptreport = $('#tblporeceiptreport').DataTable({
        "paging": true,
        dom: 'Bfrtip',
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1 },   //PONumber
            { 'targets': 2 },   //OrderDate
            { 'targets': 3 },   //VendorCode
            { 'targets': 4 },   //InvoiceNo
            { 'targets': 5 },   //WarehouseCode
            { 'targets': 6 }    //Notes
        ],
        "buttons": [
            {
                extend: 'print',
                text: '<i class="fa fa-print"></i> Print',
                title: "Stock Report",
                autoPrint: false,
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'excel',
                text: '<i class="fa fa-print"></i> Excel',
                title: "Stock Report",
                exportOptions: {
                    columns: ':visible'
                }
            }, 'colvis'
        ]
        //"order": [2, 'asc']
    });

    tblporeceiptreport.on('order.dt search.dt', function () {
        tblporeceiptreport.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblporeceiptreport.cell(cell).invalidate('dom');
        });
    }).draw();
    //POReceipt Table

    //Purchase Order Table
    var tblpurchaseorderreport = $('#tblpurchaseorderreport').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //PONumber
            { 'targets': 3, 'width': '150' },   //OrderDate
            { 'targets': 4, 'width': '100' },   //VendorCode
            { 'targets': 5, 'width': '200' }    //Notes
        ],
        "order": [2, 'asc'],
        "paging": true,
        dom: 'Bfrtip',
        "buttons": [
            {
                extend: 'print',
                text: '<i class="fa fa-print"></i> Print',
                title: "Stock Report",
                autoPrint: false,
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'excel',
                text: '<i class="fa fa-print"></i> Excel',
                title: "Stock Report",
                exportOptions: {
                    columns: ':visible'
                }
            }, 'colvis'
        ]
    });

    tblpurchaseorderreport.on('order.dt search.dt', function () {
        tblpurchaseorderreport.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblpurchaseorderreport.cell(cell).invalidate('dom');
        });
    }).draw();
    //Purchase Order Table

     var workorderlistreport = $('#workorderlistreport').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //WorkOrderNo
            { 'targets': 3, 'width': '150' },   //OrderDate
            { 'targets': 4, 'width': '100' },   //DeliveryDate
            { 'targets': 5, 'width': '100' },   //CustomerCode
            { 'targets': 6, 'width': '200' }    //Notes
        ],
        "order": [2, 'asc'],
        "paging": true,
         dom: 'Bfrtip',
        "buttons": [
            {
                extend: 'print',
                text: '<i class="fa fa-print"></i> Print',
                title: "Stock Report",
                autoPrint: false,
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'excel',
                text: '<i class="fa fa-print"></i> Excel',
                title: "Stock Report",
                exportOptions: {
                    columns: ':visible'
                }
            }, 'colvis'
        ]
    });

    workorderlistreport.on('order.dt search.dt', function () {
        workorderlistreport.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            workorderlistreport.cell(cell).invalidate('dom');
        });
    }).draw();
    //Work Order Table

    //Start stocks

    var AsmJobCardReport = $('#tblAsmJobCardReport').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50px', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '50px'  },   //JobCardNo
            { 'targets': 2, 'width': '50px'  },   //SlsOrdNo
            { 'targets': 3, 'width': '50px'  },   //StartDate
            { 'targets': 4, 'width': '50px'  },   //DeliveryDate
            { 'targets': 5, 'width': '50px'  },   //AssignEmpCode
            { 'targets': 6, 'width': '100px' },   //AssignEmpName
            { 'targets': 7, 'width': '50px'  }    //Status
        ],
        "scrollX":true,
        "order": [1, 'asc'],
        "paging": true,
         dom: 'Bfrtip',
        "buttons": [
            {
                extend: 'print',
                text: '<i class="fa fa-print"></i> Print',
                title: "Assembly Job Card Report",
                autoPrint: false,
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'excel',
                text: '<i class="fa fa-print"></i> Excel',
                title: "Assembly Job Card Report",
                exportOptions: {
                    columns: ':visible'
                }
            }, 'colvis'
        ]
    });
    AsmJobCardReport.on('order.dt search.dt', function () {
        AsmJobCardReport.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            AsmJobCardReport.cell(cell).invalidate('dom');
        });
    }).draw();

    AsmJobCardReport.buttons().container()
        .appendTo($('div.eight.column:eq(0)', AsmJobCardReport.table().container()));
    //Complete stocks

    //Start stocks
    var GrdJobCardReport = $('#tblGrdJobCardReport').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50px', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '50px'  },   //JobCardNo
            { 'targets': 2, 'width': '50px'  },   //StartDate
            { 'targets': 3, 'width': '50px'  },   //AssignEmpCode
            { 'targets': 4, 'width': '50px'  },   //AssignEmpName
            { 'targets': 5, 'width': '50px'  }    //Status
        ],
        "scrollX":true,
        "order": [1, 'asc'],
        "paging": true,
        dom: 'Bfrtip',
        "buttons": [
            {
                extend: 'print',
                text: '<i class="fa fa-print"></i> Print',
                title: "Grade Job Card Report",
                autoPrint: false,
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'excel',
                text: '<i class="fa fa-print"></i> Excel',
                title: "Grade Job Card Report",
                exportOptions: {
                    columns: ':visible'
                }
            }, 'colvis'
        ]
    });
    GrdJobCardReport.on('order.dt search.dt', function () {
        GrdJobCardReport.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            GrdJobCardReport.cell(cell).invalidate('dom');
        });
    }).draw();
    GrdJobCardReport.buttons().container()
    .appendTo($('div.eight.column:eq(0)', GrdJobCardReport.table().container()));
    //Complete stocks

    //Start stocks
    var tblAdocMaterialIssueReport = $('#tblAdocMaterialIssueReport').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50px', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '50px'  },   //ItemCode
            { 'targets': 2, 'width': '50px'  },   //ItemName
            { 'targets': 3, 'width': '50px'  },   //Quantity
            { 'targets': 4, 'width': '50px'  },   //AssignEmpCode
            { 'targets': 5, 'width': '50px'  },   //AssignEmpName
            { 'targets': 6, 'width': '50px'  }   //Issue Date
        ],
        "scrollX":true,
        "order": [1, 'asc'],
        "paging": true,
        dom: 'Bfrtip',
        "buttons": [
            {
                extend: 'print',
                text: '<i class="fa fa-print"></i> Print',
                title: "Adoc Material Issue Report",
                autoPrint: false,
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'excel',
                text: '<i class="fa fa-print"></i> Excel',
                title: "Adoc Material Issue Report",
                exportOptions: {
                    columns: ':visible'
                }
            }, 'colvis'
        ]
    });
    tblAdocMaterialIssueReport.on('order.dt search.dt', function () {
        tblAdocMaterialIssueReport.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblAdocMaterialIssueReport.cell(cell).invalidate('dom');
        });
    }).draw();
    tblAdocMaterialIssueReport.buttons().container()
    .appendTo($('div.eight.column:eq(0)', tblAdocMaterialIssueReport.table().container()));
    //Complete stocks

//Start stocks
    var tblAdocMaterialReturnReport = $('#tblAdocMaterialReturnReport').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50px', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '50px'  },   //ItemCode
            { 'targets': 2, 'width': '50px'  },   //ItemName
            { 'targets': 3, 'width': '50px'  },   //Quantity
            { 'targets': 4, 'width': '50px'  },   //AssignEmpCode
            { 'targets': 5, 'width': '50px'  },   //AssignEmpName
            { 'targets': 6, 'width': '50px'  }    //Return Date
        ],
        "scrollX":true,
        "order": [1, 'asc'],
        "paging": true,
         dom: 'Bfrtip',
        "buttons": [
            {
                extend: 'print',
                text: '<i class="fa fa-print"></i> Print',
                title: "Adoc Material Return Report",
                autoPrint: false,
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'excel',
                text: '<i class="fa fa-print"></i> Excel',
                title: "Adoc Material Return Report",
                exportOptions: {
                    columns: ':visible'
                }
            }, 'colvis'
        ]
    });
    tblAdocMaterialReturnReport.on('order.dt search.dt', function () {
        tblAdocMaterialReturnReport.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            tblAdocMaterialReturnReport.cell(cell).invalidate('dom');
        });
    }).draw();
    tblAdocMaterialReturnReport.buttons().container()
    .appendTo($('div.eight.column:eq(0)', tblAdocMaterialReturnReport.table().container()));
    //Complete stocks

    //Material Requests table
    var materialrequests = $('#tblmaterialrequests').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //JobCardNumber
            { 'targets': 3, 'width': '150' },   //JobCardType
            { 'targets': 4, 'width': '150' },   //SalesOrderNumber
            { 'targets': 5, 'width': '100' },   //StartDate
            { 'targets': 6, 'width': '100' },   //DeliveryDate
            { 'targets': 7, 'width': '100' },    //AssignEmpCode
            { 'targets': 8, 'width': '200' }    //AssignEmpName
        ],
        "scrollX": true,
        "scrollY": '50vh',
        "order": [2, 'asc'],
        "paging": true
    });

    materialrequests.on('order.dt search.dt', function () {
        materialrequests.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            materialrequests.cell(cell).invalidate('dom');
        });
    }).draw();
    //Material Requests table

    //Material Issues table
    var materialissues = $('#tblmaterialissues').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //JobCardNumber
            { 'targets': 3, 'width': '150' },   //JobCardType
            { 'targets': 4, 'width': '100' },   //Release No
            { 'targets': 5, 'width': '100' },   //StartDate
            { 'targets': 6, 'width': '100' },   //DeliveryDate
            { 'targets': 7, 'width': '100' },    //AssignEmpCode
            { 'targets': 8, 'width': '200' }    //AssignEmpName
        ],
        "scrollX": true,
        "scrollY": '50vh',
        "order": [2, 'asc'],
        "paging": true
    });

    materialissues.on('order.dt search.dt', function () {
        materialissues.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            materialissues.cell(cell).invalidate('dom');
        });
    }).draw();
    //Material Issue table

    //$(document).on('blur', '.iissueqty', function () {
    //    var currentRow = $(this).closest("tr");
    //    var tqty = currentRow.find("td:eq(3)").find("input").val();
    //    var isqty = currentRow.find("td:eq(5)").find("input").val();

    //    if (tqty !== "" && isqty !== "") {

    //        if (parseFloat(tqty) !== parseFloat(isqty)) {
    //            $("#gmisubmit").attr("disabled", true);
    //            alert("Issue quantity is not equal to total quantity");
    //        }
    //        else {
    //            $("#gmisubmit").attr("disabled", false);
    //        }
    //    }
    //});

    $("#asmmatiss").on("blur", ".imiitemcode", function (event) {

        var currentRow = $(this).closest("tr");
        var itemcode = currentRow.find("td:eq(1)").find("input").val();
        var itmId = $(this).attr("id");
        var sel_capgrade = itmId.replace(/\ItemCode/g, 'Capacity');
        $('#' + sel_capgrade).empty();
        var sel_irgrade = itmId.replace(/\ItemCode/g, 'IR');
        $('#' + sel_irgrade).empty();
        var sel_volgrade = itmId.replace(/\ItemCode/g, 'Voltage');
        $('#' + sel_volgrade).empty();
        currentRow.find("td:eq(6)").find("input").val("");
        var row = $("#asmmatiss tr:last");
        var jcnumber = row.find("td:eq(1)").html();
        if (itemcode !== "" || itemcode !== undefined) {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetItemStockByCode",
                data: { code: itemcode },
                dataType: "json",
                success: function (res) {
                    if (res.error === "") {
                        var itm = res.Item;
                        currentRow.find("td").find(".iitemname").val(itm.ItemName);
                        $('#' + sel_capgrade).append(optc);
                        var cap = res.Capacity;
                        if (cap.length > 0) {
                            var optc = '<option value="">-- Capacity --</option>';
                            $('#' + sel_capgrade).append(optc);
                            $('#' + sel_capgrade).attr("required", true);
                            for (var i = 0; i < cap.length; i++) {
                                optc = '<option value="' + cap[i].Capacity + '">' + cap[i].Capacity + '</option>';
                                $('#' + sel_capgrade).append(optc);
                            }
                        }
                        else {
                            $('#' + sel_capgrade).empty();
                            var optc = '<option value="">-- Capacity --</option>';
                            $('#' + sel_capgrade).append(optc);
                            currentRow.find("td:eq(7)").find("input").val("");
                        }
                        var ir = res.IR;
                        if (ir.length > 0) {
                            var opti = '<option value="">-- IR --</option>';
                            $('#' + sel_irgrade).append(opti);
                            $('#' + sel_irgrade).attr("required", true);
                            for (var i = 0; i < ir.length; i++) {
                                opti = '<option value="' + ir[i].IR + '">' + ir[i].IR + '</option>';
                                $('#' + sel_irgrade).append(opti);
                            }
                        }
                        else {
                            $('#' + sel_irgrade).empty();
                            var opti = '<option value="">-- IR --</option>';
                            $('#' + sel_irgrade).append(opti);
                            currentRow.find("td:eq(7)").find("input").val("");
                        }
                        var vlt = res.Voltage;
                        if (vlt.length > 0) {
                            var optv = '<option value="">-- Voltage --</option>';
                            $('#' + sel_volgrade).append(optv);
                            $('#' + sel_volgrade).attr("required", true);
                            for (var i = 0; i < vlt.length; i++) {
                                optv = '<option value="' + vlt[i].Voltage + '">' + vlt[i].Voltage + '</option>';
                                $('#' + sel_volgrade).append(optv);
                            }
                        }
                        else {
                            $('#' + sel_volgrade).empty();
                            var optv = '<option value="">-- Voltage --</option>';
                            $('#' + sel_volgrade).append(optv);
                            currentRow.find("td:eq(7)").find("input").val("");
                        }
                    }
                    else {
                        alert(res.error);
                    }
                }
            });
        }
    });

    $("#asmmatiss").on("change", ".grading", function (event) {
        var currentRow = $(this).closest("tr");
        var itemcode = currentRow.find("td").find(".imiitemcode").val();
        var capgrade = currentRow.find("td").find(".icapacity").val();
        var irgrade = currentRow.find("td").find(".iir").val();
        var vltgrade = currentRow.find("td").find(".ivoltage").val();
        var jobcardno = $(".jobcardno").val();
        var row = $("#asmmatiss tr:last");
        if ((itemcode !== "" && itemcode !== undefined) &&
            (capgrade !== "--  Capacity --" && capgrade !== undefined && capgrade !== "") &&
            (irgrade !== "--  IR --" && irgrade !== undefined && irgrade !== "") &&
            (vltgrade !== "--  Voltage --" && vltgrade !== undefined && vltgrade !== "")
        ) {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetStockByGrade",
                data: { job: jobcardno, code: itemcode, cap: capgrade, ir: irgrade, vlt: vltgrade },
                dataType: "json",
                success: function (res) {
                    if (res.error === "") {

                        var stk = res.Stock;
                        var req = res.ReqQty;
                        if (stk.length > 0) {
                            currentRow.find("td").find(".itotqty").val(stk[0].Qty);
                        }
                        else {
                            currentRow.find("td").find(".itotqty").val("");
                        }
                        if (req.length > 0) {
                            currentRow.find("td").find(".ireqqty").val(req[0].ReqQty);
                        }
                        else {
                            currentRow.find("td").find(".ireqqty").val("");
                            currentRow.find("td").find(".iissueqty").val("");
                        }
                    }
                    else {
                        alert(res.error);
                    }
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        }
    });

    $("#asmmatiss").on("blur", ".iissueqty", function (event) {
        var currentRow = $(this).closest("tr");
        var tqty = currentRow.find("td").find(".itotqty").val();
        var rqty = currentRow.find("td").find(".ireqqty").val();
        var iqty = currentRow.find("td").find(".iissueqty").val().trim();
        if(tqty !=="" && tqty !=="0")
        {
            if (iqty !== "" && iqty !=="0") 
            {
                if (parseFloat(iqty) <= parseFloat(tqty)) 
                {
                    if (parseFloat(rqty) !== parseFloat(iqty)) 
                    {
                        $("#amisubmit").attr("disabled", true);
                        alert("Issue quantity should be equal to required quantity.");

                        $('table#asmmatiss tr:last td:last').find('input').focus();
                        //currentRow.find("td.tissueqty").find("input").focus();
                    }
                    else {
                        $("#amisubmit").attr("disabled", false);
                    }
                }
                else {
                    $("#amisubmit").attr("disabled", true);
                    alert("Issue quantity should be equal to required quantity.");
                    $('table#asmmatiss tr:last td:last').find('input').focus();
                }
            }
            else {
                $("#amisubmit").attr("disabled", true);
                alert("Issue quantity should be equal to required quantity.");
                $('table#asmmatiss tr:last td:last').find('input').focus();
           }
        }
        else
        {
            $("#amisubmit").attr("disabled", true);
            alert("Stock quantity should be greater than zero.");
        }
    });

    //$(document).on('blur', '.iissueqty', function () {
    //    var currentRow = $(this).closest("tr");
    //    var tqty = currentRow.find("td:eq(3)").find("input").val();
    //    var isqty = currentRow.find("td:eq(5)").find("input").val();
    //    if (tqty != "" && isqty != "") {
    //        if (parseFloat(tqty) !== parseFloat(isqty)) {
    //            $("#gmisubmit").attr("disabled", true);
    //            alert("Issue quantity is not equal to total quantity");
    //        }
    //        else {
    //            $("#gmisubmit").attr("disabled", false);
    //        }
    //    }
    //});

    $('#amisubmit').on('click', function (e) {
        $("#amisubmit").attr("disabled", true);
        e.preventDefault();
        var linkObj = $(this);
        var hdArr = new Array();
        var lnArr = new Array();
        var jobcardno = $('.jobcardno').val();
        var jobcardtype = $('.jobcardtype').val();
        var releaseno = $('.releaseno').val();
        var issuedate = $('.issuedate').val().trim();
        var notes = $('.notes').val();
        var frmact = $('.frmact').val();
        if (jobcardno !== "" && issuedate !== "") {
            var pheader = {
                JobCardNo: jobcardno,
                JobCardType: jobcardtype,
                ReleaseNo: releaseno,
                IssueDate: issuedate,
                Notes: notes
            };
            hdArr.push(pheader);

            $(".tbl tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var lineno = $(tds[0]).find('.ilineno').val();
                var itmcode = $(tds[1]).find('.imiitemcode').val();
                var capacity = $(tds[3]).find('.icapacity').val();
                var ir = $(tds[4]).find('.iir').val();
                var voltage = $(tds[5]).find('.ivoltage').val();
                var issueqty = $(tds[8]).find('.iissueqty').val();
                if (lineno !== "" && itmcode !== "" && issueqty !== "") {
                    var lin = {
                        JobCardNo: jobcardno,
                        JobCardType: jobcardtype,
                        ReleaseNo: releaseno,
                        LineNo: lineno,
                        ItemCode: itmcode,
                        Capacity: capacity,
                        IResistance: ir,
                        Voltage: voltage,
                        IssueQty: parseFloat(issueqty)
                    };
                    lnArr.push(lin);
                }
            });

            if (lnArr.length > 0) {
                var ih = JSON.stringify(hdArr);
                var il = JSON.stringify(lnArr);

                $.ajax({
                    url: "/Dashboard/UpsertAssemblingMaterialIssue",
                    dataType: "json",
                    data: "{'ih': '" + ih + "', 'il': '" + il + "', 'act': '" + frmact + "' }",
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
                alert("No material issue lines are found.");
            }
        }
        else {
            alert("Please fill the required fields.");
        }

        $("#amisubmit").attr("disabled", false);
    });

    $("#IssueJobCardItemLineList").on("change", ".irgrade", function (event) {
        var currentRow = $(this).closest("tr");
        var itemcode = currentRow.find("td:eq(1)").find("input").val();
        var capgrade = currentRow.find("td:eq(2)").find("select").val();
        var irgrade = currentRow.find("td:eq(3)").find("select").val();
        var itmId = $(this).attr("id");
        var sel_volgrade = itmId.replace(/\IRGrade/g, 'VoltageGrade');
        $('#' + sel_volgrade).empty();
        var row = $("#JobCardItemLineList tr:last");
        var jcnumber = row.find("td:eq(1)").html();
        currentRow.find("td:eq(5)").find("input").val("");
        if ((itemcode !== "" || itemcode !== undefined) &&
            (capgrade !== "--Select Capacity Grade--" || capgrade !== undefined) &&
            (irgrade !== "--Select IR Grade--" || irgrade !== undefined)) {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetISVoltageGrade",
                data: { itemcode: itemcode, capgrade: capgrade, irgrade: irgrade },
                dataType: "json",
                success: function (res) {
                    var lstg = res;
                    $('#' + sel_volgrade).empty();
                    if (lstg.length === 0) {
                        $('#' + sel_volgrade).attr("required", true);
                        $('#' + sel_volgrade).attr("disabled", true);
                    }
                    else if (lstg.length === 1) {
                        $('#' + sel_volgrade).attr("disabled", false);
                        var optiong = '<option value="' + lstg[0].VoltageGrade + '">' + lstg[0].VoltageGrade + '</option>';
                        $('#' + sel_volgrade).append(optiong);
                        var volgrade = lstg[0].VoltageGrade;
                        $.ajax({
                            type: "GET",
                            url: "/Dashboard/GetISQuantity",
                            data: { itemcode: itemcode, capgrade: capgrade, irgrade: irgrade, volgrade: volgrade, jcnumber: jcnumber },
                            dataType: "json",
                            success: function (res) {
                                var lstwb = res;
                                if (lstwb.length === 0) {
                                    currentRow.find("td:eq(5)").find("input").val("");
                                }
                                else if (lstwb.length === 1) {
                                    currentRow.find("td:eq(5)").find("input").val(lstwb[0].Quantity);
                                }
                            }
                        });
                    } else if (lstg.length > 1) {
                        $('#' + sel_volgrade).attr("disabled", false);
                        var optiong = '<option value="">--Select Voltage Grade--</option>';
                        $('#' + sel_volgrade).append(optiong);
                        $('#' + sel_volgrade).attr("required", true);
                        for (var i = 0; i < lstg.length; i++) {
                            optiong = '<option value="' + lstg[i].VoltageGrade + '">' + lstg[i].VoltageGrade + '</option>';
                            $('#' + sel_volgrade).append(optiong);
                        }
                    }
                    else {
                        $('#' + sel_volgrade).empty();
                        currentRow.find("td:eq(5)").find("input").val("");
                    }
                }
            });
        }
    });

    $("#IssueJobCardItemLineList").on("change", ".volgrade", function (event) {
        var currentRow = $(this).closest("tr");
        var itemcode = currentRow.find("td:eq(1)").find("input").val();
        var capgrade = currentRow.find("td:eq(2)").find("select").val();
        var irgrade = currentRow.find("td:eq(3)").find("select").val();
        var volgrade = currentRow.find("td:eq(4)").find("select").val();
        var row = $("#JobCardItemLineList tr:last");
        var jcnumber = row.find("td:eq(1)").html();
        currentRow.find("td:eq(5)").find("input").val("");
        if ((itemcode !== "" || itemcode !== undefined) &&
            (capgrade !== "--Select Capacity Grade--" || capgrade !== undefined) &&
            (irgrade !== "--Select IR Grade--" || irgrade !== undefined) &&
            (volgrade !== "--Select Voltage Grade--" || volgrade !== undefined)) {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetISQuantity",
                data: { itemcode: itemcode, capgrade: capgrade, irgrade: irgrade, volgrade: volgrade, jcnumber: jcnumber },
                dataType: "json",
                success: function (res) {
                    var lstwb = res;
                    //currentRow.find("td:eq(5)").find("input").val(lstwb[0].Quantity);
                    if (lstwb.length === 0) {
                        currentRow.find("td:eq(5)").find("input").val("");
                    }
                    else if (lstwb.length === 1) {
                        currentRow.find("td:eq(5)").find("input").val(lstwb[0].Quantity);
                    }
                }
            });
        }
    });

    $('#IssueJobCardItemLineList').on('blur', '.iissuequantity', function () {
        var currentRow = $(this).closest("tr");
        var itemcodec = currentRow.find("td:eq(1)").find("input").val();
        var qtyc = currentRow.find("td:eq(5)").find("input").val();
        var adr = "0";
        $("#JobCardItemLineList tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var itmcode = $(tds[2]).html().trim();
            if (itmcode === itemcodec) {
                var quantity = $(tds[5]).html().trim();
                if (qtyc > quantity) {
                    currentRow.find("td:eq(5)").find("input").focus();
                    currentRow.find("td:eq(5)").find("input").val("");
                    alert("Issue quantity is greater than request quantity");
                }
                else {
                    adr = "1";
                }
            }
        });
        if (adr === "1") {
            AddNewRow(this, "item-data", "IssueJobCardItemLineList");
        }
    });

    $('#IssueJobCardItemLineList').on('keypress', '.issuequantity', function (event) {
        return isNumber(event, this);
    });

    $(document).on("blur", ".rcvquantity", function (e) {
        var currentRow = $(this).closest("tr");
        var qty = currentRow.find("td:eq(5)").html();
        var rcvqty = currentRow.find("td:eq(6)").find("input").val();
        if (rcvqty !== "" && rcvqty !== "0") {
            qty = parseFloat(qty);
            rcvqty = parseFloat(rcvqty);
            if (rcvqty > qty) {
                alert("Issue quantity is greater than available quantity");
                currentRow.find("td:eq(6)").find("input").val("");
                currentRow.find("td:eq(6)").find("input").focus();
            }
        }
    });

});

/* Inventory End */


/*Job Card Start */
$(document).ready(function () {
    $('#sel_workorder_list').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false, 'className': 'select-checkbox' },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Id Hidden
            { 'targets': 2, 'width': '100' },       //WorkOrderNo
            { 'targets': 3, 'width': '100' },       //SlsPerName
            { 'targets': 4, 'width': '100' },       //SalesOrderDate
            { 'targets': 5, 'width': '200' },       //DeliveryDate
        ],
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        "order": [2, 'asc'],
        "paging": true
    });

    $('#sel_workorder_list tbody').on('click', 'tr', function () {
        $('#sel_workorder_list tbody tr').removeClass("selected");
        $(this).toggleClass('selected');
    });

    $('#btn_SelWO').click(function () {
        var tbl = $('#sel_workorder_list').DataTable();
        var sono = $.map(tbl.rows('.selected').data(), function (item) {
            return item[2];
        });
        $('.wonumber').val("");
        $('.wonumber').val(sono.toString());
        $('.wonumber').focus();
    });

    //$("#nsel").hide();
    //$("#sel").hide();
    $("#JobCardHeaderModels_SalesOrderNumber").on('blur', function (event) {
        var so = $("#JobCardHeaderModels_SalesOrderNumber").val();
        if (so !== "") {
            var coUrl = '/Dashboard/GetSOList';
            $.getJSON(coUrl, { so: so }, function (response) {
                $('#salesorderItemLineList').DataTable().destroy();
                $('#salesorderItemLineList').find('tbody').find('tr').remove();
                var inc = 1;
                $.each(response, function (index, item) {
                    $('#salesorderItemLineList').find('tbody').append(
                        "<tr class='item-data'>" +
                        "<td class='w-10'> <input class='form-control' id='SalesOrderLineModelList_LineNo_" + inc + "' name='SalesOrderLineModelList_LineNo_" + inc + "' value=" + inc + " disabled disabled type='text'></td>" +
                        "<td class='w-20'>  " +
                        "<input class= 'form-control productCode' id = 'SalesOrderLineModelList_ProductCode_" + inc + "' name = 'SalesOrderLineModelList_ProductCode_" + inc + "' value = " + item.ProductCode + " readonly = 'True' type = 'text' autocomplete = 'off' > " +
                        "</td> " +
                        "<td class='w-50'> <input class='form-control itemname' id='SalesOrderLineModelList_ItemName_" + inc + "' name='SalesOrderLineModelList_ItemName_" + inc + "' value='" + item.ItemName + "' disabled type='text' autocomplete='off'> </td > " +
                        "<td class='w-20'> <input class='form-control quantity' id='SalesOrderLineModelList_Quantity_" + inc + "' name='SalesOrderLineModelList_Quantity_" + inc + "' value=" + item.Quantity + " disabled type='text' autocomplete='off'></td>" +
                        "</tr>");
                    inc++;
                });
                //if (inc === 1) {
                //    $("#sel").show();
                //    $("#nsel").hide();
                //}
                //else {
                //    $("#nsel").show();
                //    $("#sel").hide();
                //}
            });
        }
    });

    $('#salesorderItemLineList').on('click', '.mrproductsearch', function (e) {
        e.preventDefault();
        var currentRow = $(this).closest("tr");
        var itemcode = currentRow.find("td:eq(1)").find('input').val();
        var selmritemlist = $('#sel_mritem_list').DataTable();
        //you could use the Find method to find the texbox or the dropdownlist and get the value.
        selmritemlist.search(itemcode).draw();

        $(".input-sm").prop("readonly", true);
        $("#sel_mritem_list_filter").hide();
    });

    $('#ajcsubmit').on('click', function (e) {
        e.preventDefault();
        var linkObj = $(this);
        var hArr = new Array();
        var lArr = new Array();
        var asArr = new Array();
        var jcnumber = $('.jcnumber').val();
        var wonumber = $('.wonumber').val();
        var startdate = $('.startdate').val();
        var dlvdate = $('.dlvdate').val();
        var empcode = $('.empcode').val();
        var notes = $('.notes').val();
        var frmact = $('.frmact').val();

        if (jcnumber !== "" && empcode !== "") {
            var jcheader = {
                JobCardNo: jcnumber,
                WrkOrdNo: wonumber,
                StartDate: startdate,
                DeliveryDate: dlvdate,
                AssignEmpCode: empcode,
                Notes: notes
            };
            hArr.push(jcheader);

            $(".tbl tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var lineno = $(tds[0]).find('.ilineno').val();
                var itemcode = $(tds[1]).find('.iitemcode').val();
                var qty = $(tds[3]).find('.iquantity').val();
                if (lineno !== "" && itemcode !== "" && qty !== "") {
                    var jcitm = {
                        JobCardNo: jcnumber,
                        LineNo: lineno,
                        ItemCode: itemcode,
                        Quantity: qty
                    };
                    lArr.push(jcitm);
                }
            });

            $(".astbl tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var seqno = $(tds[0]).html();
                var asmbstep = $(tds[1]).html();
                var empcodes = $(tds[2]).find('.iempscode').val();
                if (seqno !== "" && asmbstep !== "" && empcodes !== "") {
                    var astp = {
                        JobCardNo: jcnumber,
                        SeqNo: seqno,
                        AsmbStep: asmbstep,
                        EmpCode: empcodes
                    };
                    asArr.push(astp);
                }
            });

            var jch = JSON.stringify(hArr);
            var jcl = JSON.stringify(lArr);
            var jcal = JSON.stringify(asArr);
            if (jch.length > 0 && jcl.length > 0 && jcal.length > 0) {
                $.ajax({
                    url: "/Dashboard/UpsertAsmblyJobCard",
                    dataType: "json",
                    data: "{'jch': '" + jch + "', 'jcl': '" + jcl + "', 'jcal': '" + jcal + "', 'act': '" + frmact + "' }",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        if (result.error === "") {
                            window.location.href = window.location.href;
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
        }
    });

    $('#gjcsubmit').on('click', function (e) {
        e.preventDefault();
        var linkObj = $(this);
        var hArr = new Array();
        var lArr = new Array();
        var gsArr = new Array();
        var jcnumber = $('.jcnumber').val();
        var startdate = $('.startdate').val();
        var empcode = $('.empcode').val();
        var notes = $('.notes').val();
        var frmact = $('.frmact').val();

        if (jcnumber !== "" && empcode !== "") {
            var jcheader = {
                JobCardNo: jcnumber,
                StartDate: startdate,
                AssignEmpCode: empcode,
                Notes: notes
            };
            hArr.push(jcheader);

            $(".tbl tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var lineno = $(tds[0]).find('.ilineno').val();
                var itemcode = $(tds[1]).find('.iitemcode').val();
                var qty = $(tds[3]).find('.iquantity').val();
                if (lineno !== "" && itemcode !== "" && qty !== "") {
                    var jcitm = {
                        JobCardNo: jcnumber,
                        LineNo: lineno,
                        ItemCode: itemcode,
                        Quantity: qty
                    };
                    lArr.push(jcitm);
                }
            });

            $(".gdtbl tbody tr").each(function () {
                var tds = $(this).find("td");
                //you could use the Find method to find the texbox or the dropdownlist and get the value.
                var seqno = $(tds[0]).html();
                var grdstep = $(tds[1]).html();
                var empcodes = $(tds[2]).find('.iempscode').val();
                if (seqno !== "" && grdstep !== "" && empcodes !== "") {
                    var gstp = {
                        JobCardNo: jcnumber,
                        SeqNo: seqno,
                        GrdStep: grdstep,
                        EmpCode: empcodes
                    };
                    gsArr.push(gstp);
                }
            });

            var jch = JSON.stringify(hArr);
            var jcl = JSON.stringify(lArr);
            var jcgl = JSON.stringify(gsArr);
            if (jch.length > 0 && (jcl.length > 0) && jcgl.length > 0) {
                $.ajax({
                    url: "/Dashboard/UpsertGradeJobCard",
                    dataType: "json",
                    data: "{'jch': '" + jch + "', 'jcl': '" + jcl + "', 'jcgl': '" + jcgl + "', 'act': '" + frmact + "' }",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        if (result.error === "") {
                            window.location.href = window.location.href;
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
        }
    });
});

/* Job Card End */


$(document).ready(function () {
    $("#RegisterViewModels_Email").focus();

    //$(".ponumber").autocomplete({
    //    source: function (request, response) {
    //        $.ajax({
    //            url: "/Dashboard/PopulatePurchaserOrder",
    //            type: "POST",
    //            dataType: "json",
    //            data: { Prefix: request.term },
    //            success: function (data) {
    //                response($.map(data, function (item) {
    //                    return { label: item.Name, value: item.Name };
    //                }));
    //                //return response(data.d);
    //            }
    //        });
    //    }
    //});

    //$(".vendorcode").autocomplete({
    //    source: function (request, response) {
    //        $.ajax({
    //            url: "/Dashboard/PopulateVendorCode",
    //            type: "POST",
    //            dataType: "json",
    //            data: { Prefix: request.term },
    //            success: function (data) {
    //                response($.map(data, function (item) {
    //                    return { label: item.Name, value: item.Name };
    //                }));
    //                //return response(data.d);
    //            }
    //        });
    //    }
    //});

    //$(".custcode").autocomplete({
    //    source: function (request, response) {
    //        $.ajax({
    //            url: "/Dashboard/PopulateCustomerCode",
    //            type: "POST",
    //            dataType: "json",
    //            data: { Prefix: request.term },
    //            success: function (data) {
    //                response($.map(data, function (item) {
    //                    return { label: item.Name, value: item.Name };
    //                }));
    //                //return response(data.d);
    //            }
    //        });
    //    }
    //});

    //$(".states").autocomplete({
    //    source: function (request, response) {
    //        $.ajax({
    //            url: "/Dashboard/PopulateStates",
    //            type: "POST",
    //            dataType: "json",
    //            data: { Prefix: request.term },
    //            success: function (data) {
    //                response($.map(data, function (item) {
    //                    return { label: item.Name, value: item.Name };
    //                }));
    //                //return response(data.d);
    //            }
    //        });
    //    }
    //});

    //$(".country").autocomplete({
    //    source: function (request, response) {
    //        $.ajax({
    //            url: "/Dashboard/PopulateCountry",
    //            type: "POST",
    //            dataType: "json",
    //            data: { Prefix: request.term },
    //            success: function (data) {
    //                response($.map(data, function (item) {
    //                    return { label: item.Name, value: item.Name };
    //                }));
    //                //return response(data.d);
    //            }
    //        });
    //    }
    //});


    $(".cell").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/Dashboard/PopulateItemDescription",
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
        }
    });




    //Customer table
    var customerlist = $('#customerlist').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //CustomerCode
            { 'targets': 3, 'width': '150' },   //CustomerName
            { 'targets': 4, 'width': '100' },   //Company
            { 'targets': 5, 'width': '100' },   //Contact1
            { 'targets': 6, 'width': '100' },   //Contact2
            { 'targets': 7, 'width': '100' },   //Fax
            { 'targets': 8, 'width': '100' },   //WebsiteURL
            { 'targets': 9, 'width': '100' },   //Email
            { 'targets': 10, 'width': '100' },  //GSTNo
            { 'targets': 11, 'width': '120' },  //Address1
            { 'targets': 12, 'width': '100' },  //Address2
            { 'targets': 13, 'width': '100' },  //City
            { 'targets': 14, 'width': '100' },  //State
            { 'targets': 15, 'width': '100' },  //Country
            { 'targets': 16, 'width': '80' },  //Pincode
            { 'targets': 17, 'width': '80' }   //Logo
        ],
        "scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    customerlist.on('order.dt search.dt', function () {
        customerlist.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            customerlist.cell(cell).invalidate('dom');
        });
    }).draw();
    //Customer table

    //Employee table
    var employees = $('#tblemployees').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //EmpCode
            { 'targets': 3, 'width': '100' },   //Designation
            { 'targets': 4, 'width': '140' },   //Name
            { 'targets': 5, 'width': '140' },   //Father Name
            { 'targets': 6, 'width': '80' },   //DOB
            { 'targets': 7, 'width': '80' },   //DOJ
            { 'targets': 8, 'width': '100' },   //MobileNo1
            { 'targets': 9, 'width': '100' },   //MobileNo2
            { 'targets': 10, 'width': '120' },  //Email
            { 'targets': 11, 'width': '120' },  //AddressLine1
            { 'targets': 12, 'width': '100' },  //AddressLine2
            { 'targets': 13, 'width': '100' },  //City
            { 'targets': 14, 'width': '100' },  //State
            { 'targets': 15, 'width': '100' },  //Country
            { 'targets': 16, 'width': '80' },  //Pincode
            { 'targets': 17, 'width': '80' },  //Image
            { 'targets': 18, 'width': '80' },  //IdType
            { 'targets': 19, 'width': '100' },  //IdNo
            { 'targets': 20, 'width': '100' }   //IdProof
        ],
        "scrollX": true,
        "order": [2, 'asc'],
        "paging": true
    });

    employees.on('order.dt search.dt', function () {
        employees.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            employees.cell(cell).invalidate('dom');
        });
    }).draw();
    //Employee table\


    //EmployeeTypelist table
    var EmployeeTypelist = $('#EmployeeTypelist').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2 }    //EmpRole
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    EmployeeTypelist.on('order.dt search.dt', function () {
        EmployeeTypelist.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            EmployeeTypelist.cell(cell).invalidate('dom');
        });
    }).draw();
    //EmployeeTypelist table

    //emploginlist table
    var emploginlist = $('#emploginlist').DataTable({
        "columnDefs": [
            { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2 },   //Employee Code
            { 'targets': 3 },   //Employee Name
            { 'targets': 4 },   //Designation
            { 'targets': 5 }    //Email
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    emploginlist.on('order.dt search.dt', function () {
        emploginlist.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            emploginlist.cell(cell).invalidate('dom');
        });
    }).draw();
    //emploginlist table







    //Grade table
    var gradelist = $('#gradelist').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '100' },   //GradeCode
            { 'targets': 3, 'width': '200' },   //Description1
            { 'targets': 4, 'width': '100' }    //Description2
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    gradelist.on('order.dt search.dt', function () {
        gradelist.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            gradelist.cell(cell).invalidate('dom');
        });
    }).draw();
    //Grade table

    //Start Assembly

    $('#fpinsert').on('click', function (e) {
        $("#fpinsert").attr("disabled", true);
        e.preventDefault();
        var lnArr = new Array();
        var jcno = $("#EmpBarTrackModels_JobCardNo").val();
        var itemcount = $("#ItemCount").val();
        $(".tbl tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            //var relno = $(tds[3]).html();$(tds[0]).find('.ilineno').val()
            var pasemp = $(tds[1]).find('.pasempcode').val();
            var sptemp = $(tds[2]).find('.sptempcode').val();
            var cmemp = $(tds[3]).find('.cmempcode').val();
            var barcode = $(tds[4]).find('.ibcode').val();
            if (jcno !== "" && pasemp !== "" && sptemp !== "" && cmemp !== "" && barcode !== "") {
                var lin = {
                    JobCardNo: jcno,
                    ItemCount: itemcount,
                    Barcode: barcode,
                    PastingEmpCode: pasemp,
                    SpottingEmpCode: sptemp,
                    CircuitMountingEmpCode: cmemp
                };
                lnArr.push(lin);
            }
        });

        if (lnArr.length > 0) {
            var fpemps = JSON.stringify(lnArr);
            $.ajax({
                url: "/Dashboard/InsertFinalPacking",
                dataType: "json",
                data: "{'fpemps': '" + fpemps + "' }",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.error === "") {
                        window.location.href = window.location.href;
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
            alert("Please fill the required fields.");
        }
        $("#fpinsert").attr("disabled", false);
    });

    $('.atestinsert').on('click', function (e) {
        $(".atestinsert").attr("disabled", true);
        e.preventDefault();
        var lnArr = new Array();
        $(".tbl tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var jcno = $(tds[2]).html();
            var barcode = $(tds[3]).html();
            var pasting = $(tds[4]).html();
            var spotting = $(tds[5]).html();
            var cirmount = $(tds[6]).html();
            if (jcno !== "" && barcode !== "" && pasting !== "" && spotting !== "" && cirmount !== "") {
                var lin = {
                    JobCardNo: jcno,
                    Barcode: barcode,
                    PastingEmpCode: pasting,
                    SpottingEmpCode: spotting,
                    CircuitMountingEmpCode: cirmount
                };
                lnArr.push(lin);
            }
        });

        if (lnArr.length > 0) {
            var titems = JSON.stringify(lnArr);
            $.ajax({
                url: "/Dashboard/InsertTesting",
                dataType: "json",
                data: "{'titems': '" + titems + "' }",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.error === "") {
                        window.location.href = window.location.href;
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
            alert("Please fill the required fields.");
        }
        $(".atestinsert").attr("disabled", false);
    });

    $(".ctestinsert").on('click', function (e) {
        $(".ctestinsert").attr("disabled", true);
        var currentRow = $(this).closest("tr");
        var jcno = currentRow.find("td:eq(2)").html();
        var barcode = currentRow.find("td:eq(3)").html();
        var pasting = currentRow.find("td:eq(4)").html();
        var spotting = currentRow.find("td:eq(5)").html();
        var cirmount = currentRow.find("td:eq(6)").html();
        e.preventDefault();
        var lnArr = new Array();
        if (jcno !== "" && barcode !== "" && pasting !== "" && spotting !== "" && cirmount !== "") {
            var lin = {
                JobCardNo: jcno,
                Barcode: barcode,
                PastingEmpCode: pasting,
                SpottingEmpCode: spotting,
                CircuitMountingEmpCode: cirmount
            };
            lnArr.push(lin);
        }

        if (lnArr.length === 1) {
            var titems = JSON.stringify(lnArr);
            $.ajax({
                url: "/Dashboard/InsertTesting",
                dataType: "json",
                data: "{'titems': '" + titems + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.error === "") {
                        window.location.href = window.location.href;
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
            alert("Please fill the required fields.");
        }
        $(".ctestinsert").attr("disabled", false);
    });


    $('.adisinsert').on('click', function (e) {
        $(".adisinsert").attr("disabled", true);
        e.preventDefault();
        var lnArr = new Array();
        $(".tbl tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var jcno = $(tds[2]).html();
            var barcode = $(tds[3]).html();
            var pasting = $(tds[4]).html();
            var spotting = $(tds[5]).html();
            var cirmount = $(tds[6]).html();
            if (jcno !== "" && barcode !== "" && pasting !== "" && spotting !== "" && cirmount !== "") {
                var lin = {
                    JobCardNo: jcno,
                    Barcode: barcode,
                    PastingEmpCode: pasting,
                    SpottingEmpCode: spotting,
                    CircuitMountingEmpCode: cirmount
                };
                lnArr.push(lin);
            }
        });

        if (lnArr.length > 0) {
            var ditems = JSON.stringify(lnArr);
            $.ajax({
                url: "/Dashboard/InsertDispatch",
                dataType: "json",
                data: "{'ditems': '" + ditems + "' }",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.error === "") {
                        window.location.href = window.location.href;
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
            alert("Please fill the required fields.");
        }
        $(".adisinsert").attr("disabled", false);
    });

    $(".cdisinsert").on('click', function (e) {
        $(".cdisinsert").attr("disabled", true);
        var currentRow = $(this).closest("tr");
        var jcno = currentRow.find("td:eq(2)").html();
        var barcode = currentRow.find("td:eq(3)").html();
        var pasting = currentRow.find("td:eq(4)").html();
        var spotting = currentRow.find("td:eq(5)").html();
        var cirmount = currentRow.find("td:eq(6)").html();
        e.preventDefault();
        var lnArr = new Array();
        if (jcno !== "" && barcode !== "" && pasting !== "" && spotting !== "" && cirmount !== "") {
            var lin = {
                JobCardNo: jcno,
                Barcode: barcode,
                PastingEmpCode: pasting,
                SpottingEmpCode: spotting,
                CircuitMountingEmpCode: cirmount
            };
            lnArr.push(lin);
        }

        if (lnArr.length === 1) {
            var ditems = JSON.stringify(lnArr);
            $.ajax({
                url: "/Dashboard/InsertDispatch",
                dataType: "json",
                data: "{'ditems': '" + ditems + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result.error === "") {
                        window.location.href = window.location.href;
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
            alert("Please fill the required fields.");
        }
        $(".cdisinsert").attr("disabled", false);
    });

    $('#capgrdsubmit').on('click', function (e) {
        $("#capgrdsubmit").attr("disabled", true);
        e.preventDefault();
        var lnArr = new Array();
        var jcnumber = $("#CapacityGradingModels_JobCardNo").val();
        var itmcode = $("#CapacityGradingModels_ItemCode").val();
        var frmact = $('.frmact').val();
        $(".tbl tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var lineno = $(tds[0]).find('.ilineno').val();
            var range = $(tds[1]).find('.irange').val();
            var qty = $(tds[2]).find('.iquantity').val();
            if (range !== "" && range !== undefined && qty !== "" && qty !== "0") {
                var lin = {
                    JobCardNo: jcnumber,
                    ItemCode: itmcode,
                    LineNo: lineno,
                    CapacityRange: range,
                    Quantity: parseFloat(qty)
                };
                lnArr.push(lin);
            }
        });

        if (lnArr.length > 0) {
            var cgcl = JSON.stringify(lnArr);
            $.ajax({
                url: "/Dashboard/InsertCapacityGrading",
                dataType: "json",
                data: "{'icgitems': '" + cgcl + "', 'act': '" + frmact + "' }",
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
            alert("Please fill the required fields.");
        }
        $("#capgrdsubmit").attr("disabled", false);
    });

    $('#tblCapacity').on("blur", ".iquantity", function (event) {
        var currentRow = $(this).closest("tr");
        var total = $('.aquantity').val();
        var ttaQty = parseFloat(total);
        var tQty = 0;
        $(".tbl tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var qty = $(tds[2]).find('.iquantity').val();
            if (qty !== "" && qty !== "0") {
                tQty = parseFloat(tQty) + parseFloat(qty);
            }
        });
        if (tQty > ttaQty) {
            $("#capgrdsubmit").attr("disabled", true);
            currentRow.find("td:eq(2)").find("input").val("");
            currentRow.find("td:eq(2)").find("input").focus();
            alert('Grading quantity is greater than available quantity');
        }
        else {
            $("#capgrdsubmit").attr("disabled", false);
        }
    });

    $('#irgsubmit').on('click', function (e) {
        $("#irgsubmit").attr("disabled", true);
        e.preventDefault();
        var lnArr = new Array();
        var jcnumber = $("#IResistanceGradingModels_JobCardNo").val();
        var itmcode = $("#IResistanceGradingModels_ItemCode").val();
        var frmact = $('.frmact').val();
        $(".tbl tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var lineno = $(tds[0]).find('.ilineno').val();
            var caprange = $(tds[1]).find('.icaprange').val();
            var irrange = $(tds[2]).find('.iirrange').val();
            var qty = $(tds[3]).find('.iquantity').val();
            if (caprange !== "" && caprange !== undefined &&
                irrange !== "" && irrange !== undefined && qty !== "" && qty !== "0") {
                var lin = {
                    JobCardNo: jcnumber,
                    ItemCode: itmcode,
                    LineNo: lineno,
                    CapacityRange: caprange,
                    IRRange: irrange,
                    Quantity: parseFloat(qty)
                };
                lnArr.push(lin);
            }
        });

        if (lnArr.length > 0) {
            var ircl = JSON.stringify(lnArr);
            $.ajax({
                url: "/Dashboard/InsertIResistanceGrading",
                dataType: "json",
                data: "{'iiritems': '" + ircl + "', 'act': '" + frmact + "' }",
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
            alert("Please fill the required fields.");
        }
        $("#irgsubmit").attr("disabled", false);
    });
    
    $('#tblIResistance').on("blur", ".iquantity", function (event) {
        var currentRow = $(this).closest("tr");
        var total = $('.aquantity').val();
        var ttaQty = parseFloat(total);
        var tQty = 0;
        $(".tbl tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var qty = $(tds[3]).find('.iquantity').val();
            if (qty !== "" && qty !== "0") {
                tQty = parseFloat(tQty) + parseFloat(qty);
            }
        });
        if (tQty > ttaQty) {
            $("#irgsubmit").attr("disabled", true);
            currentRow.find("td:eq(3)").find("input").val("");
            currentRow.find("td:eq(3)").find("input").focus();
            alert('Grading quantity is greater than available quantity');
        }
        else {
            $("#irgsubmit").attr("disabled", false);
        }
    });

    $('#volsubmit').on('click', function (e) {
        $("#volsubmit").attr("disabled", true);
        e.preventDefault();
        var lnArr = new Array();
        var jcnumber = $("#VoltageGradingModels_JobCardNo").val();
        var itmcode = $("#VoltageGradingModels_ItemCode").val();
        var frmact = $('.frmact').val();
        $(".tbl tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var lineno = $(tds[0]).find('.ilineno').val();
            var caprange = $(tds[1]).find('.icaprange').val();
            var irrange = $(tds[2]).find('.iirrange').val();
            var volrange = $(tds[3]).find('.ivolrange').val();
            var qty = $(tds[4]).find('.iquantity').val();
            if (caprange !== "" && caprange !== undefined &&
                irrange !== "" && irrange !== undefined && qty !== "" && qty !== "0") {
                var lin = {
                    JobCardNo: jcnumber,
                    ItemCode: itmcode,
                    LineNo: lineno,
                    CapacityRange: caprange,
                    IRRange: irrange,
                    VoltageRange: volrange,
                    Quantity: parseFloat(qty)
                };
                lnArr.push(lin);
            }
        });

        if (lnArr.length > 0) {
            var volcl = JSON.stringify(lnArr);
            $.ajax({
                url: "/Dashboard/InsertVoltageGrading",
                dataType: "json",
                data: "{'ivolitems': '" + volcl + "', 'act': '" + frmact + "' }",
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
            alert("Please fill the required fields.");
        }
        $("#irgsubmit").attr("disabled", false);
    });

    $('#tblVoltage').on("blur", ".iquantity", function (event) {
        var currentRow = $(this).closest("tr");
        var total = $('.aquantity').val();
        var ttaQty = parseFloat(total);
        var tQty = 0;
        $(".tbl tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var qty = $(tds[4]).find('.iquantity').val();
            if (qty !== "" && qty !== "0") {
                tQty = parseFloat(tQty) + parseFloat(qty);
            }
        });
        if (tQty > ttaQty) {
            $("#volsubmit").attr("disabled", true);
            currentRow.find("td:eq(4)").find("input").val("");
            currentRow.find("td:eq(4)").find("input").focus();
            alert('Grading quantity is greater than available quantity');
        }
        else {
            $("#volsubmit").attr("disabled", false);
        }
    });
    //Complete Assembly





    //Assembly job cards table
    var assemblyjobcards = $('#tblassemblyjobcards').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '200', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //JobCardNumber
            { 'targets': 3, 'width': '150' },   //SalesOrderNumber
            { 'targets': 4, 'width': '100' },   //StartDate
            { 'targets': 5, 'width': '100' },   //DeliveryDate
            { 'targets': 6, 'width': '100' },    //AssignEmpCode
            { 'targets': 7, 'width': '200' }    //AssignEmpName
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    assemblyjobcards.on('order.dt search.dt', function () {
        assemblyjobcards.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            assemblyjobcards.cell(cell).invalidate('dom');
        });
    }).draw();
    //Assembly Job Card table

    //Grade job cards table
    var gradejobcards = $('#tblgradejobcards').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '200', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //JobCardNumber
            { 'targets': 3, 'width': '100' },   //StartDate
            { 'targets': 4, 'width': '100' },   //AssignEmpCode
            { 'targets': 5, 'width': '200' }    //AssignEmpName
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    gradejobcards.on('order.dt search.dt', function () {
        gradejobcards.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            gradejobcards.cell(cell).invalidate('dom');
        });
    }).draw();
    //Pending Job Card table

    //Request Job Card table
    var requestjobcardlist = $('#requestjobcardlist').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '200', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //JobCardNumber
            { 'targets': 3, 'width': '150' },   //SalesOrderNumber
            { 'targets': 4, 'width': '100' },   //DeliveryDate
            { 'targets': 5, 'width': '200' }    //Notes
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    requestjobcardlist.on('order.dt search.dt', function () {
        requestjobcardlist.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            requestjobcardlist.cell(cell).invalidate('dom');
        });
    }).draw();
    //Request Job Card table

    //pending Job Card table
    var pendingRequestJobCard = $('#pendingRequestJobCard').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '200', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //JobCardNumber
            { 'targets': 3, 'width': '150' },   //SalesOrderNumber
            { 'targets': 4, 'width': '100' },   //DeliveryDate
            { 'targets': 5, 'width': '200' }    //Notes
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    pendingRequestJobCard.on('order.dt search.dt', function () {
        pendingRequestJobCard.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            pendingRequestJobCard.cell(cell).invalidate('dom');
        });
    }).draw();
    //pending Job Card table

    //Complete Job Card table
    var CompleteRequestJobCardlist = $('#CompleteRequestJobCardlist').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '200', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //JobCardNumber
            { 'targets': 3, 'width': '150' },   //SalesOrderNumber
            { 'targets': 4, 'width': '100' },   //DeliveryDate
            { 'targets': 5, 'width': '200' }    //Notes
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    CompleteRequestJobCardlist.on('order.dt search.dt', function () {
        CompleteRequestJobCardlist.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            CompleteRequestJobCardlist.cell(cell).invalidate('dom');
        });
    }).draw();
    //Complete Job Card table

    //Assembly Job Card table
    var asmjobcardlist = $('#asmjobcardlist').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '200', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //JobCardNumber
            { 'targets': 3, 'width': '150' },   //Start Date
            { 'targets': 4, 'width': '100' },   //Assign Employee Code
            { 'targets': 5, 'width': '100' },    //Assign Employee Name
            { 'targets': 6, 'width': '200' }    //Status
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    asmjobcardlist.on('order.dt search.dt', function () {
        asmjobcardlist.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            asmjobcardlist.cell(cell).invalidate('dom');
        });
    }).draw();
    //Assembly Job Card table

    //Assembly Job Card table
    var grdjobcardlist = $('#grdjobcardlist').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '200', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //JobCardNumber
            { 'targets': 3, 'width': '150' },   //Start Date
            { 'targets': 4, 'width': '100' },   //Assign Employee Code
            { 'targets': 5, 'width': '100' },    //Assign Employee Name
            { 'targets': 6, 'width': '200' }    //Status
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    grdjobcardlist.on('order.dt search.dt', function () {
        grdjobcardlist.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            grdjobcardlist.cell(cell).invalidate('dom');
        });
    }).draw();
    //Assembly Job Card table



    //Complete Job Card table
    var compjobcard = $('#compjobcard').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '200', 'searchable': false, 'orderable': false },  //Action
            { 'targets': 2, 'width': '150' },   //JobCardNumber
            { 'targets': 3, 'width': '150' },   //SalesOrderNumber
            { 'targets': 4, 'width': '100' },   //DeliveryDate
            { 'targets': 5, 'width': '200' }    //Notes
        ],
        "order": [2, 'asc'],
        "paging": true
    });

    compjobcard.on('order.dt search.dt', function () {
        compjobcard.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            compjobcard.cell(cell).invalidate('dom');
        });
    }).draw();
    //Process Job Card table



    //var cellChargeDischargeSortingList = $('#CellChargeDischargeSortingList').DataTable({
    //    "columnDefs": [
    //        { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
    //        { 'targets': 1 },       //Sorting
    //        { 'targets': 2 },       //Barcode
    //        { 'targets': 3 },       //ItemCode
    //        { 'targets': 4 },       //Description
    //        { 'targets': 5 }       //Quantity
    //    ],
    //    "order": [2, 'asc'],
    //    "paging": true
    //});
    //cellChargeDischargeSortingList.on('order.dt search.dt', function () {
    //    cellChargeDischargeSortingList.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
    //        cell.innerHTML = i + 1;
    //        cellChargeDischargeSortingList.cell(cell).invalidate('dom');
    //    });
    //}).draw();

    //var CellSortingList = $('#CellSortingList').DataTable({
    //    "columnDefs": [
    //        { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
    //        { 'targets': 1 },       //Barcode
    //        { 'targets': 2 },       //Grade
    //        { 'targets': 3 },       //ItemCode
    //        { 'targets': 4 },       //Description
    //        { 'targets': 5 }       //Quantzity
    //    ],
    //    "order": [2, 'asc'],
    //    "paging": true
    //});
    //CellSortingList.on('order.dt search.dt', function () {
    //    CellSortingList.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
    //        cell.innerHTML = i + 1;
    //        CellSortingList.cell(cell).invalidate('dom');
    //    });
    //}).draw();


    //var tblCellPasting = $('#tblCellPasting').DataTable({
    //    "columnDefs": [
    //        { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
    //        { 'targets': 1 },       //Grade
    //        { 'targets': 2 },       //ItemCode
    //        { 'targets': 3 },       //Description
    //        { 'targets': 4 },       //Quantity
    //        { 'targets': 5 }       //NoOfGroup
    //    ],
    //    "paging": true
    //});
    //tblCellPasting.on('order.dt search.dt', function () {
    //    tblCellPasting.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
    //        cell.innerHTML = i + 1;
    //        tblCellPasting.cell(cell).invalidate('dom');
    //    });
    //}).draw();

    //var tblCellSpotting = $('#tblCellSpotting').DataTable({
    //    "columnDefs": [
    //        { 'targets': 0, 'searchable': false, 'orderable': false },   //SNo.
    //        { 'targets': 1 },       //Grade
    //        { 'targets': 2 },       //ItemCode
    //        { 'targets': 3 },       //Description
    //        { 'targets': 4 },       //NoOfGroup
    //        { 'targets': 5 }       //SpottingGroup
    //    ],
    //    "paging": true
    //});
    //tblCellSpotting.on('order.dt search.dt', function () {
    //    tblCellSpotting.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
    //        cell.innerHTML = i + 1;
    //        tblCellSpotting.cell(cell).invalidate('dom');
    //    });
    //}).draw();

    //var sel_item_list = $('#sel_item_list').DataTable({
    //    "columnDefs": [
    //        { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false, 'className': 'select-checkbox' },   //SNo.
    //        { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Id Hidden
    //        { 'targets': 2, 'width': '100' },       //ItemCode
    //        { 'targets': 3, 'width': '100' },       //ItemName
    //        { 'targets': 4, 'width': '100' },       //Description1
    //        { 'targets': 5, 'width': '200' },       //Description2
    //        { 'targets': 6, 'width': '200' },       //ItemType
    //        { 'targets': 7, 'width': '100' }       //UOM
    //    ],
    //    select: {
    //        style: 'os',
    //        selector: 'td:first-child'
    //    },
    //    "order": [3, 'asc'],
    //    "paging": true
    //});



    //$('#sel_poreceipt_list tbody').on('click', 'tr', function () {
    //    //$(this).toggleClass('selected');
    //});



    //$(document).on("blur", ".itemsearch", function (e) {
    //    var rowid = $(this).data("rowid");
    //    $("#itemModal").removeData("rid"); //remove
    //    $("#itemModal").data("rid", rowid); //setter
    //});


    //PopulateVendorList();

    $("#CellChargeDischargeItemLineList").on("blur", ".iitemcode", function (event) {
        var currentRow = $(this).closest("tr");
        var itemcode = currentRow.find("td:eq(1)").find("input").val();
        var itmId = $(this).attr("id");
        var sel_warehouse = itmId.replace(/\ItemCode/g, 'Warehouse');
        $('#' + sel_warehouse).empty();
        var sel_barcode = itmId.replace(/\ItemCode/g, 'Barcode');
        $('#' + sel_barcode).empty();
        currentRow.find("td:eq(5)").find("input").val("");
        currentRow.find("td:eq(6)").find("input").val("");
        if (itemcode !== "" || itemcode !== undefined) {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetItem",
                data: { itemcode: itemcode },
                dataType: "json",
                success: function (res) {
                    var lst = res;
                    if (lst.length > 0) {
                        $.ajax({
                            type: "GET",
                            url: "/Dashboard/GetWarehouseByCode",
                            data: { itemcode: itemcode },
                            dataType: "json",
                            success: function (res) {
                                var lst1 = res;
                                $('#' + sel_warehouse).empty();
                                currentRow.find("td:eq(5)").find("input").val("");
                                currentRow.find("td:eq(6)").find("input").val("");
                                if (lst1.length === 0) {
                                    $('#' + sel_warehouse).attr("required", true);
                                    $('#' + sel_warehouse).attr("disabled", true);
                                    //$('#' + rowid).selectpicker('refresh');
                                }
                                else if (lst1.length === 1) {
                                    $('#' + sel_warehouse).attr("disabled", false);
                                    var optionwh = '<option value="' + lst1[0].Warehouse + '">' + lst1[0].Warehouse + '</option>';
                                    $('#' + sel_warehouse).append(optionwh);
                                    //$('#' + rowid).selectpicker('refresh');
                                    var whcode = lst1[0].Warehouse;
                                    $.ajax({
                                        type: "GET",
                                        url: "/Dashboard/GetBarcode",
                                        data: { itemcode: itemcode, whcode: whcode },
                                        dataType: "json",
                                        success: function (res) {
                                            var lstb = res;
                                            $('#' + sel_barcode).empty();
                                            if (lstb.length === 0) {
                                                $('#' + sel_barcode).attr("required", true);
                                                $('#' + sel_barcode).attr("disabled", true);
                                                //$('#' + rowid).selectpicker('refresh');
                                            }
                                            else if (lstb.length === 1) {
                                                $('#' + sel_barcode).attr("disabled", false);
                                                var optionbc = '<option value="' + lstb[0].Barcode + '">' + lstb[0].Barcode + '</option>';
                                                $('#' + sel_barcode).append(optionbc);
                                                var bcode = lstb[0].Barcode;
                                                $.ajax({
                                                    type: "GET",
                                                    url: "/Dashboard/GetQuantity",
                                                    data: { itemcode: itemcode, whcode: whcode, bcode: bcode },
                                                    dataType: "json",
                                                    success: function (res) {
                                                        var lstwb = res;
                                                        currentRow.find("td:eq(5)").find("input").val(lstwb[0].Quantity);
                                                        currentRow.find("td:eq(6)").find("input").val(lstwb[0].Quantity);
                                                    }
                                                });
                                            } else if (lstb.length > 1) {
                                                $('#' + sel_barcode).attr("disabled", false);
                                                var optionbc = '<option value="">--Select Barcode--</option>';
                                                $('#' + sel_barcode).append(optionbc);
                                                $('#' + sel_barcode).attr("required", true);
                                                for (var i = 0; i < lstb.length; i++) {
                                                    optionbc = '<option value="' + lstb[i].Barcode + '">' + lstb[i].Barcode + '</option>';
                                                    $('#' + sel_barcode).append(optionbc);
                                                }
                                            }
                                            else {
                                                $('#' + sel_barcode).empty();
                                                currentRow.find("td:eq(5)").find("input").val("");
                                                currentRow.find("td:eq(6)").find("input").val("");
                                            }
                                        }
                                    });
                                }
                                else if (lst1.length > 1) {
                                    $('#' + sel_warehouse).attr("disabled", false);
                                    var optionwh = '<option value="">--Select Warehouse--</option>';
                                    $('#' + sel_warehouse).append(optionwh);
                                    $('#' + sel_warehouse).attr("required", true);
                                    for (var i = 0; i < lst1.length; i++) {
                                        optionwh = '<option value="' + lst1[i].Warehouse + '">' + lst1[i].Warehouse + '</option>';
                                        $('#' + sel_warehouse).append(optionwh);
                                    }
                                }
                                else {
                                    $('#' + sel_warehouse).empty();
                                    $('#' + sel_barcode).empty();
                                    currentRow.find("td:eq(5)").find("input").val("");
                                    currentRow.find("td:eq(6)").find("input").val("");
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    $("#CellChargeDischargeItemLineList").on("change", ".warehouse", function (event) {
        var currentRow = $(this).closest("tr");
        var itemcode = currentRow.find("td:eq(1)").find("input").val();
        var whcode = currentRow.find("td:eq(3)").find("select").val();
        var whId = $(this).attr("id");
        $('#' + whId).empty();
        var sel_barcode = itmId.replace(/\Warehouse/g, 'Barcode');
        $('#' + sel_barcode).empty();
        currentRow.find("td:eq(5)").find("input").val("");
        currentRow.find("td:eq(6)").find("input").val("");
        if ((itemcode !== "" || itemcode !== undefined) && (whcode !== "--Select Warehouse--" || whcode !== undefined)) {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetBarcode",
                data: { itemcode: itemcode, whcode: whcode },
                dataType: "json",
                success: function (res) {
                    var lstb = res;
                    $('#' + sel_barcode).empty();
                    currentRow.find("td:eq(5)").find("input").val("");
                    currentRow.find("td:eq(6)").find("input").val("");
                    if (lstb.length === 0) {
                        $('#' + sel_barcode).attr("required", true);
                        $('#' + sel_barcode).attr("disabled", true);
                        //$('#' + rowid).selectpicker('refresh');
                    }
                    else if (lstb.length === 1) {
                        $('#' + sel_barcode).attr("disabled", false);
                        var optionbc = '<option value="' + lstb[0].Barcode + '">' + lstb[0].Barcode + '</option>';
                        $('#' + sel_barcode).append(optionbc);
                        var bcode = lstb[0].Barcode;
                        $.ajax({
                            type: "GET",
                            url: "/Dashboard/GetQuantity",
                            data: { itemcode: itemcode, whcode: whcode, bcode: bcode },
                            dataType: "json",
                            success: function (res) {
                                var lstwb = res;
                                currentRow.find("td:eq(5)").find("input").val(lstwb[0].Quantity);
                                currentRow.find("td:eq(6)").find("input").val(lstwb[0].Quantity);
                            }
                        });
                    } else if (lstb.length > 1) {
                        $('#' + sel_barcode).attr("disabled", false);
                        var optionbc = '<option value=""> --Select Barcode-- </option>';
                        $('#' + sel_barcode).append(optionbc);
                        $('#' + sel_barcode).attr("required", true);
                        for (var i = 0; i < lstb.length; i++) {
                            optionbc = '<option value="' + lstb[i].Barcode + '">' + lstb[i].Barcode + '</option>';
                            $('#' + sel_barcode).append(optionbc);
                        }
                    }
                    else {
                        $('#' + sel_barcode).empty();
                        currentRow.find("td:eq(5)").find("input").val("");
                        currentRow.find("td:eq(6)").find("input").val("");
                    }
                }
            });
        }
    });

    $("#CellChargeDischargeItemLineList").on("change", ".barcode", function (event) {
        var currentRow = $(this).closest("tr");
        var itemcode = currentRow.find("td:eq(1)").find("input").val();
        var whcode = currentRow.find("td:eq(3)").find("select").val();
        var bcode = currentRow.find("td:eq(4)").find("select").val();
        var whId = $(this).attr("id");
        if ((itemcode !== "" || itemcode !== undefined) &&
            (whcode !== "--Select Warehouse--" || whcode !== undefined) &&
            (bcode !== "--Select Barcode--" || bcode !== undefined)) {
            $.ajax({
                type: "GET",
                url: "/Dashboard/GetQuantity",
                data: { itemcode: itemcode, whcode: whcode, bcode: bcode },
                dataType: "json",
                success: function (res) {
                    var lstwb = res;
                    if (lstwb.length === 1) {
                        currentRow.find("td:eq(5)").find("input").val(lstwb[0].Quantity);
                        currentRow.find("td:eq(6)").find("input").val(lstwb[0].Quantity);
                    }
                    else {
                        currentRow.find("td:eq(5)").find("input").val("");
                        currentRow.find("td:eq(6)").find("input").val("");
                    }
                }
            });
        }
    });

    $('#CellChargeDischargeItemLineList').on('blur', '.quantity', function () {
        var currentRow = $(this).closest("tr");
        //var itemcode = currentRow.find("td:eq(1)").find("input").val();
        //var whcode = currentRow.find("td:eq(2)").find("select").val();
        //var barcode = currentRow.find("td:eq(3)").find("select").val();
        var ccdqty = currentRow.find("td:eq(5)").find("input").val();
        var qty = currentRow.find("td:eq(6)").find("input").val();
        var adr = "0";
        if (ccdqty > qty) {
            currentRow.find("td:eq(5)").find("input").focus();
            alert("Issue quantity is greater than receipt quantity");
        }
        else {
            adr = "1";
        }
        if (adr === "1") {
            AddNewRow(this, "item-data", "IssueJobCardItemLineList");
        }
    });

    $('#CellChargeDischargeItemLineList').on('keypress', '.quantity', function (event) {
        return isNumber(event, this);
    });

    $('#ccdsubmit').on('click', function (e) {
        e.preventDefault();
        var list = new Array();
        $("#CellChargeDischargeItemLineList tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var itmcode = $(tds[1]).find("input").val();
            var warehouse = $(tds[3]).find("select").val();
            var barcode = $(tds[4]).find("select").val();
            var qty = $(tds[5]).find('.iquantity').val();
            if (itmcode !== "" && warehouse !== "" && barcode !== "" && qty !== "" && qty !== "0") {
                var incr = {
                    ItemCode: itmcode,
                    WarehouseCode: warehouse,
                    Barcode: barcode,
                    Quantity: parseFloat(qty)
                };
                list.push(incr);
            }
        });
        var dlist = JSON.stringify(list);
        if (dlist.length > 0) {
            $.ajax({
                url: "/Dashboard/InsertCellChargeDischarge",
                dataType: "json",
                data: "{'ccditems': '" + dlist + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    location.reload();
                },
                error: function () {

                }
            });
        }
    });





    ////$('#empModal').on('show.bs.modal', function (e) {
    ////    //get data-id attribute of the clicked element
    ////    var pf = $(e.relatedTarget).data('id');
    ////});

    ////$("#JobCardHeaderModels_EmployeeCode").removeClass('empm');
    ////$("#EmployeeSearch").click(function () {
    ////    $("#JobCardHeaderModels_EmployeeCode").addClass('empm');
    ////}); 


    //$("#JobCardHeaderModels_SalesOrderNumber").on('blur', function (event) {
    //    var so = $("#JobCardHeaderModels_SalesOrderNumber").val();
    //    var jc = $("#JobCardHeaderModels_JobCardNumber").val();
    //    if (so !== "") {
    //        $.ajax({
    //            url: '/Dashboard/JobCardExist',
    //            data: { jc: jc },
    //            type: "GET",
    //            dataType: "JSON",
    //            success: function (res) {
    //                var lst = res;
    //                if (lst.length > 0) {
    //                    $("#jobCardItemLineList").find('tbody').append(newRowjc());
    //                }
    //                else {
    //                    var coUrl = '/Dashboard/GetSOList';
    //                    $.getJSON(coUrl, { so: so }, function (response) {
    //                        $('#jobCardItemLineList').DataTable().destroy();
    //                        $('#jobCardItemLineList').find('tbody').find('tr').remove();
    //                        var inc = 1;
    //                        $.each(response, function (index, item) {
    //                            $('#jobCardItemLineList').find('tbody').append(
    //                                "<tr class='item-data'>" +
    //                                "<td class='w-10'> <input class='form-control' id='JobCardItemLineModelList_LineNo_" + inc + "' name='JobCardItemLineModelList_LineNo_" + inc + "' value=" + inc + " disabled required='True' type='text'></td>" +
    //                                "<td class='w-20'> " +
    //                                    "<input class='form-control itemcode' id='JobCardItemLineModelList_ItemCode_" + inc + "' name='JobCardItemLineModelList_ItemCode_" + inc + "' value=" + item.ItemCode + " required='True' type='text' autocomplete='off'> " +
    //                                    "<button type='button' data-rowid='JobCardItemLineModelList_ItemCode_" + inc + "' class='btn btn-default float-left itemsearch m-0 p-0' data-toggle='modal' data-target='#itemModal'> "+
    //                                        "<i class='fa fa-search'></i>"+
    //                                    "</button> "+
    //                                "</td > " +
    //                                "<td class='w-20'> <input class='form-control quantity' id='JobCardItemLineModelList_Quantity_" + inc + "' name='JobCardItemLineModelList_Quantity_" + inc + "' value=" + item.Quantity + " required='True' type='text' autocomplete='off'></td>" +
    //                                "</tr>");
    //                            inc++;
    //                        });
    //                        //$("#jobCardItemLineList").find('tbody').append(newRowjc());
    //                    });
    //                }
    //            },
    //            error: function () {
    //                alert("Failed! Please try again.");
    //                $("#POReceiptModels_InvoiceNo").val("");
    //            }
    //        });
    //    }
    //});




    var sel_poreceipt_list = $('#sel_poreceipt_list').DataTable({
        "columnDefs": [
            { 'targets': 0, 'width': '50', 'searchable': false, 'orderable': false },   //SNo.
            { 'targets': 1, 'width': '100', 'searchable': false, 'orderable': false },  //Id Hidden
            { 'targets': 2, 'width': '100' },       //Barcode
            { 'targets': 3, 'width': '100' },       //ItemCode
            { 'targets': 4, 'width': '100' },       //Description
            { 'targets': 5, 'width': '200' },       //Quantity
            { 'targets': 6, 'width': '200' }        //Issue Quantity
        ],
        "order": [3, 'asc'],
        "paging": true
    });
    sel_poreceipt_list.on('order.dt search.dt', function () {
        sel_poreceipt_list.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
            sel_poreceipt_list.cell(cell).invalidate('dom');
        });
    }).draw();

    //$('.issquantity').click(function () {
    //    var currentRow = $(this).closest("tr");
    //    var itemcode = currentRow.find("td:eq(2)").html();
    //    //you could use the Find method to find the texbox or the dropdownlist and get the value.
    //    sel_poreceipt_list.search(itemcode).draw();

    //    $(".input-sm").prop("readonly", true);
    //    $("#sel_poreceipt_list_filter").hide();
    //});

    //$(document).on("click", ".issquantity", function (e) {
    //    var rowid = $(this).data("rowid").replace(' ', '');
    //    $("#rcvItemModel").removeData("rid"); //remove
    //    $("#rcvItemModel").data("rid", rowid); //setter
    //});

    //var brcqty = new Array();
    //$('#btn_SelRcvQty').click(function () {
    //    var rcvTot = 0;
    //    $("#sel_poreceipt_list tbody tr").each(function () {
    //        var tds = $(this).find("td");
    //        var barcode = $(tds[2]).html();
    //        var itmcode = $(tds[3]).html();
    //        var rcvqty = $(tds[6]).find('.rcvquantity').val();
    //        if (itmcode !== "" && rcvqty !== "" && rcvqty !== "0") {
    //            rcvTot = parseFloat(rcvTot) + parseFloat(rcvqty);
    //            var incr = {
    //                Barcode: barcode,
    //                ItemCode: itmcode,
    //                Quantity: rcvqty
    //            };
    //            brcqty.push(incr);
    //        }
    //    });

    //    var refid = $('#rcvItemModel').data("rid").replace(' ', '');
    //    $('#' + refid).val(rcvTot.toString());
    //    $('#' + refid).focus();
    //});

    //$(".issuequantity").focusout(function () {
    //    var currentRow = $(this).closest("tr");
    //    var qty = currentRow.find("td:eq(4)").html();
    //    var rcvqty = currentRow.find("td:eq(5)").find("input").val();
    //    if (rcvqty !== "" && rcvqty !== "0") {
    //        qty = parseFloat(qty);
    //        rcvqty = parseFloat(rcvqty);
    //        if (rcvqty > qty) {
    //            alert("Issue quantity is greater than request Quantity");
    //            currentRow.find("td:eq(5)").find("input").val("");
    //            currentRow.find("td:eq(5)").find("input").focus();
    //        }
    //        else {
    //            $('#rcvItemModel').modal('hide');
    //        }
    //    }
    //});



    //$("#cellchargedischargelist").on("blur", ".ccdquantity", function (e) {
    //    var currentRow = $(this).closest("tr");
    //    var qty = currentRow.find("td:eq(5)").html();
    //    var ccdqty = currentRow.find("td:eq(6)").find('.ccdquantity').val();
    //    qty = parseFloat(qty);
    //    ccdqty = parseFloat(ccdqty);
    //    if (ccdqty > qty) {
    //        alert("Cell Charging/Discharging quantity is not greater than job card quantity");
    //        currentRow.find("td:eq(6)").find("input").val("");
    //        currentRow.find("td:eq(6)").find("input").focus();
    //    }
    //});

    $('#ijcisubmit').on('click', function (e) {
        e.preventDefault();
        var list = new Array();
        var row = $("#JobCardItemLineList tr:last");
        var jcnumber = row.find("td:eq(1)").html();
        $("#IssueJobCardItemLineList tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var itmcode = $(tds[1]).find("input").val();
            var capgrade = $(tds[2]).find("select").val();
            var irgrade = $(tds[3]).find("select").val();
            var volgrade = $(tds[4]).find("select").val();
            var issqty = $(tds[5]).find('.iissuequantity').val();

            if (jcnumber !== "" && itmcode !== ""
                && capgrade !== "" && capgrade !== "--Select Capacity Grade--" && capgrade !== undefined
                && irgrade !== "" && irgrade !== "--Select IR Grade--" && irgrade !== undefined
                && volgrade !== "" && volgrade !== "--Select Voltage Grade--" && volgrade !== undefined
                && issqty !== "" && issqty !== "0") {
                var incr = {
                    JobCardNumber: jcnumber,
                    ItemCode: itmcode,
                    CapacityGrade: capgrade,
                    IRGrade: irgrade,
                    VoltageGrade: volgrade,
                    Quantity: parseFloat(issqty)
                };
                list.push(incr);
            }
        });
        var dlist = JSON.stringify(list);
        if (dlist.length > 0) {
            $.ajax({
                url: "/Dashboard/InsertIssueJobCardItem",
                dataType: "json",
                data: "{'isjcitems': '" + dlist + "' }",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    location.reload();
                },
                error: function () {

                }
            });
        }
    });

    var totalQty = 0;
    $("#SortingList").on("blur", ".iquantity", function (event) {
        var currentRow = $(this).closest("tr");
        var total = $('.box .box-header #sortTotal').text();
        var available = $('.box .box-header #available').text();
        //var qty = currentRow.find("td:eq(4)").find("input").val();
        totalQty = parseFloat(totalQty);
        var tQty = 0;
        $("#SortingList tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var qty = $(tds[4]).find('.iquantity').val();
            if (qty !== "" && qty !== "0") {
                tQty = parseFloat(tQty) + parseFloat(qty);
            }
        });
        totalQty = tQty;
        available = parseFloat(total) - totalQty;
        $('.box .box-header #available').text(available);

        if (tQty > total) {
            $('.box .box-header #available').text("0");
            currentRow.find("td:eq(4)").find("input").val("");
            currentRow.find("td:eq(4)").find("input").focus();
            alert('Sorting quantity is greater than available quantity');
        }
    });

    $('#srtsubmit').on('click', function (e) {
        e.preventDefault();
        var list = new Array();
        var barcode = $('.box .box-header #Barcode').text();
        $("#SortingList tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var grade = $(tds[1]).html();
            var itmcode = $(tds[2]).html();
            var quantity = $(tds[4]).find('.iquantity').val();
            if (grade !== "" && itmcode !== "" && quantity !== "" && quantity !== "0" && barcode !== "") {
                var incr = {
                    Grade: grade,
                    ItemCode: itmcode,
                    Quantity: parseFloat(quantity),
                    Barcode: barcode
                };
                list.push(incr);
            }
        });
        var dlist = JSON.stringify(list);
        if (dlist.length > 0) {
            $.ajax({
                url: "/Dashboard/InsertSorting",
                dataType: "json",
                data: "{'srtitems': '" + dlist + "' }",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    location.reload();
                },
                error: function () {

                }
            });
        }
    });

    $('#cpsubmit').on('click', function (e) {
        e.preventDefault();
        var list = new Array();
        var jcnumber = $("#jcnumber").val();
        var issuesno = $("#issuesno").val();
        $("#tblCellPasting tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var grade = $(tds[1]).html();
            var itmcode = $(tds[2]).html();
            var quantity = $(tds[4]).html();
            var noofgroup = $(tds[5]).find("input").val();
            if (jcnumber !== "" && issuesno !== "" && grade !== "" && itmcode !== "" && quantity !== "" && noofgroup !== "0" && noofgroup !== "") {
                var incr = {
                    JobCardNumber: jcnumber,
                    Grade: grade,
                    ItemCode: itmcode,
                    Quantity: parseFloat(quantity),
                    NoOfGroup: noofgroup,
                    IssueSNo: issuesno
                };
                list.push(incr);
            }
        });
        var dlist = JSON.stringify(list);
        if (dlist.length > 0) {
            $.ajax({
                url: "/Dashboard/InsertPasting",
                dataType: "json",
                data: "{'cpitems': '" + dlist + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    location.reload();
                },
                error: function () {

                }
            });
        }
    });

    $('#cssubmit').on('click', function (e) {
        e.preventDefault();
        var list = new Array();
        var jcnumber = $("#jcnumber").val();
        var issuesno = $("#issuesno").val();
        $("#tblCellSpotting tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var grade = $(tds[1]).html();
            var itmcode = $(tds[2]).html();
            var noofgroup = $(tds[4]).html();
            var spotgroup = $(tds[5]).find("input").val();
            if (jcnumber !== "" && issuesno !== "" && grade !== "" && itmcode !== "" && noofgroup !== "" && spotgroup !== "0" && spotgroup !== "") {
                var incr = {
                    JobCardNumber: jcnumber,
                    Grade: grade,
                    ItemCode: itmcode,
                    NoOfGroup: noofgroup,
                    SpotNoOfGroup: parseFloat(spotgroup),
                    IssueSNo: issuesno
                };
                list.push(incr);
            }
        });
        var dlist = JSON.stringify(list);
        if (dlist.length > 0) {
            $.ajax({
                url: "/Dashboard/InsertSpotting",
                dataType: "json",
                data: "{'csitems': '" + dlist + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    location.reload();
                },
                error: function () {

                }
            });
        }
    });

    $('#cmsubmit').on('click', function (e) {
        e.preventDefault();
        var list = new Array();
        var jcnumber = $("#jcnumber").val();
        var issuesno = $("#issuesno").val();
        $("#tblCircuitMounting tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var grade = $(tds[1]).html();
            var itmcode = $(tds[2]).html();
            var noofgroup = $(tds[4]).html();
            var cmgroup = $(tds[5]).find("input").val();
            if (jcnumber !== "" && issuesno !== "" && grade !== "" && itmcode !== "" && noofgroup !== "" && cmgroup !== "0" && cmgroup !== "") {
                var incr = {
                    JobCardNumber: jcnumber,
                    Grade: grade,
                    ItemCode: itmcode,
                    NoOfGroup: noofgroup,
                    CMNoOfGroup: parseFloat(cmgroup),
                    IssueSNo: issuesno
                };
                list.push(incr);
            }
        });
        var dlist = JSON.stringify(list);
        if (dlist.length > 0) {
            $.ajax({
                url: "/Dashboard/InsertCircuitMounting",
                dataType: "json",
                data: "{'cmitems': '" + dlist + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    location.reload();
                },
                error: function () {

                }
            });
        }
    });

    $('#cmsubmit').on('click', function (e) {
        e.preventDefault();
        var list = new Array();
        var jcnumber = $("#jcnumber").val();
        var issuesno = $("#issuesno").val();
        $("#tblCircuitMounting tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var grade = $(tds[1]).html();
            var itmcode = $(tds[2]).html();
            var noofgroup = $(tds[4]).html();
            var cmgroup = $(tds[5]).find("input").val();
            if (jcnumber !== "" && issuesno !== "" && grade !== "" && itmcode !== "" && noofgroup !== "" && cmgroup !== "0" && cmgroup !== "") {
                var incr = {
                    JobCardNumber: jcnumber,
                    Grade: grade,
                    ItemCode: itmcode,
                    NoOfGroup: noofgroup,
                    CMNoOfGroup: parseFloat(cmgroup),
                    IssueSNo: issuesno
                };
                list.push(incr);
            }
        });
        var dlist = JSON.stringify(list);
        if (dlist.length > 0) {
            $.ajax({
                url: "/Dashboard/InsertCircuitMounting",
                dataType: "json",
                data: "{'cmitems': '" + dlist + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    location.reload();
                },
                error: function () {

                }
            });
        }
    });

    $('#fpsubmit').on('click', function (e) {
        e.preventDefault();
        var list = new Array();
        var jcnumber = $("#jcnumber").val();
        var issuesno = $("#issuesno").val();
        $("#tblFinalPacking tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var grade = $(tds[1]).html();
            var itmcode = $(tds[2]).html();
            var noofgroup = $(tds[4]).html();
            var fpgroup = $(tds[5]).find("input").val();
            if (jcnumber !== "" && issuesno !== "" && grade !== "" && itmcode !== "" && noofgroup !== "" && fpgroup !== "0" && fpgroup !== "") {
                var incr = {
                    JobCardNumber: jcnumber,
                    Grade: grade,
                    ItemCode: itmcode,
                    NoOfGroup: noofgroup,
                    FPNoOfGroup: parseFloat(fpgroup),
                    IssueSNo: issuesno
                };
                list.push(incr);
            }
        });
        var dlist = JSON.stringify(list);
        if (dlist.length > 0) {
            $.ajax({
                url: "/Dashboard/InsertFinalPacking",
                dataType: "json",
                data: "{'fpitems': '" + dlist + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    location.reload();
                },
                error: function () {

                }
            });
        }
    });

    $('#tsubmit').on('click', function (e) {
        e.preventDefault();
        var list = new Array();
        var jcnumber = $("#jcnumber").val();
        var issuesno = $("#issuesno").val();
        $("#tblTesting tbody tr").each(function () {
            var tds = $(this).find("td");
            //you could use the Find method to find the texbox or the dropdownlist and get the value.
            var grade = $(tds[1]).html();
            var itmcode = $(tds[2]).html();
            var noofgroup = $(tds[4]).html();
            var tgroup = $(tds[5]).find("input").val();
            var fbarcode = $(tds[6]).find("input").val();
            if (jcnumber !== "" && issuesno !== "" && grade !== "" && itmcode !== "" && noofgroup !== "" && tgroup !== "0" && tgroup !== "" && fbarcode !== "") {
                var incr = {
                    JobCardNumber: jcnumber,
                    Grade: grade,
                    ItemCode: itmcode,
                    NoOfGroup: noofgroup,
                    TNoOfGroup: parseFloat(tgroup),
                    FinalBarcode: fbarcode,
                    IssueSNo: issuesno
                };
                list.push(incr);
            }
        });
        var dlist = JSON.stringify(list);
        if (dlist.length > 0) {
            $.ajax({
                url: "/Dashboard/InsertTesting",
                dataType: "json",
                data: "{'titems': '" + dlist + "'}",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    location.reload();
                },
                error: function () {

                }
            });
        }
    });
});











