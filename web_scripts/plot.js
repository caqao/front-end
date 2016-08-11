function create_op_plot(div_id, data_type, insp_data){
    if (insp_data.length > 0){
        var data = [];
        var layout = {};
        switch (data_type){
            case 1:
                data = format_scatter(insp_data, false);
                layout = scatter_layout();
                Plotly.plot(document.getElementById(div_id), data, layout);
                break;
            case 2:
                data = format_scatter(insp_data, true);
                layout = scatter_layout();
                Plotly.plot(document.getElementById(div_id), data, layout);
                break;
            case 3:
                data = format_meas_data(insp_data);
                layout = meas_layout();
                Plotly.plot(document.getElementById(div_id), data, layout);
                break;
        }
    }
}

function meas_layout(){
    return {
        yaxis: {
            hoverformat: '.2f',
            title: 'Mesure'
        },
        showlegend: true,
        legend:{
            x: 0,
            y:1.5,
            orientation: 'h',
            font: {
                size:20
            }
        }
    }
}
function scatter_layout() {
    return {
        yaxis: {
            showticklabels: false,
            showgrid: false,
            zeroline: false
        },
        showlegend: true,
        legend:{
            x: 0,
            y:1.5,
            orientation: 'h',
            font: {
                size:20
            }
        }
    };
}

function format_scatter(insp, text){
    var traces = [];
    var sub_arrays = [
        insp.filter(filter_true),
        insp.filter(filter_false)
    ];
    if (!text){
        sub_arrays.push(insp.filter(filter_null));
    }
    for (var u=0;u<sub_arrays.length;u++){
        traces.push(base_coll(u, sub_arrays[u]));
        for (var v=0;v<sub_arrays[u].length;v++){
            traces[u].x.push(format_time(sub_arrays[u][v].time));
            if (text){
                traces[u].textposition = 'top center';
                traces[u].text[v] = sub_arrays[u][v].insp_string + '\n' + traces[u].text[v];
            }
        }
    }
    traces[0].legendgroup = 'a';
    return traces;
}
function base_coll(index, sub_insp){
    return {
        x: [],
        y: Array(sub_insp.length).fill(0),
        hoverinfo: 'x+text',
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 40,
            color: ['#43AC6A', '#FF1629', '#5BC0DE'][index],
            // symbol: ['star-triangle-up-dot', 'star-triangle-down-dot', 'star-diamond'][index],
            opacity: 0.8
        },
        name: ['Conforme', 'Non-Conforme', 'N/A'][index],
        text: attr_array(sub_insp, 'user')
    }
}
function format_meas_data(insp){
    var traces = [];
    var sub_arrays = [
        insp.filter(filter_true),
        insp.filter(filter_false)
    ];
    for (var u=0;u<sub_arrays.length;u++){
        traces.push(meas_coll(u, sub_arrays[u]));
        for (var v=0;v<sub_arrays[u].length;v++){
            traces[u].x.push(format_time(sub_arrays[u][v].time));
        }
    }
    traces[0].legendgroup = 'a';
    var norm_array = [
        insp.filter(filter_norm_min),
        insp.filter(filter_norm_max)
    ];
    if (norm_array[0].length>0){
        traces.push(norm_coll(0, norm_array[0]));
        for (var w=0;w<norm_array[0].length;w++){
            traces[traces.length-1].x.push(format_time(norm_array[0][w].time));
        }
    }
    if (norm_array[1].length>0){
        traces.push(norm_coll(1, norm_array[1]));
        for (var w=0;w<norm_array[0].length;w++){
            traces[traces.length-1].x.push(format_time(norm_array[1][w].time));
        }
    }
    return traces;
}
function meas_coll(index, sub_insp){
    return {
        x: [],
        y: attr_array(sub_insp, 'insp_value'),
        hoverinfo: 'y+text',
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 30,
            color: ['#43AC6A', '#FF1629'][index],
            opacity: 0.9
        },
        name: ['Conforme', 'Non-Conforme'][index],
        text: attr_array(sub_insp, 'user')
    }
}
function norm_coll(index, sub_insp){
    return {
        x: [],
        y: attr_array(sub_insp, ['insp_min', 'insp_max'][index]),
        hoverinfo: 'y',
        mode: 'lines',
        type: 'scatter',
        marker: {
            size: 10,
            color: '#5BC0DE',
            opacity: 0.4
        },
        name: ['Norme min', 'Norme max'][index]
    }
}
function filter_true(array){
    return array.conform === true;
}
function filter_false(array){
    return array.conform === false;
}
function filter_null(array){
    return array.conform === null;
}
function filter_norm_min(array) {
    return array.insp_min;
}
function filter_norm_max(array) {
    return array.insp_max;
}
function format_time(t){
    return new Date(t * 1000);
}
function attr_array(array, att){
    var a = [];
    for (var z=0;z<array.length;z++){
        a.push($(array[z]).attr(att));
    }
    return a;
}

