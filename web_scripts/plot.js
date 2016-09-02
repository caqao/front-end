function create_op_plot(div_id, data_type, insp_data, timestamps){
    if (insp_data.length > 0){
        var data = [];
        var layout = {};
        switch (data_type){
            case 1:
                data = format_scatter(insp_data, false);
                layout = scatter_layout();
                break;
            case 2:
                data = format_scatter(insp_data, true);
                layout = scatter_layout();
                break;
            case 3:
                data = format_meas_data(insp_data);
                layout = meas_layout();
                break;
        }
        if (timestamps !== undefined){
            layout.shapes=[];
            for (var t = 0;t<timestamps.length;t++){
                layout.shapes.push(create_timestamp_line(timestamps[t]))
            }
        }
        trace(div_id, data, layout);
    }
}
function create_timestamp_line(timestamp){
    var line_time = format_time(timestamp.time);
    // var line_time1 = format_time(timestamp.time+1000000);
    // return {
    //     type: 'rect',
    //         xref: 'x',
    //     yref: 'paper',
    //     x0: line_time,
    //     y0: 0,
    //     x1: line_time1,
    //     y1: 1,
    //     fillcolor: '#d3d3d3',
    //     opacity: 0.2,
    //     line: {
    //     width: 0
    // }
    // };
    return {
        type: 'line',
        yref: 'paper',
        x0: line_time,
        y0: 0,
        x1: line_time,
        y1: 1,
        line: {
            color: 'pink',
            width: 3
        }
    };
}
function create_bool_det_plot(div_id, insp_data){
    if (insp_data.length > 0){
        trace(div_id, format_bool_det(insp_data), det_multi_bool_layout());
    }
}
function create_num_det_plot(div_id, insp_data, threshold){
    if (insp_data.length > 0){
        trace(div_id, format_num_det(insp_data, threshold), det_measures_layout());
    }
}
function trace(div_id, data, layout){
    var div = document.getElementById(div_id);
    Plotly.newPlot(div, data, layout);
}

function format_bool_det(insp){
    var traces = [];
    var chk_str = ['detec1', 'detec2', 'detec3', 'conform_eject'];
    var show_str = ['Ferreux 1.5mm', 'Non-ferreux 1.5mm', 'Stainless 2.0mm', 'Éjection'];
    var sub_arrays = [];
    for (var i in chk_str){
        sub_arrays.push(insp.filter(filter_true, chk_str[i]));
        sub_arrays.push(insp.filter(filter_false, chk_str[i]));
        sub_arrays.push(insp.filter(filter_null, chk_str[i]));
    }
    var show_legend=[false, false, false];
    for (var u=0;u<sub_arrays.length;u++){
        var third_index = Math.floor(u/3);
        var group_index = u%3;
        traces.push(base_coll(group_index, sub_arrays[u], third_index));
        traces[u].textposition = 'top center';
        if (show_legend[group_index] === false && traces[u].y.length){
            traces[u].showlegend = true;
            show_legend[group_index] = true;
        }
        else{
            traces[u].showlegend = false;
        }
        traces[u].legendgroup = chk_str[group_index];

        for (var v=0;v<sub_arrays[u].length;v++){
            traces[u].x.push(format_time(sub_arrays[u][v].time));
            traces[u].text[v] = show_str[third_index] + '\n' + traces[u].text[v];
            if (sub_arrays[u][v].comment !== ''){
                traces[u].text[v] = traces[u].text[v] + '\nCommentaire:\n'+sub_arrays[u][v].comment;
            }
        }
    }
    var x_vals = [format_time(insp[0].time), format_time(insp[insp.length-1].time)];
    for (var w=0; w<4;w++){
        traces.unshift({
            x: x_vals,
            y: Array(2).fill(w),
            hoverinfo: 'none',
            mode: 'lines',
            type: 'scatter',
            legendgroup: 'l',
            opacity: 0.9,
            line: {
                color: detection_colors[w],
                opacity: 0.8,
                dash: 15,
                width: 4
            },
            name: show_str[w],
            showlegend: true

        });
    }
    return traces;
}
function format_num_det(insp, threshold){
    var time_array = format_time_array(insp);
    var text_array = det_meas_text_array(insp);
    var traces = [];
    for (var i = 0; i<3; i++){
        traces.push(det_meas_coll(i, insp, time_array, text_array));
    }
    traces.push(limit_line_coll(time_array, limit_array(insp, threshold)));
    traces.push(det_line_coll(0, insp, time_array));
    traces.push(det_line_coll(1, insp, time_array));
    return traces;
}
function det_multi_bool_layout(){
    return {
        yaxis: {
            showticklabels: false,
            showgrid: false,
            zeroline: false
        },
        legend:{
            x: 1.0,
            y:0.5,
            yanchor: 'middle',
            traceorder: 'grouped',
            font: {
                size:20
            }
        }
    };
}
function det_measures_layout(){
    return {
        yaxis: {
            zeroline: false
        },
        legend:{
            x: 1.0,
            y:0.5,
            yanchor: 'middle',
            traceorder: 'grouped',
            font: {
                size:20
            }
        }
    };
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
            zeroline: false,
            fixedrange: true
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
        insp.filter(filter_true, 'conform'),
        insp.filter(filter_false, 'conform')
    ];
    if (!text){
        sub_arrays.push(insp.filter(filter_null, 'conform'));
    }
    for (var u=0;u<sub_arrays.length;u++){
        traces.push(base_coll(u, sub_arrays[u], 0));
        for (var v=0;v<sub_arrays[u].length;v++){
            traces[u].x.push(format_time(sub_arrays[u][v].time));
            if (text){
                traces[u].textposition = 'top center';
                traces[u].text[v] = sub_arrays[u][v].insp_string + '\n' + traces[u].text[v];
            }
            if (sub_arrays[u][v].comment !== ''){
                traces[u].text[v] = traces[u].text[v] + '\nCommentaire:\n'+sub_arrays[u][v].comment;
            }
        }
    }
    traces[0].legendgroup = 'a';
    return traces;
}
function base_coll(index, sub_insp, y_val){
    return {
        x: [],
        y: Array(sub_insp.length).fill(y_val),
        hoverinfo: 'x+text',
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 40,
            color: ['#43AC6A', '#FF1629', '#5BC0DE'][index],
            opacity: 0.8
        },
        name: ['Conforme', 'Non-Conforme', 'N/A'][index],
        text: attr_array(sub_insp, 'user')
    }
}
function format_meas_data(insp){
    var traces = [];
    var sub_arrays = [
        insp.filter(filter_true, 'conform'),
        insp.filter(filter_false, 'conform')
    ];
    for (var u=0;u<sub_arrays.length;u++){
        traces.push(meas_coll(u, sub_arrays[u]));
        for (var v=0;v<sub_arrays[u].length;v++){
            traces[u].x.push(format_time(sub_arrays[u][v].time));
            if (sub_arrays[u][v].comment !== ''){
                traces[u].text[v] = traces[u].text[v] + '\nCommentaire:\n'+sub_arrays[u][v].comment;
            }
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
function limit_line_coll(time_array, y_array){
    return {
        x: time_array,
        y: y_array,
        hoverinfo: 'y',
        mode: 'lines',
        type: 'scatter',
        fill: 'tozeroy',
        line: {
            color: '#f32637',
            opacity: 0.5,
            width: 4
        },
        name: 'Seuil limite'
    }
}
function det_line_coll(index, insp, time_array){
    return {
        x: time_array,
        y: attr_array(insp, ['adj', 'sens'][index]),
        hoverinfo: 'y',
        mode: 'lines',
        type: 'scatter',
        line: {
            color: ['purple', 'chartreuse'][index],
            opacity: 0.8,
            dash: 15,
            width: 4
        },
        name: ['Ajustement', 'Sensibilité'][index]
    }
}
function det_meas_coll(index, insp, time_array, text_array){
    return {
        x: time_array,
        y: attr_array(insp, ['detec1', 'detec2', 'detec3'][index]),
        hoverinfo: index>0 ? 'x+y' : 'y+text',
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 20,
            color: detection_colors[index],
            opacity: 0.9
        },
        name: ['Ferreux 1.5mm', 'Non-ferreux 1.5mm', 'Stainless 2.0mm'][index],
        text: text_array
    }
}
function meas_coll(index, sub_insp){
    return {
        x: [],
        y: attr_array(sub_insp, 'insp_value'),
        hoverinfo: 'x+y+text',
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
function det_meas_text_array(insp){
    return insp.map(det_meas_text);
}
function det_meas_text(t){
    var comment = t.comment ? 'Commentaire: '+t.comment+'\n' : '';
    var ej = t.conform_eject ? 'Éjection conforme\n' : t.conform_eject === false ? 'Éjection non conforme\n' : '';
    return comment+ej+t.user;
}
function filter_true(array){
    return $(array).attr(this) === true;
}
function filter_false(array){
    return $(array).attr(this) === false;
}
function filter_null(array){
    return $(array).attr(this) === null;
}
function filter_not_false(array){
    return $(array).attr(this) !== false;
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
function format_time_array(array) {
    return attr_array(array, 'time').map(format_time)
}
function attr_array(array, att){
    return array.map(function(e){return $(e).attr(att);});
}
function limit_array(array, threshold){
    return array.map(function(e){return e.adj+threshold;});
}
var detection_colors = ['#ff3322', '#ffe116', '#595959', '#789342'];

function archive_plot(div_id, prev_data){
    print('Not Implemented Yet')
}
function archive_op_plot(div_id, data_type, insp_data){
    if (insp_data.length > 0){
        var data = [];
        var layout = {};
        if (data_type === 3){
            data = archive_meas_data(insp_data);
            layout = meas_layout();
        }
        else{
            data = format_timeline(insp_data);
            layout = scatter_layout();
        }
        layout.xaxis = {
            rangeselector: get_selector_options()
            // rangeslider: {}
        };
        trace(div_id, data, layout);
    }
}
function get_selector_options(){
    return {
        buttons: [{
            step: 'day',
            stepmode: 'todate',
            count: 1,
            label: "aujourd'hui"
        }, {
            step: 'month',
            stepmode: 'backward',
            count: 1,
            label: '1 mois'
        }, {
            step: 'year',
            stepmode: 'backward',
            count: 1,
            label: '1an'
        }, {
            step: 'all',
            label: "Tout"

        }]
    };
}
function format_timeline(insp){
    var traces = [];
    var corrected_array = insp.filter(filter_not_false, 'correction');
    var non_corrected_array = insp.filter(filter_false, 'correction');
    var sub_arrays = [
        non_corrected_array.filter(filter_true, 'conform'),
        non_corrected_array.filter(filter_false, 'conform'),
        non_corrected_array.filter(filter_null, 'conform'),
        corrected_array.filter(filter_true, 'conform'),
        corrected_array.filter(filter_null, 'conform')
    ];
    for (var u=0;u<sub_arrays.length;u++){
        traces.push(archive_timeline_coll(u, sub_arrays[u], 0));
        for (var v=0;v<sub_arrays[u].length;v++){
            traces[u].x.push(format_time(sub_arrays[u][v].time));
            traces[u].text.push(sub_arrays[u][v].id);

        }
    }
    traces[0].legendgroup = 'a';
    return traces;
}
function archive_timeline_coll(index, sub_insp, y_val){
    return {
        x: [],
        y: Array(sub_insp.length).fill(y_val),
        hoverinfo: 'x',
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 40,
            color: ['#43AC6A', '#FF1629', '#5BC0DE', '#43AC6A', '#5BC0DE'][index],
            opacity: 0.8,
            symbol: index > 2 ? 'diamond' : 'circle'
        },
        name: ['Conforme', 'Non-Conforme', 'N/A', 'Corrigé -> Conforme', 'Corrigé -> N/A'][index],
        text: []
    }
}
function archive_meas_data(insp){
    var traces = [];
    var corrected_array = insp.filter(filter_not_false, 'correction');
    var non_corrected_array = insp.filter(filter_false, 'correction');
    var sub_arrays = [
        non_corrected_array.filter(filter_true, 'conform'),
        non_corrected_array.filter(filter_false, 'conform'),
        corrected_array.filter(filter_true, 'conform'),
        corrected_array.filter(filter_null, 'conform')
    ];
    for (var u=0;u<sub_arrays.length;u++){
        traces.push(archive_meas_coll(u, sub_arrays[u]));
        for (var v=0;v<sub_arrays[u].length;v++){
            traces[u].x.push(format_time(sub_arrays[u][v].time));
            traces[u].text.push(sub_arrays[u][v].id);
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
function archive_meas_coll(index, sub_insp){
    return {
        x: [],
        y: attr_array(sub_insp, 'insp_value'),
        hoverinfo: 'x',
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 30,
            color: ['#43AC6A', '#FF1629', '#43AC6A', '#5BC0DE'][index],
            opacity: 0.8,
            symbol: index > 1 ? 'diamond' : 'circle'

        },
        name: ['Conforme', 'Non-Conforme', 'Corrigé -> Conforme', 'Corrigé -> N/A'][index],
        text: []
    }
}


