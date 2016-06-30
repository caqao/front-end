function enable_live_widgets(tab) {
    $(tab.find('.LiveCheckBox')).each(function(){
        enable_live_checkbox(this);});
    $(tab.find('.LiveText')).each(function(){
        enable_live_text(this);});
    $(tab.find('.LiveNumber')).each(function(){
        enable_live_number(this);});

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
    $(text).blur(function () {
        generic_update(text, text.value);
    })
}

function enable_live_number(num_text){
    $(num_text).spinner({

    })
        .blur(function () {
        generic_update(num_text, num_text.value);
    })
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
            //TODO add the rest

        },
        success: function (json) {
            if (json.valid == 1) {
                $(widget).toggleClass(json.valid_class, true);
                $(widget).toggleClass(json.invalid_class, false);
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