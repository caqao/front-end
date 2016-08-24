ng_app.controller('InspectionPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.g.lot = '';
        $scope.g.round = null;
        $scope.g.product = false;
        $scope.g.product_choices = [];
        $scope.p.loaded = true;
        $scope.g.is_prod = ($scope.g.url.split('/').indexOf("prod") > -1);
        $scope.g.ongoing = false;
        $scope.page_number = 0;
        $scope.g.unsent_changes = 0;
        $scope.batch_id = 0;
        $scope.g.buffed_arrays = false;
        $scope.show_results = [];
        $scope.g.update_counter = 0;

        $scope.setup_values_array = function () {
            $scope.g.buffed_arrays = true;
            $scope.g.unsent_changes = 0;
            $scope.g.update_counter = 0;

            var d = new Date();
            for (var i=0;i<$scope.values.length;i++){
                $scope.values[i].conform = Array($scope.values[i].nb_meas).fill(null);
                $scope.p.update_delay_data(i, d, $scope.g.interval_hrs);
                if ($scope.show_results[i] === true){
                    $scope.p.temporary_hide(i);
                }
                $scope.show_results[i] = null;
                if ($scope.values[i].data_type === 2 || $scope.values[i].data_type === 3 ){
                    var empty_array = [];
                    for (j=0;j<$scope.values[i].nb_meas;j++){
                        empty_array.push({num:i, val:null});
                    }
                    $scope.values[i].results = empty_array;

                }
            }
        };
        $scope.update_conformity = function(param_ind, sub_ind, value){
            var prev_conf = $scope.values[param_ind].conform[sub_ind];
            if (prev_conf !== value){
                if (value === null){$scope.g.unsent_changes--;}
                else{if (prev_conf === null){$scope.g.unsent_changes++;}
                }
            }
            $scope.values[param_ind].conform[sub_ind] = value;
        };
        $scope.create_plot = function (i) {
            create_op_plot(
                'graph_0_'+$scope.values[i].id,
                $scope.values[i].data_type,
                $scope.values[i].prev_data
            );
        };
        $scope.toggle_conform = function(param_ind, sub_ind){
            $scope.values[param_ind].conform[sub_ind] = !$scope.values[param_ind].conform[sub_ind];
        };
        $scope.watch_input_change = function (newV, oldV, type, param_ind, sub_ind) {
            if (type==3) {
                if (newV === null){
                    if ($scope.values[param_ind].conform[sub_ind] !== null){
                        $scope.g.unsent_changes--;
                    }
                    $scope.values[param_ind].conform[sub_ind] = null;
                    $scope.values[param_ind].results[sub_ind].val = null;
                }else {
                    if (newV === undefined) {
                        $scope.values[param_ind].results[sub_ind].val = 0;
                    }
                    $scope.check_conformity(newV, oldV, type, param_ind, sub_ind)

                }
            }
            else{
                if (type==2 && newV.length == 0){
                    $scope.update_conformity(param_ind, sub_ind, null);
                }
                else{
                    $scope.check_conformity(newV, oldV, type, param_ind, sub_ind)
                }
            }
        };
        $scope.check_conformity = function(newV, oldV, type, param_ind, sub_ind){
            if ($scope.values[param_ind].norm){
                $scope.update_conformity(param_ind, sub_ind,
                    ($scope.values[param_ind].norm.min <=
                    $scope.values[param_ind].results[sub_ind].val &&
                    $scope.values[param_ind].results[sub_ind].val <=
                    $scope.values[param_ind].norm.max)
                );
            }
            else{
                $scope.update_conformity(param_ind, sub_ind, true);
                // if ($scope.values[param_ind].pattern){
                //     print('regex');
                //     //TODO deal with regex
                // }
                // else{
                //     $scope.update_conformity(param_ind, sub_ind, true);
                // }
            }
        };
        $scope.$watch('g.rounds', function(newData){
            if(newData !== undefined){$scope.set_round_pick_data();}
        }, true);
        $scope.$watch('g.last_update_time', function(newVal, oldVal){
            if (newVal != undefined || newVal != null) {
                $scope.update_scope_data($scope.g.last_data);
                $scope.batch_id = $scope.g.other;
            }
        }, true);
        $scope.update_scope_data = function(newVal){
            $scope.p.update_panel_data(newVal);
            if ($scope.values.length>0){$scope.setup_values_array()}
        };
        $scope.setup_picker = function(newVal){
            if ($scope.g.lot === ''){
                $scope.g.lot = newVal.lot;
            }
            if (newVal.product_choices !== undefined){
                $scope.g.product_choices = newVal.product_choices;
            }
        };
        $scope.$watch('g.round', function(newRound){
            if (newRound !== null) {
                $scope.g.get_products_from_round(newRound);
                $scope.g.interval_hrs = $scope.g.pick_iter.filter($scope.filter_id, newRound)[0].interval;
            }
        }, true);
        $scope.filter_id = function(array){
            return array.id == this;
        };
        $scope.$watch('g.rounds', function(newData){
            if(newData !== undefined){$scope.set_round_pick_data();}
        }, true);
        $scope.$watch('g.sectors', function(newData){
            if(newData !== undefined){$scope.set_round_pick_data();}
        }, true);
        $scope.set_round_pick_data = function () {
            if ($scope.g.is_prod === true){
                $scope.g.pick_label = 'Ronde';
                $scope.g.pick_iter = $scope.g.rounds;

            }else{
                $scope.g.pick_label = 'Secteur';
                $scope.g.pick_iter = $scope.g.sectors;
            }
            if ($scope.g.last_data !== null) {
                if ($scope.g.lot === '') {
                    $scope.g.lot = $scope.g.last_data.lot;
                }
                if ($scope.g.last_data.product_choices !== undefined) {
                    $scope.g.product_choices = $scope.g.last_data.product_choices;
                }
            }
        };
        $scope.g.toggle_ongoing = function () {
            $scope.g.ongoing = !$scope.g.ongoing;
            if ($scope.g.ongoing === true){
                // $scope.set_ongoing_variables();
                $scope.send_inspection_choices();
            }
            // else{
            //     $scope.set_standby_variables();
            // }
        };
        $scope.g.cancel_product = function () {
            $scope.g.product = false;
        };
        $scope.send_inspection_choices = function(){
            $scope.g.update_counter = 0;
            $scope.g.get_custom_data({
                action: 'inspection_data',
                lot: $scope.g.lot,
                round: $scope.g.round,
                product: $scope.g.product || 0
            });
        };
        $scope.g.cancel_inspection_data = function () {
            $scope.send_inspection_choices();
        };
        $scope.g.submit_inspection_data = function () {
            var post_dict = {
                action: 'inspection_data',
                parametre_data: $scope.values,
                detector_data: $scope.g.get_detector_data()
            };
            if ($scope.g.is_prod){
                post_dict.batch_id = $scope.batch_id;
            }
            else{
                post_dict.sector_id = $scope.g.round;
                post_dict.lot = $scope.g.lot;
                post_dict.product_id = $scope.g.product || 0;
            }
            $scope.g.post_custom_data(post_dict);
        };
        $scope.g.request_updated_data = function () {
            var param_dict = {
                action: 'check_if_foreign_data',
                last_time: $scope.g.last_update_time,
                sector_id: $scope.g.round
            };
            if ($scope.g.is_prod){
                param_dict.batch_id = $scope.batch_id;
            }
            else{
                param_dict.sector_id = $scope.g.round;
            }
            $http.get($scope.g.url,
                {
                    params: param_dict
                }).then(
                function(response){
                    if (response.data.needs_update === true){
                        $scope.g.update_external_values();
                    }
                    else{
                        $scope.g.update_counter = 0;
                    }
                },
                function(response){
                    $scope.g.show_failure();
                }
            );
        };
        $interval(function(){
            if($scope.g.ongoing === true){
                if ($scope.g.unsent_changes == 0) {
                    $scope.g.update_counter++;
                    if ($scope.g.update_counter%3===0){
                        $scope.p.update_all_delays($scope.g.interval_hrs);
                        $scope.g.update_det_delays();
                    }
                    if ($scope.g.update_counter>11)
                        {
                            $scope.g.update_counter = 0;
                            $scope.g.request_updated_data();
                        }
                }
                else{
                    $scope.g.update_counter = 0;
                }
            }
        }, 10000);
        $scope.g.update_external_values = function(){
            $scope.g.updating_foreign = true;
            $scope.send_inspection_choices();
            $scope.g.panel_class = 'panel-info';
            $timeout(function (){
                $scope.g.reset_color();
                $scope.g.updating_foreign = false;
                $scope.g.update_counter = 0;
            }, 3000);
        };
    }
]);
ng_app.controller('DetectorInspectionPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.p.loaded = true;
        $scope.g.det_text = 'Détecteur';
        $scope.page_number = 1;
        $scope.show_results = [];

        $scope.$watch('g.last_update_time', function(){
            $scope.update_scope_data($scope.g.last_data);
        }, true);
        $scope.update_scope_data = function(newVal){
            if (newVal !== null) {
                var t = new Date();
                $scope.p.update_panel_data(newVal);
                $scope.g.det_text = $scope.values.length>1 ? 'Détecteurs' : 'Détecteur';
                for (var d = 0;d<$scope.values.length;d++){
                    if ($scope.show_results[d] === true){
                        $scope.p.temporary_hide(d);
                    }
                    $scope.show_results[d] = null;
                    if ($scope.g.is_prod === false) {
                        $scope.p.update_delay_data(d, t, $scope.g.interval_hrs);
                        $scope.values[d].product = $scope.get_product_string($scope.g.product) || '';
                    }
                    else{
                        $scope.p.update_delay_data(d, t, $scope.values[d].op_interval);
                    }
                    if ($scope.values[d].numeric_inputs){
                        $scope.values[d].ferreux = null;
                        $scope.values[d].nferreux = null;
                        $scope.values[d].stainless = null;

                        if ($scope.values[d].prev_data.length) {
                            $scope.values[d].sens = $scope.values[d].prev_data[$scope.values[d].prev_data.length - 1].sens;
                            $scope.values[d].adj = $scope.values[d].prev_data[$scope.values[d].prev_data.length - 1].adj;
                        }
                        else {
                            $scope.values[d].sens = null;
                            $scope.values[d].adj = null;
                        }
                    }
                    else{
                        $scope.values[d].ferreux = 'n/a';
                        $scope.values[d].nferreux = 'n/a';
                        $scope.values[d].stainless = 'n/a';
                    }
                    $scope.values[d].ec = 'n/a';
                    $scope.values[d].to_send = false;
                }
            }
        };
        $scope.g.get_detector_data = function () {
            var det_buffer = [];
            for (var d in $scope.values){
                if ($scope.values[d].to_send === true){
                    det_buffer.push($scope.values[d])
                }
            }
            return det_buffer;
        };
        $scope.update_attr = function(index, att, val){
            // var prev_send = $scope.values[index].to_send;
            $($scope.values[index]).attr(att, val);
            var to_send = $scope.values[index].numeric_inputs ? $scope.check_if_send_num(index) : $scope.check_if_send_bool(index);
            if ($scope.values[index].to_send !== to_send){
                if (to_send === true) {
                    $scope.values[index].to_send = true;
                    $scope.g.unsent_changes++;
                }
                else{
                    $scope.values[index].to_send = false;
                    $scope.g.unsent_changes--;
                }
            }
        };
        $scope.check_if_send_num = function(value_index){
            var attrs_to_check = ['adj', 'sens', 'ferreux', 'nferreux', 'stainless'];
            for (var i = 0; i<attrs_to_check.length;i++){
                var att_value = $($scope.values[value_index]).attr(attrs_to_check[i]);
                if (att_value === 'n/a' || att_value === null || att_value === ''){
                    return false;
                }
            }
            return true;
        };
        $scope.check_if_send_bool = function(value_index){
            var attrs_to_check = ['ferreux', 'nferreux', 'stainless', 'ec'];
            for (var z = 0; z<attrs_to_check.length;z++){
                var att_value = $($scope.values[value_index]).attr(attrs_to_check[z]);
                if (att_value !== 'n/a' && att_value !== null && att_value !== ''){
                    return true;
                }
            }
            return false;
        };
        $scope.g.update_det_delays = function(){
            $scope.p.update_all_delays($scope.values.map($scope.filter_interval));
        };
        $scope.create_plot = function (i) {
            if ($scope.values[i].numeric_inputs === true){
                create_num_det_plot(
                    'graph_1_'+$scope.values[i].id,
                    $scope.values[i].prev_data,
                    $scope.values[i].threshold
                );
            }
            else{
                create_bool_det_plot(
                    'graph_1_'+$scope.values[i].id,
                    $scope.values[i].prev_data
                );
            }

        };
        $scope.filter_interval = function(array){
            return array.op_interval;
        };
        $scope.get_product_string = function(prod_id){
            if (prod_id === false){
                return null;
            }
            else {
                return $scope.g.product_choices.filter($scope.filter_id, prod_id)[0].product_text;
            }
        };
        $scope.filter_id = function(array){
            return array.id == this;
        };
        $scope.watch_num_change = function(newVal, det_index, att){
            var sendVal = 0;
            if (typeof(newVal) === 'number'){
                sendVal = newVal;
            }
            else{
                if (typeof(newVal) === 'object'){
                    sendVal = null;
                }
            }
            $scope.update_attr(det_index, att, sendVal);
        };
    }
]);

