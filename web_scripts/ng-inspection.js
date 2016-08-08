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
        $scope.g.insp_buffer = [];
        $scope.g.unsent_changes = 0;

        $scope.update_scope_data = function(newVal){
            if (newVal !== null) {
                $scope.p.update_panel_data(newVal);
                if ($scope.values.length>0){
                    $scope.g.insp_buffer = [];
                    for (i = 0; i<$scope.values.length; i++){
                        // $scope.values[i].data_type == 1 ? $scope.g.insp_buffer.push(undefined) : $scope.g.insp_buffer.push(null);
                        $scope.g.insp_buffer.push(null);
                    }
                    print($scope.g.insp_buffer);
                }
                if ($scope.g.lot === ''){
                    $scope.g.lot = newVal.lot;
                }
                if (newVal.product_choices !== undefined){
                    $scope.g.product_choices = newVal.product_choices;
                }
            }
        };
        $scope.$watch('g.insp_buffer', function(newBuff, oldBuff){
            var change_number = 0;
            for (i=0;i<newBuff.length;i++){
                if (newBuff[i] !== oldBuff[i]){
                    var ol = oldBuff[i];
                    var ne = newBuff[i];
                    if ($scope.values[i].data_type == 3){
                        $scope.moderate_number_change(ne, ol, i);
                    }
                }
                if (newBuff[i] !== (undefined || null)){
                    change_number++;
                }
            }
            $scope.g.unsent_changes = change_number;

        }, true);
        $scope.moderate_number_change = function (ne, ol, ind) {
            if (ne === undefined){
                if (ol === null){
                    $scope.g.insp_buffer[ind] = 0;
                }else{ $scope.g.insp_buffer[ind] = ol; }
            }
        };
        $scope.$watch('g.last_update_time', function(){
            $scope.update_scope_data($scope.g.last_data);
        }, true);

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
        $scope.update_qualit_inspection = function (index, val) {
            $scope.g.insp_buffer[index] = val;

        };
        // $scope.valid_input = function(newVal, index){
        //     console.log(newVal);
        //     if (newVal===undefined ){
        //         $scope.g.insp_buffer[index] = undefined;
        //
        //         print($scope.g.insp_buffer);
        //     }
        //     else{
        //         if(newVal===null){
        //             $scope.g.insp_buffer[index] = undefined;
        //             var tayeul = "{{ param.data_type == 3 ? 'number' : 'text'}}";
        //
        //
        //         }
        //     }
        // };

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
    }
]);