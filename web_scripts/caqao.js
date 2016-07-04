function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function submit_page() {
    document.getElementById('submit_inspection').submit();
}


function LoadAjaxTab(event, ui, tab) {
    var csrftoken = getCookie('csrftoken');
    if (tab===null){
        var tabref = ui.newTab.attr("aria-controls");
        tab = tabref.substr(tabref.length-1);
    }
    var tab_object = document.getElementById('tabs-'+tab);

    $.ajax({
        url: window.location.href,
        type: 'GET',
        data: {
            csrfmiddlewaretoken: csrftoken,
            get_action: 'load_tab',
            tab: tab

        },
        success: function (json) {
            if (json.valid===1){
                $(tab_object).html(json.markup);
                enable_live_widgets(tab_object);

            }else{
                console.log(json);
            }
        },
        error: function () {
            console.log('didnt work');
            alert("Erreur interne lors du chargement de la page");
        }


    });
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}



$(function () {

    var tabs = $( "#tabs").tabs({
        activate: function (event, ui) {
            leave_tab(event, ui);
            }

        })
        .delegate( "span.ui-icon-close", "click", function() {
            var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
            $( "#" + panelId ).remove();
            $(tabs).tabs( "refresh" );
            document.getElementById('tabPickerSubmit').disabled = false;
            presentTabCounter--;
    });

    $( "#AjaxTabs" ).tabs({
       activate: function(e,ui) {
           LoadAjaxTab(e,ui,null);
       },
        create: function (e,ui) {
            LoadAjaxTab(e,ui,1);

        }
    });

    $( ".SideBarAccordion").accordion({
        heightStyle: "content",
        collapsible: true,
        active: false
    });

    $( ".LinkAccordion").click( function() {
                window.location.href = '/insp_cq/results';
            }
    );

    $( ".CustomMeasureBox" )
        .spinner({
            step: 0.1,
            numberFormat: "n"
        })
        .blur( function () {
            validate_measure_without_norm(this);
        });
    $( ".CustomSelectorBox" ).selectmenu({

     });
    $( ".CustomTextBox" )
        .blur( function () {
            validate_text(this);
        });

    $( ".TabValidationInput" )
        .button();


    $( ".CustomCheckBox" ).buttonset()
            .click( function () {
                validate_checkbox(this)
            });
    $( "#good_c, #bad_c, #repaired_c, #absent_c" )
        .tooltip({
        position: {
            my: "center bottom-5",
            at: "center top",
            using: function( position, feedback ) {
                $( this ).css( position );
                $( "<div>" )
                    .addClass( "arrow" )
                    .addClass( feedback.vertical )
                    .addClass( feedback.horizontal )
                    .appendTo( this );
        }
      }
    });
    $( "#datepicker" ).datepicker({
        showAnim: "fold",
        dateFormat: "yy-mm-dd",
        maxDate: "+0d",
        minDate: new Date(2016, 4 - 1, 1),
        monthNamesShort: [ "Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec" ],
        monthNames: [ "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre" ],
        dayNamesShort: [ "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam" ],
        dayNamesMin: [ "Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa" ]
    });

    $( "#validate-page").button();


    $( "#new_result_tab" ).on('submit', function (event) {
        event.preventDefault();
        submit_new_result_tab();
    });

    $( ".CommentCell").click( function (event) {
        alert(event.target);
    });


    $( window ).load(function () {
        init_all_inputs();
        var pickerSubmit = document.getElementById('tabPickerSubmit');
        if (pickerSubmit != null){
            pickerSubmit.disabled = false;
        }
    });



//    $(document).ready(function () {
//        console.log('ready');
//    })

});









