var addableTabTemplate = "<li class='ui-state-default ui-corner-top'><table><td class='TitleTd'>" +
        "<a href='#{href}' class='RemovableTab'>#{label}</a></td>" +
        "<td><span class='ui-icon ui-icon-close' role='presentation'>" +
        "Remove Tab</span></td></table></li>";
var addableTabCounter = 0;
var presentTabCounter = 0;

function submit_new_result_tab(){
    var date = document.getElementById('datepicker').value;
    var spot = document.getElementById('tabpicker').value;
    var csrftoken = getCookie('csrftoken');

    $.ajax({
        url: "/insp_cq/results/",
        type: 'POST',
        data: {
            csrfmiddlewaretoken: csrftoken,
            date: date,
            spot: spot,
            post_action: 'add_tab'
        },
        success : function(json){
            add_tab(json.tab_title, json.markup)

        },
        error: function () {
            console.log('didnt work')
        }

    });
}

function submit_comment_change(cell_id, value) {
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        url: "/insp_cq/results/",
        type: 'POST',
        data: {
            csrfmiddlewaretoken: csrftoken,
            cell_id: cell_id,
            new_value: value,
            post_action: 'comment'
        },
        success : function(json){
            update_comment(cell_id,value);
            console.log('did work')

        },
        error: function () {
            console.log('didnt work')
        }

    });

}

function update_comment(cell, value){
//    var input = $(cell).find('.EditCommentInput');
    $(cell).empty();
    $(cell).append(value);

}

function edit_comment(cell) {
    var new_id = 'input_'+cell.id;
    var input = $(cell).find('#'+new_id);
    var value = $(cell).text();
    if (input.length == 0) {
        remove_all_comment_inputs();
        $(cell).empty();

        $(cell).append("<input class='EditCommentInput' id='" + new_id + "' type='text' value="+ value + "></input>");
        var input = $(cell).find('#'+new_id);
//        $(cell).append("<button onclick='submit_comment_change("+cell.id+")' type='button'></button>");

        $(input).blur(function () {
            var new_val = $(input).val();
            if (new_val != value){
                submit_comment_change(cell.id, new_val);
            }else {
                $(input).remove();
                $(cell).append(value)
            }
        });
    }
}
function remove_all_comment_inputs(){
    var inputs = document.getElementsByClassName('EditCommentInput');
    $(inputs).each( function (i) {
        var td = $(inputs[i]).parent();
        var value = $(inputs[i]).val();
        $(td.empty())
        $(td).append(value);
    })
}



function prepare_scrollable_tabs(tabs, ul) {
    $(tabs).addClass('ScrollableTabs');
    $(ul).sortable({
        axis:"x",
        stop: function() {
            tabs.tabs( "refresh" );
        }
    });
}

function setup_accordion(acc) {
    $(acc).accordion({
        heightStyle: "content",
        collapsible: true,
        active: true
    });
}

function add_tab(label, markup) {
    if (presentTabCounter < 8) {
        var tabs = document.getElementById('tabs');

        var ul = $(tabs).find(".ui-tabs-nav");

        addableTabCounter++;
        presentTabCounter++;
        if (addableTabCounter == 1) {
            prepare_scrollable_tabs(tabs, ul);
        }

        var id = "tabs-" + addableTabCounter;
        var li = $(addableTabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label));
        $(ul).append(li);

        $(tabs).append("<div id='" + id + "'>" + markup + "</div>");
        $(tabs).tabs("refresh");
//        $(acc).accordion("refresh");
//        $(acc).addClass('AddedTabAccordion');
        var acc = $(tabs).find(".TabAccordion");
        var this_acc = acc[acc.length-1];
        setup_accordion(this_acc);
        if (presentTabCounter >= 8) {
            document.getElementById('tabPickerSubmit').disabled = true;
            presentTabCounter = 8;
        }

        var h = "#tabs-" + addableTabCounter;
        var hr = "[href='" + h + "']";
        $(hr).click();

    }
}
