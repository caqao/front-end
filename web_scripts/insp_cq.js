/*
 *
 *
 *
 * GLOBAL_FUNCTIONS
 *
 *
 * */
function redirect(u){
    var hr = "[href='" + u + "']";
    console.log(hr);
    // $(hr).click();
    window.location.href = u;
}


/*
 *
  *
  *
  * INSPECTION_PAGE
  *
  *
  * */

function validate_checkbox(input) {
    $(input).toggleClass('checked_and_invalid', false);
    $(input).toggleClass('valid', true);
}

function validate_measure_without_norm(widget) {
    var input = widget;
    var valid = $(input).spinner("isValid");
    $(input).toggleClass("valid", valid);
    $(input).toggleClass("checked_and_invalid", !valid);

}

function leave_tab(event, ui){
    var prev_tab_id = $(ui.oldTab[0]).attr('aria-controls');
    if (prev_tab_id){
        validate_tab(prev_tab_id);

    }
}



function validate_text(widget) {
    var input = widget;
    var val = input.value;
    if (val === ""){
        $(input).toggleClass('checked_and_invalid', true);
        $(input).toggleClass('valid', false);

    }else{
        $(input).toggleClass('checked_and_invalid', false);
        $(input).toggleClass('valid', true);
    }
}

function init_all_inputs() {
    var tabs = document.getElementById("tabs");
    $(tabs).find('.tab_class').each( function () {
        init_tab_inputs(this.id);
    })
}

function init_tab_inputs(tabid) {
    var tab = document.getElementById(tabid);
    var input_1 = $(tab).find('.CustomCheckBox');
    var input_2 = $(tab).find('.CustomTextBox');
    var input_3 = $(tab).find('.CustomMeasureBox');
    var input_4 = $(tab).find('.CustomSelectorBox');

    init_checkboxes(input_1);
    init_textboxes(input_2);
    init_measureboxes(input_3);
    init_selectboxes(input_4);

}

function init_checkboxes(inputlist) {
    inputlist.each( function () {
        init_checkbox(this);
    })
}

function init_textboxes(inputlist){
    inputlist.each( function () {
        init_text(this);
    })
}

function init_measureboxes(inputlist){
    inputlist.each( function () {
        init_measure(this);
    })
}

function init_selectboxes(inputlist){
    inputlist.each( function () {
        init_select(this);
    })
}

function init_checkbox(chk) {
    if ($(chk.getElementsByClassName("conformButton")).next('.ui-button').hasClass('ui-state-active') ||
    $(chk.getElementsByClassName("nonConformButton")).next('.ui-button').hasClass('ui-state-active')){
         $(chk).toggleClass("valid", true);
    }else{$(chk).toggleClass("valid", false);}
}

function init_text(input) {
    var val = input.value;
    if (val === "") {
        $(input).toggleClass('valid', false);
    } else {
        $(input).toggleClass('valid', true);
    }
}

function init_measure(input) {
    var value = $(input).spinner("value");
    var valid = $(input).spinner("isValid");
    if (valid) {
        $(input).toggleClass("valid", true);
    }else{
        $(input).toggleClass("valid", false);
    }
}

function init_select(sel) {
    $(sel).toggleClass("valid", true);
}


//function validate_all_tabs() {
//    var tabs = document.getElementById("tabs");
//    var valid_page = true;
//    var first_failed_tab = null;
////    console.log(tabs);
//
//    $(tabs).find('.tab_class').each( function (id) {
//        var val = validate_tab(this.id);
//        if (val == false){
//            valid_page = false;
//            if (first_failed_tab == null){
//                first_failed_tab = id+1;
//            }
//        }
//    });
//    if (valid_page){
//        return submit_page()
//    }else{
//        var h = "#tabs-"+first_failed_tab;
//        $('[href=h]').click();
//    }
//}
//
// function enable_submit() {
//     var tabs = document.getElementById("tabs");
//     var valid_page = true;
//     $(tabs).find('.tab_class').each( function (id) {
//         if ($(tabs[id]).hasClass("valid") == false){
//         valid_page = false;}
//     });
//     if (valid_page){
//         document.getElementById("validate-page").button('enable');
//     }
// }

function check_tabs_and_submit() {
    var tabs = document.getElementById("tabs");
    console.log(tabs);
    if (tabs == null) {
        var valid_page = validate_single_page();
        if (valid_page == true){
            submit_page();
        }

    }else {
        var valid_page = true;
        var first_failed_tab = null;
//    console.log(tabs);
        $(tabs).find('.tab_class').each(function (id) {
            if ($(tabs[id]).hasClass("valid") == false) {
                var val = validate_tab(this.id);
                if (val == false) {
                    valid_page = false;
                    if (first_failed_tab == null) {
                        first_failed_tab = id + 1;
                    }
                }
            }
        });
        if (valid_page) {
        submit_page()
        } else {
            var h = "#tabs-" + first_failed_tab;
            var hr = "[href='" + h + "']";
            $(hr).click();
        }
    }
}

function validate_by_types(i1, i2, i3, i4){
    var all_valid = true;
    var v1 = check_all_inputs_of_type(i1);
    var v2 = check_all_inputs_of_type(i2);
    var v3 = check_all_inputs_of_type(i3);
    var v4 = check_all_inputs_of_type(i4);

    if (v1 == false ||
        v2 == false ||
        v3 == false ||
        v4 == false ){
        all_valid = false;
    }
    return all_valid
}

function validate_single_page() {
    var i1 = $(document).find('.CustomCheckBox');
    var i2 = $(document).find('.CustomTextBox');
    var i3 = $(document).find('.CustomMeasureBox');
    var i4 = $(document).find('.CustomSelectorBox');
    return validate_by_types(i1,i2,i3,i4);
}

function validate_tab(tabid) {

    var tab = document.getElementById(tabid);
    var i1 = $(tab).find('.CustomCheckBox');
    var i2 = $(tab).find('.CustomTextBox');
    var i3 = $(tab).find('.CustomMeasureBox');
    var i4 = $(tab).find('.CustomSelectorBox');
    if (i1.length > 0 ||
        i2.length > 0 ||
        i3.length > 0 ||
        i4.length > 0) {
        var valid_tab = validate_by_types(i1, i2, i3, i4);

        $(tab).toggleClass("valid", valid_tab);
        var num = tab.id.charAt(tab.id.length - 1);
        anchor = document.getElementById("ui-id-" + num);
        $(anchor).toggleClass("valid", valid_tab);
    }
    else{
        valid_tab = true;
    }
    return valid_tab
}

function check_all_inputs_of_type(input) {
    var inp = input;

    var valid_type = true;
    inp.each( function (i) {
        var wid = inp[i];
        var v = $(wid).hasClass("valid");

    if (v == false){
        valid_type = false;}
        $(wid).toggleClass("checked_and_invalid", !v);
        $(wid).toggleClass("valid", v);

    });
    return valid_type;
}

function validate_detector_tab(tabwidget) {
    alert(tabwidget)
}

function scroll_box_enter(box) {
        $(box).stop();
        var boxWidth = $(box).width();
        var textWidth = $('.ScrollText', $(box)).width();
        if (textWidth > boxWidth) {
            var animSpeed = textWidth * 3;
            $(box).animate({
                scrollLeft: (textWidth - boxWidth)
            }, animSpeed, function () {
                $(box).animate({
                    scrollLeft: 0
                }, animSpeed, function () {
                    $(box).trigger('mouseenter');
                });
            });
        }
}


function scroll_box_leave(box) {
    var animSpeed = $(box).scrollLeft() * 10;
    $(box).stop().animate({
        scrollLeft: 0
    }, animSpeed);
}
