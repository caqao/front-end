function create_op_plot(div_id, data_type, insp_data){
    if (insp_data.length > 0){
        var data = [];
        var layout = {};
        switch (data_type){
            case 1:
                data = format_scatter(insp_data, false);
                layout = scatter_layout(insp_data);
                Plotly.plot(document.getElementById(div_id), data, layout);

                break;
            case 2:
                data = format_scatter(insp_data, true);
                layout = scatter_layout(insp_data);
                Plotly.plot(document.getElementById(div_id), data, layout);

                break;
            case 3:
                // data = format_meas_data(insp_data);
                // layout = meas_layout;
                break;
        }
        // Plotly.plot(document.getElementById(div_id), data, layout);
    }
}

var meas_layout = {};

function scatter_layout(insp) {
    return {
        xaxis: {
            range: [ insp[0].time, insp[insp.length-1].time ]
            // range: [1470843000, 1470848085 ]
        },
        yaxis: {
            range: [-1.5, 1.5]
        },
        title: "Résultats d'inspection"
    };
}

function format_scatter(insp, text){
    var traces = [];


    var def_collection = {
        x: [],
        y: [],
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 60
        }
    };

    for (u=0;u<2;u++){
        traces.push(def_collection);
    }

    var con_inspections = insp.filter(filter_bool, true);
    var n_c_inspections = insp.filter(filter_bool, false);
    for (a=0;a<con_inspections.length;a++){traces[0].x.push(con_inspections[a].time);traces[0].y.push(1);}
    for (b=0;b<n_c_inspections.length;b++){traces[1].x.push(n_c_inspections[b].time);traces[1].y.push(-1);}
    traces[0].marker.color = '#43AC6A';
    traces[1].marker.color = '#481210';
    traces[0].name = 'Conforme';
    traces[1].name = 'Non-Conforme';

    if (text){
        traces[0].text = [];
        traces[1].text = [];
        for (k=0;k<con_inspections.length;k++){traces[0].text.push(con_inspections[k].insp_string)}
        for (l=0;l<n_c_inspections.length;l++){traces[1].text.push(n_c_inspections[l].insp_string)}

    }

    else{
        traces.push(def_collection);
        var n_a_inspections = insp.filter(filter_bool, null);
        for (c=0;c<n_a_inspections.length;c++){traces[2].x.push(n_a_inspections[c].time);traces[2].y.push(0);}
        traces[2].y = Array(n_a_inspections.length).fill(0);
        traces[2].marker.color = '#5BC0DE';
        traces[2].name = 'N/A';

    }
    // print(traces[0].x);
    print(traces[0]);
    return traces;
}
function format_meas_data(insp){
    return [];
}
function filter_bool(array){
    return array.conform == this;
}
// function format_times_array(insp){
//     var arr = [];
//     for (m = 0; m < insp.length; m++) {
//         arr.push(insp[m].time)
//     }
//     print(arr);
//     return arr
// }
function format_bool_array() {

}
