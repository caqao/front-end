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


        $scope.update_scope_data = function(newVal){
            if (newVal !== null) {
                $scope.p.update_panel_data(newVal);
                if ($scope.g.lot === ''){
                    $scope.g.lot = newVal.lot;
                }
                if (newVal.product_choices !== undefined){
                    $scope.g.product_choices = newVal.product_choices;
                }
            }

        };
        $scope.$watch('g.last_update_time', function(){
            $scope.update_scope_data($scope.g.last_data);
        }, true);

        $scope.$watch('g.round', function(newRound){
            if (newRound !== null) {
                $scope.g.get_products_from_round(newRound);
                console.log($scope.g.product_choices);
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
                print($scope.g.pick_iter);

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
                product: $scope.g.product
            });
        }

    }
]);
ng_app.controller('DetectorInspectionPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.p.loaded = true;
        $scope.g.plural_detectors = '';
        $scope.$watch('g.last_update_time', function(){
            $scope.update_scope_data($scope.g.last_data);
        }, true);
        $scope.update_scope_data = function(newVal){
            if (newVal !== null) {
                $scope.p.update_panel_data(newVal);
                //TODO manage plural
            }

        };
    }
]);