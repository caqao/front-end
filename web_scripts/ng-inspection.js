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

        $scope.setup_values_array = function () {
            $scope.g.buffed_arrays = true;
            $scope.g.unsent_changes = 0;
            var d = new Date();
            for (var i=0;i<$scope.values.length;i++){
                $scope.values[i].conform = Array($scope.values[i].nb_meas).fill(null);
                $scope.p.update_delay_data(i, d, $scope.interval_hrs);
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
                if ($scope.values[param_ind].pattern){
                    //TODO deal with regex
                }
                else{
                    $scope.update_conformity(param_ind, sub_ind, true);
                }
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
                $scope.interval_hrs = $scope.g.pick_iter.filter($scope.filter_id, newRound)[0].interval;
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
                $scope.set_ongoing_variables();
                if ($scope.g.is_prod){$scope.send_batch_data();}
            }
            else{
                $scope.set_standby_variables();
            }
        };
        $scope.set_ongoing_variables = function () {
            $scope.g.state_button_text = 'Modifier';

        };
        $scope.set_standby_variables = function () {
            $scope.g.state_button_text = 'Commencer';

        };
        $scope.set_standby_variables();
        $scope.g.cancel_product = function () {
            $scope.g.product = false;
        };
        $scope.send_batch_data = function(){
            $scope.g.get_custom_data({
                action: 'batch_data',
                lot: $scope.g.lot,
                round: $scope.g.round,
                product: $scope.g.product || 0
            });
        };
        $scope.g.submit_inspection_data = function () {
            $scope.g.post_custom_data({
                action: 'op_inspection_data',
                parametre_data: $scope.values,
                detector_data: $scope.g.get_detector_data(),
                batch_id: $scope.batch_id
            });

        };
        $scope.g.request_updated_data = function () {
            $http.get($scope.g.url,
                {
                    params: {
                        action: 'check_if_foreign_data',
                        last_time: $scope.g.last_update_time,
                        batch_id: $scope.batch_id
                    }
                }).then(
                function(response){
                    if (response.data.needs_update === true){
                        // $scope.g.last_update_time = response.data.last_update_time;
                        $scope.g.update_external_values();
                    }
                },
                function(response){
                    $scope.g.show_failure();
                }
            );
        };
        $scope.g.update_delay = 120000;
        // $scope.g.update_delay = 12000;
        $interval(function(){
            if($scope.g.ongoing === true){
                $scope.p.update_all_delays($scope.interval_hrs);
                $scope.g.update_det_delays();
                if ($scope.g.unsent_changes == 0) {
                    $scope.g.request_updated_data();
                }
            }
        }, $scope.g.update_delay);

        $scope.g.update_external_values = function(){
            $scope.g.updating_foreign = true;
            $scope.send_batch_data();
            $scope.g.panel_class = 'panel-info';
            $timeout(function (){
                $scope.g.reset_color();
                $scope.g.updating_foreign = false;
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
        $scope.attrs_to_check = ['ccp', 'ferreux', 'nferreux', 'stainless', 'ec'];
        if ($scope.is_prod === false){
            $scope.attrs_to_check.push('sens', 'adj')
        }

        $scope.show_results = [];

        $scope.$watch('g.last_update_time', function(){
            $scope.update_scope_data($scope.g.last_data);
        }, true);
        $scope.update_scope_data = function(newVal){
            if (newVal !== null) {
                var t = new Date();
                $scope.p.update_panel_data(newVal);
                $scope.g.det_text = $scope.values.length>1 ? 'Détecteurs' : 'Détecteur';
                for (var d in $scope.values){
                    $scope.p.update_delay_data(d, t, $scope.values[d].op_interval);
                    if ($scope.show_results[d] === true){
                        $scope.p.temporary_hide(d);
                    }
                    $scope.show_results[d] = null;
                    $scope.values[d].product = $scope.g.product || '';
                    for (var a in $scope.attrs_to_check){
                        $($scope.values[d]).attr($scope.attrs_to_check[a], 'n/a');
                    }
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
            var prev_send = $scope.values[index].to_send;
            $($scope.values[index]).attr(att, val);
            var to_send = false;
            for (var a in $scope.attrs_to_check){
                if ($($scope.values[index]).attr($scope.attrs_to_check[a]) !== 'n/a' &&
                    $($scope.values[index]).attr($scope.attrs_to_check[a]) !== null){
                    to_send = true;
                    break;
                }
            }
            if (prev_send !== to_send){
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
        $scope.g.update_det_delays = function(){
            $scope.p.update_all_delays($scope.values.map($scope.filter_interval));
        };
        $scope.create_plot = function (i) {
            print($scope.values[i].prev_data.length);
            create_op_det_plot(
                'graph_1_'+$scope.values[i].id,
                $scope.values[i].prev_data
            );
        };
        $scope.filter_interval = function(array){
            return array.op_interval;
        };
    }
]);

