ng_app.controller('TodoInspectionPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.p.loaded = true;
        $scope.page_number = 0;

        $scope.init = function (val_index) {
            $scope.values_index=val_index;
            $scope.panel_class = val_index % 2 == 0 ? 'panel-info' : 'panel-warning';
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
        };
        $scope.$watch('g.last_update_time', function(newVal, oldVal){
            if (newVal != undefined || newVal != null) {
                $scope.update_scope_data($scope.g.last_data);
            }
        }, true);
        $scope.update_scope_data = function(newVal){
            $scope.p.update_panel_data(newVal);
            //TODO panel_class, form template
            $scope.fb = '';
            $scope.sens = null;
            $scope.adj = null;
            $scope.eject_trouble = 'n/a';
            if ($scope.values.conform_eject === true){
                $scope.conform_ejection_message = 'Conforme';
            }
            else{
                if ($scope.values.conform_eject === false){
                    $scope.conform_ejection_message = 'Non-conforme';
                }
                else{
                    $scope.conform_ejection_message = 'N/A';
                }
            }
        };
        $scope.validate = function(){
            $http.post(this.url,
                {
                    action: 'validate_detector_reject',
                    data_dict: {
                        fb: $scope.fb,
                        sens: $scope.sens,
                        adj: $scope.adj,
                        eject_trouble: $scope.eject_trouble
                    }
                }
            ).then(
                function(response){
                    $scope.sent = true;
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