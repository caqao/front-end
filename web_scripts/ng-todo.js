ng_app.controller('TodoInspectionPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.p.loaded = true;
        $scope.page_number = 0;

        $scope.init = function (val_index) {
            $scope.values_index=val_index;
        };

        $scope.$watch('g.last_update_time', function(newVal, oldVal){
            if (newVal != undefined || newVal != null) {
                $scope.update_scope_data($scope.g.last_data);
                $scope.batch_id = $scope.g.other;
            }
        }, true);
        $scope.update_scope_data = function(newVal){
            $scope.p.update_panel_data(newVal);
            print($scope.values);
            //TODO det delay_message, panel_class
        };
    }
]);