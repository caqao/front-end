ng_app.controller('TodoInspectionPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
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
        $scope.toggle_running = function(){
            $http.put($scope.g.url, {
                update_list: [{
                    model: 'Sector',
                    at: 'is_running',
                    id: $scope.values.id,
                    new_value: !$scope.values.is_running
                }]
            })
                .then(
                    function(response){
                        $scope.values.is_running = !$scope.values.is_running;
                        $scope.update_delay_data();

                        // t.show_success();

                    },
                    function(response){
                        $scope.g.show_failure();
                    }
                );

        };
        $scope.update_delay_data = function() {
            if ($scope.values.interval_hrs == 0) {
                $scope.panel_class = "panel-default";
            }
            else {
                if ($scope.values.is_running === false) {
                    $scope.panel_class = "panel-info";
                    $scope.delay_message = null;
                }
                else {
                    var remaining_time = $scope.values.tightest_delay - new Date();
                    if (remaining_time < 0) {
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
                }
            }
        }
    }
]);
ng_app.controller('DetectorRejectPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.p.loaded = true;
        $scope.page_number = 1;
        $scope.sent = false;
        $scope.init = function (val_index) {
            $scope.values_index=val_index;
            $scope.g.badges[1]++;

        };
        $scope.$watch('g.last_update_time', function(newVal, oldVal){
            if (newVal != undefined || newVal != null) {
                $scope.update_scope_data($scope.g.last_data);
            }
        }, true);
        $scope.update_scope_data = function(newVal){
            $scope.p.update_panel_data(newVal);
            //TODO panel_class, form template
            $scope.values.fb = '';
            $scope.values.reject_comment = '';
            $scope.conform_ejection_message = $scope.translate_bool($scope.values.conform_eject);
            $scope.panel_class = 'panel-danger';
            if ($scope.values.numeric_inputs === false) {
                $scope.values.detec1 = $scope.translate_bool($scope.values.detec1);
                $scope.values.detec2 = $scope.translate_bool($scope.values.detec2);
                $scope.values.detec3 = $scope.translate_bool($scope.values.detec3);
            }

        };
        $scope.translate_bool = function(boolean){
            return boolean === true ? 'Conforme' : boolean === false ? 'Non-conforme' : 'N/A';
        };
        $scope.validate = function(){
            $http.post($scope.g.url,
                {
                    action: 'validate_detector_reject',
                    inspection_id: $scope.values.id,
                    fb: $scope.values.fb,
                    comment: $scope.values.reject_comment
                }
            ).then(
                function(response){
                    $scope.sent = true;
                    $scope.g.badges[1]--;
                },
                function(response){
                    $scope.g.show_failure();
                }
            );
        };
    }
]);
ng_app.controller('TodoDetectorPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.p.loaded = true;
        $scope.page_number = 2;
        $scope.init = function (val_index) {
            $scope.values_index=val_index;
            $scope.g.badges[1]++;
            $scope.shown_results = false;

        };
        $scope.show_results = function(){
            $scope.shown_results = true;
            $scope.create_plot();
        };

        $scope.$watch('g.last_update_time', function(newVal, oldVal){
            if (newVal != undefined || newVal != null) {
                $scope.update_scope_data($scope.g.last_data);
            }
        }, true);
        $scope.update_scope_data = function(newVal){
            $scope.p.update_panel_data(newVal);
        };
        $scope.get_insp_id = function(coll){
            return coll.id
        };
        $scope.validate = function(){
            $http.post($scope.g.url,
                {
                    action: 'validate_detector_inspections',
                    inspection_id_list: $scope.values.prev_data.map($scope.get_insp_id)
                }
            ).then(
                function(response){
                    $scope.sent = true;
                    $scope.g.badges[1]--;
                },
                function(response){
                    $scope.g.show_failure();
                }
            );
        };
        $scope.create_plot = function () {
            if ($scope.values.numeric_inputs === true){
                create_num_det_plot(
                    'detector_validation_'+$scope.values.id,
                    $scope.values.prev_data,
                    $scope.values.threshold
                );
            }
            else{
                create_bool_det_plot(
                    'detector_validation_'+$scope.values.id,
                    $scope.values.prev_data
                );
            }

        };
        // $scope.create_plot();

    }
]);
ng_app.controller('TodoRejectPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.p.loaded = true;
        $scope.page_number = 3;
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
            //TODO det delay_message, panel_class
        };
    }
]);
ng_app.controller('TodoOpPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.p.loaded = true;
        $scope.page_number = 4;
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
            //TODO det delay_message, panel_class
        };
    }
]);
ng_app.controller('TodoSanitPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.p.loaded = true;
        $scope.page_number = 5;
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
            //TODO det delay_message, panel_class
        };
    }
]);