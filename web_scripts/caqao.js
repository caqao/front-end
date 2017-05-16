
$(function () {

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


});


function print(value){
    console.log(value);
}






