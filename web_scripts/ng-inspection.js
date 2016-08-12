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

        $scope.setup_values_array = function () {
            $scope.g.buffed_arrays = true;
            $scope.g.unsent_changes = 0;
            $scope.g.show_results = [];
            var d = new Date();
            for (i=0;i<$scope.values.length;i++){
                $scope.g.show_results.push(null);
                $scope.values[i].conform = Array($scope.values[i].nb_meas).fill(null);
                $scope.update_delay_data(i, d);
                if ($scope.values[i].data_type === 2 || $scope.values[i].data_type === 3 ){
                    var empty_array = [];
                    for (j=0;j<$scope.values[i].nb_meas;j++){
                        empty_array.push({num:i, val:null});
                    }
                    $scope.values[i].results = empty_array;
                }
            }
        };
        $scope.update_delay_data = function(i, time){
            if ($scope.interval_hrs == 0){
                $scope.values[i].panel_class = "panel-default";
            }
            else {
                if ($scope.values[i].prev_data.length < $scope.values[i].nb_meas) {
                    $scope.values[i].next_deadline = time;
                    $scope.values[i].panel_class = "panel-info";
                    $scope.values[i].delay_message = null;
                }
                else {
                    var last_time = $scope.values[i].prev_data[$scope.values[i].prev_data.length - $scope.values[i].nb_meas].time;
                    $scope.values[i].next_deadline = last_time * 1000 + $scope.interval_hrs * 3600000;
                    var remaining_time = $scope.values[i].next_deadline - time;
                    if (remaining_time < 0) {
                        $scope.values[i].panel_class = "panel-danger";
                        $scope.values[i].delay_message = "Retard!";
                    }
                    else {
                        if (remaining_time < 900000) {
                            $scope.values[i].panel_class = "panel-warning";
                            $scope.values[i].delay_message = "Bientôt!";
                        }
                        else {
                            $scope.values[i].panel_class = "panel-success";
                            $scope.values[i].delay_message = null;
                        }
                    }
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
        $scope.fuckyou = function () {
            print($scope.values);
            print($scope.g.unsent_changes);
        };
        $scope.watch_input_change = function (newV, oldV, type, param_ind, sub_ind) {
            if (type==3) {
                if (newV === undefined || newV === null) {
                    $scope.values[param_ind].results[sub_ind].val = 0;
                }
                $scope.check_conformity(newV, oldV, type, param_ind, sub_ind)
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
                if ($scope.g.hold_full_update !== true){
                    $scope.update_scope_data($scope.g.last_data);
                    $scope.batch_id = $scope.g.other;
                }
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
        $scope.g.toggle_show_results = function (i) {

            if ($scope.g.show_results[i]===null){
                $scope.create_plot(i);
            }
            $scope.g.show_results[i] = !$scope.g.show_results[i];
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
            print('cunt');
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
                        action: 'update_batch_data',
                        last_time: $scope.g.last_update_time,
                        batch_id: $scope.batch_id
                    }
                }).then(
                function(response){
                    // print(response.data.last_update_time);
                    $scope.g.hold_full_update = true;
                    $scope.g.last_update_time = response.data.last_update_time;
                    $scope.g.hold_full_update = false;
                    print('RIGHT HERE');
                    $scope.g.update_inspection_data(response.data.inspections);
                    $scope.g.update_detector_data(response.data.detectors);
                },
                function(response){
                    $scope.g.show_failure();
                }
            );
        };
        $scope.update_all_delays = function(){
            var d = new Date();
            for (var i=0;i<$scope.values.length;i++) {
                $scope.update_delay_data(i, d);
            }
        };
        // $scope.g.update_delay = 120000;

        $scope.g.update_delay = 10000;
        $interval(function(){
            if($scope.g.ongoing === true){
                $scope.update_all_delays();
                if ($scope.g.unsent_changes == 0) {
                    $scope.g.request_updated_data();
                }
            }
        }, $scope.g.update_delay);

        $scope.update_external_values = function(){
            $scope.g.updating_foreign = true;
            $scope.send_batch_data();
            $scope.g.panel_class = 'panel-info';
            $timeout(function (){
                $scope.g.reset_color();
                $scope.g.updating_foreign = false;
            }, 3000);
        };
        $scope.g.update_inspection_data = function(inspections) {
            if (inspections.length !== $scope.values.length) {
                $scope.update_external_values();
            }
            else {
                for (var i = 0; i < inspections.length; i++) {
                    if (inspections[i] !== null) {
                        $scope.update_external_values();
                        break;
                    }
                }
            }
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

        $scope.$watch('g.last_update_time', function(){
            $scope.update_scope_data($scope.g.last_data);
        }, true);
        $scope.update_scope_data = function(newVal){
            if (newVal !== null) {
                $scope.p.update_panel_data(newVal);
                $scope.g.det_text = $scope.values.length>1 ? 'Détecteurs' : 'Détecteur';
            }
        };
        $scope.g.get_detector_data = function () {
            return $scope.values; //TODO
        };
        $scope.g.update_detector_data = function(detectors){
            // print(detectors);
        };
    }
]);