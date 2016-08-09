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

        $scope.setup_values_array = function () {
            $scope.g.unsent_changes = 0;
            for (i=0;i<$scope.values.length;i++){
                $scope.values[i].conform = Array($scope.values[i].nb_meas).fill(null);
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
            print(value);
            var prev_conf = $scope.values[param_ind].conform[sub_ind];
            if (prev_conf !== value){
                if (value === null){$scope.g.unsent_changes--;print('--')}
                else{if (prev_conf === null){$scope.g.unsent_changes++;}
                }
            }
            $scope.values[param_ind].conform[sub_ind] = value;

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

        // $scope.$watch('values', function (n) {
        //     if (n) {
        //         var change_count = 0;
        //         for (i = 0; i < n.length; i++) {
        //             for (j = 0; j < n[i].nb_meas; j++) {
        //                 if (n[i].conform[j] !== null) {
        //                     change_count++;
        //                 }
        //             }
        //         }
        //         $scope.g.unsent_changes = change_count;
        //     }
        // }, true);
        // $scope.update_scope_data = function(newVal){
        //     if (newVal !== null) {
        //         $scope.p.update_panel_data(newVal);
        //         if ($scope.values.length>0){
        //             $scope.g.insp_buffer = [];
        //             for (i = 0; i<$scope.values.length; i++){
        //                 // var null_array = Array($scope.values[i].nb_meas).fill(null);
        //                 $scope.g.insp_buffer.push(null);
        //                 $scope.g.conform_buffer.push(null);
        //             }
        //         }
        //         print($scope.g.insp_buffer);
        //         if ($scope.g.lot === ''){
        //             $scope.g.lot = newVal.lot;
        //         }
        //         if (newVal.product_choices !== undefined){
        //             $scope.g.product_choices = newVal.product_choices;
        //         }
        //     }
        // };
        // $scope.$watch('g.insp_buffer', function(newBuff, oldBuff){
        //     var change_number = 0;
        //     for (i=0;i<newBuff.length;i++){
        //         if (newBuff[i] !== oldBuff[i]){
        //             var ol = oldBuff[i];
        //             var ne = newBuff[i];
        //             if ($scope.values[i].data_type == 3){
        //                 $scope.moderate_number_change(ne, ol, i);
        //                 $scope.validate_numeric_norm(i);
        //             }
        //         }
        //         if (newBuff[i] !== (undefined || null)){
        //             change_number++;
        //         }
        //     }
        //     $scope.g.unsent_changes = change_number;
        //
        // }, true);
        // $scope.moderate_number_change = function (ne, ol, ind) {
        //     if (ne === undefined){
        //         if (ol === null){
        //             $scope.g.insp_buffer[ind] = 0;
        //         }else{ $scope.g.insp_buffer[ind] = ol; }
        //     }
        // };
        // $scope.validate_numeric_norm = function(ind){
        //     print($scope.values[ind]);
        //     if ($scope.g.insp_buffer[ind] !== null){
        //
        //     }
        // };
        $scope.$watch('g.last_update_time', function(newVal){if (newVal != undefined || newVal != null) {
            $scope.setup_picker($scope.g.last_data);
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
            }
        }, true);
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
        // $scope.update_qualit_inspection = function (index, val) {
        //     $scope.g.insp_buffer[index] = val;
        //
        // };
        $scope.g.submit_inspection_data = function () {
            $scope.g.post_custom_data({
                action: 'op_inspection_data',
                parametre_data: $scope.values,
                detector_data: $scope.g.get_detector_data(),
                batch_id: $scope.batch_id
            });
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
        }
    }
]);