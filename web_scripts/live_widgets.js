function enable_live_widgets(tab) {
    $($(tab).find('.LiveCheckBox')).each(function(){
        enable_live_checkbox(this);});
    $($(tab).find('.LiveText')).each(function(){
        enable_live_text(this);});
    $($(tab).find('.LiveNumber')).each(function(){
        enable_live_number(this);});
    $($(tab).find('.LiveTextArea')).each(function(){
        enable_live_textarea(this);});
    $($(tab).find('.LiveSelect')).each(function(){
        enable_live_select(this);});
    // $($(tab).find('.RangeSlider')).each(function(){
    //     enable_range_slider(this);});
    $($(tab).find('.MinMaxTd')).each(function(){
        enable_range_td(this);});
    $($(tab).find('.NewEntryButton')).each(function(){
        enable_add_entry(this, tab);});
}

function enable_live_checkbox(chk){
    $(chk).bind('edit', function (e) {
        generic_update(chk, chk.checked);
    });
    $(chk).change(function (e) {
        $(chk).trigger('edit');
    })
}

function enable_live_text(text){
    $(text).bind('edit', function (e) {
        generic_update(text, text.value);
    })
    .blur(function () {
        $(text).trigger('edit');
    })
    .keypress(function (e) {
        if (e.which == 13){
            $(text).trigger('edit');
        }
    })
}

function enable_live_number(num_text){
    $(num_text).spinner({
    })
    .bind('edit', function (e) {
        generic_update(num_text, num_text.value);
    })
    .change( function () {
        $(num_text).trigger('edit');
    })
    .blur(function () {
        $(num_text).trigger('edit');
    })
    .keypress(function (e) {
        if (e.which == 13){
            $(num_text).trigger('edit');
        }
    })
}

function enable_live_limit_number(num_text){
    $(num_text).spinner({
    })
        .bind('edit', function (e) {
            update_limit(num_text);
            // generic_update(num_text, num_text.value);
        })
        .change( function () {
            $(num_text).trigger('edit');
        })
        .blur(function () {
            $(num_text).trigger('edit');
        })
        .keypress(function (e) {
            if (e.which == 13){
                $(num_text).trigger('edit');
            }
        })
}

function enable_live_textarea(textarea){
    $(textarea).bind('edit', function (e) {
        generic_update(textarea, textarea.value);
    })
        .blur(function () {
            $(textarea).trigger('edit');
        });
}

function enable_live_select(sel){
    $(sel).selectmenu({
        change: function (event, ui) {
            $(sel).trigger('edit');
        }
    })
    .bind('edit', function (e) {
        generic_update(sel, sel.value);
    });
}

function enable_range_td(td){
    var min_inp = $(td).find('.MinLimit')[0];
    var max_inp = $(td).find('.MaxLimit')[0];
    // console.log(min_inp);
    enable_live_limit_number(min_inp);
    enable_live_limit_number(max_inp);
}

function update_limit(spinner){
    var td = $(spinner).parent().parent()[0];
    var min_inp = $(td).find('.MinLimit')[0];
    var max_inp = $(td).find('.MaxLimit')[0];
    var results = [$(min_inp).val(), $(max_inp).val()];
    generic_update(td, results);
    //
    // console.log($(min_inp));
    // console.log($(max_inp).val());

}
// function enable_range_slider(slider){
//     var inp = document.getElementById(slider.id+"-text");
//     var val = $(inp).val().split(" - ");
//     var min = val[0];
//     var max = val[1];
//     $(slider).slider({
//         range: true,
//         min:0,
//         max:1000,
//         values: [min, max],
//         slide: function (event, ui) {
//             $(inp).val( ui.values[0] + ' - ' + ui.values[1] )
//         }
//     })
//
//
// }

function enable_add_entry(but, tab){
    $(but).button()
        .click(function (event) {
            $(but).trigger('add_entry');
        })
        .bind('add_entry', function(e){
        // add_entry(tab);
        //     console.log(but.id.split('_')[1]);
            var table = $(tab).find('.MainTable');
            if (table.length > 0){
                var table_id = but.id.split('_')[2];
                table = $(table).find('#'+table_id)[0];
            }else{
                table = table[0];
            }
            console.log(table);
            add_entry(table, but.id.split('_')[1], but.id);
    })
}
function update_row(row_id, markup) {
    var row = document.getElementById(row_id);
    $(row).html(markup);
    enable_live_widgets(row);
}


function reset_previous_value(widget, prev_val){
    widget.value = prev_val;
}

function generic_update(widget, new_value) {
    var csrftoken = getCookie('csrftoken');
    var wid_info = widget.id.split('_');
    $.ajax({
        url: window.location.href,
        type: 'POST',
        data: {
            csrfmiddlewaretoken: csrftoken,
            post_action: 'generic_update',
            tab: wid_info[0],
            id: wid_info[1],
            new_value: new_value

        },
        success: function (json) {
            if (json.valid == 1) {
                $(widget).toggleClass(json.valid_class, true);
                $(widget).toggleClass(json.invalid_class, false);
                if (json.update_row){
                    update_row(json.update_row.row, json.update_row.markup);
                }
            }
            else {
                console.log(json);
                $(widget).toggleClass(json.valid_class, false);
                $(widget).toggleClass(json.invalid_class, true);
                reset_previous_value(widget, json.previous_value)
            }
        },
        error: function () {
            console.log('didnt work');
            alert("Erreur interne lors de la dernière modification de valeur");
        }
    });
}

function add_entry(table_object, tab_id, button_id) {
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        url: window.location.href,
        type: 'POST',
        data: {
            csrfmiddlewaretoken: csrftoken,
            post_action: 'add_entry',
            tab: tab_id,
            button_id: button_id
        },
        success: function (json) {
            if (json.valid===1){
                // $(button_row).remove();
                $(table_object).append(json.markup);
                // $(table_object).append(button_row);

                enable_live_widgets(table_object);
            }else{
                console.log(json);
            }
        },
        error: function () {
            alert("Erreur interne lors de la création du nouvel élément");
        }
    });
}