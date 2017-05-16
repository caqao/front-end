ng_app.controller('MaintenancePanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.p.loaded = true;

        $scope.$watch('panel_class', function(newVal, oldVal){
            if ($scope.page_number == 0){
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
            }
        }, true);

        $scope.init = function (page_index, val_index) {
            $scope.page_number = page_index;
            $scope.values_index = val_index;
            $scope.panel_class = null;
            $scope.show_video = false;
            $scope.sent = false;
            $scope.done = null;
            $scope.time_filter = ['shortTime', 'short'][page_index];
        };

        $scope.$watch('g.last_update_time', function(newVal, oldVal){
            if (newVal != undefined || newVal != null) {
                $scope.update_scope_data($scope.g.last_data);
                $scope.g.unsent_changes = 0;
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
        $scope.change_done = function (boolean) {
            if ($scope.done === null){
                $scope.g.unsent_changes++;
            }
            $scope.done = boolean;
        };
        $scope.g.update_todo_delays = function(){
            $scope.update_delay_data()
        };
        $scope.update_delay_data = function() {
            var remaining_time = $scope.values.todo_time - new Date();
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
        $scope.submit_maintenance = function(){
            $http.post($scope.g.url,
                {
                    action: 'enter_task',
                    task_id: $scope.values.task_id,
                    done: $scope.done,
                    comment: $scope.comment
                }
            ).then(
                function(response){
                    if ($scope.page_number == 0){
                        $scope.sent = true;
                    }
                    else{
                        $scope.cancel_maintenance()
                    }
                    $scope.panel_class = "panel-success";
                    $scope.delay_message = null;
                },
                function(response){
                    $scope.g.show_failure();
                }
            );
        };
        $scope.cancel_maintenance = function () {
            $scope.done=null;
            delete $scope.comment;
            $scope.g.unsent_changes--;

        };
    }
]);
ng_app.controller('NewTaskPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.page_number = 2;
        $scope.p.loaded = true; //hotfix qui permet d'afficher le panneau même si aucune info à loader
        // $scope.object_type = 'Task';


        $scope.post_task = function(){
            $http.post($scope.g.url,
                {
                    action: 'new_task',
                    task_name: $scope.task_name,
                    resp_id: $scope.resp_id,
                    dept_id: $scope.dept_id,
                    interval: $scope.interval,
                    procedure: $scope.procedure,
                    embed: $scope.embed,
                    // active: $scope.active
                }
            ).then(
                function(response){
                    $scope.panel_class = "panel-success";
                    $scope.delay_message = null;
                    $scope.clear_form();
                },
                function(response){
                    $scope.g.show_failure();
                }
            );
        };
        $scope.clear_form = function () {
            $scope.task_name = '';
            $scope.resp_id = null;
            $scope.dept_id = null;
            $scope.interval = 0;
            $scope.procedure = '';
            $scope.embed = '';
            // $scope.active = true;
        };
        $scope.clear_form();
    }
]);