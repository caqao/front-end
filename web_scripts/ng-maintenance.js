ng_app.controller('MaintenancePanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.p.loaded = true;
        $scope.page_number = 0;


        $scope.$watch('panel_class', function(newVal, oldVal){
            if (oldVal === null){
                if(newVal !== null){
                    if (newVal === 'panel-warning' || newVal === 'panel-danger'){
                        $scope.g.badges[0]++;
                    }
                }
            }else{
                if (newVal !== oldVal){
                    if (newVal === 'panel-warning' || (newVal === 'panel-danger' && oldVal !== 'panel-warning')){
                        $scope.g.badges[0]++;
                    }
                    else{
                        if ((oldVal === 'panel-danger' && newVal !== 'panel-warning') || (oldVal === 'panel-warning' && newVal !== 'panel-danger')){
                            $scope.g.badges[0]--;
                        }
                    }
                }
            }
        }, true);

        $scope.init = function (val_index) {
            $scope.values_index=val_index;
            $scope.panel_class = null;
            $scope.show_video = false;
        };

        $scope.$watch('g.last_update_time', function(newVal, oldVal){
            if (newVal != undefined || newVal != null) {
                $scope.update_scope_data($scope.g.last_data);
            }
        }, true);

        $scope.update_scope_data = function(newVal){
            $scope.p.update_panel_data(newVal);
            $scope.update_delay_data();

        };
        $scope.g.update_todo_delays = function(){
            $scope.update_delay_data()
        };
        $scope.toggle_show_video = function(){
            $scope.show_video = !$scope.show_video;
        };
        $scope.toggle_comment = function(){
            if ($scope.comment === undefined){
                $scope.comment = '';
            }
            else{
                delete $scope.comment;
            }
        };
        $scope.update_delay_data = function() {
            var remaining_time = $scope.values.todo_time - new Date();
            print($scope.values.todo_time);
            print(remaining_time);
            if (remaining_time < -10000) {
                $scope.panel_class = "panel-danger";
                $scope.delay_message = "Retard!";
            }
            else {
                if (remaining_time < 900000) {
                    $scope.panel_class = "panel-warning";
                    $scope.delay_message = "Bientôt!";

                }
                else {
                    $scope.panel_class = "panel-success";
                    $scope.delay_message = null;
                }
            }
        };
    }
]);