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
        $scope.g.update_todo_delays = function(){
            $scope.update_delay_data()
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
                }
            }
        };
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
            $scope.sendable = true;


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
                    $scope.g.unsent_changes = false;
                },
                function(response){
                    $scope.g.show_failure();
                }
            );
        };
        $scope.toggle_unsent_changes = function(){
            $scope.g.unsent_changes = ($scope.values.reject_comment.length>0 || $scope.values.fb.length>0)
        }
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
            $scope.sendable = true;

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
            $scope.g.badges[2]++;
            $scope.correction_comment = '';
            $scope.conform = 0;
            $scope.shown_results = false;
        };
        $scope.$watch('g.last_update_time', function(newVal, oldVal){
            if (newVal != undefined || newVal != null) {
                $scope.update_scope_data($scope.g.last_data);
            }
        }, true);
        $scope.update_scope_data = function(newVal){
            $scope.p.update_panel_data(newVal);
            $scope.old_conform = $scope.translate_bool($scope.values.conform);
            $scope.sendable = $scope.values.data_type==1;
            $scope.new_value = $scope.values.data_type == 2 ? '' : null;
        };
        $scope.translate_bool = function(boolean){
            return boolean === true ? 'Conforme' : boolean === false ? 'Non-conforme' : 'N/A';
        };
        $scope.validate = function(){
            var post_data = {
                action: 'validate_parametre_reject',
                comment: $scope.correction_comment,
                inspection_id: $scope.values.inspection_id,
                conform: $scope.conform,
                is_prod: $scope.values.is_prod
            };
            if ($scope.values.data_type > 1){
                post_data.old_value = $scope.values.bad_value;
                post_data.new_value = $scope.new_value;
            }
            $http.post($scope.g.url,
                post_data
            ).then(
                function(response){
                    $scope.sent = true;
                    $scope.g.badges[2]--;
                    $scope.g.unsent_changes = false;
                },
                function(response){
                    $scope.g.show_failure();
                }
            );
        };
        $scope.set_conform = function(val){
            $scope.conform = val;
        };
        $scope.show_results = function(){
            $scope.shown_results = true;
            $scope.create_plot();
        };

        $scope.create_plot = function () {
            create_op_plot(
                'parametre_reject_'+$scope.values.inspection_id+$scope.values.is_prod,
                $scope.values.data_type,
                $scope.values.prev_data
            );
        };
        $scope.watch_input_change = function (newV, type) {
            if (type==3) {
                if (newV === null || newV === undefined || newV === ''){
                    $scope.new_value = 0;
                    $scope.sendable = false;
                }
                else {
                    $scope.sendable = true;
                }
            }
            else {
                $scope.sendable = newV.length !== 0;
            }
        };
        $scope.toggle_unsent_changes = function(){
            $scope.g.unsent_changes = (!$scope.sendable || $scope.correction_comment.length>0)
        }
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
            $scope.g.badges[3]++;
            $scope.sendable = false;

        };
        $scope.$watch('g.last_update_time', function(newVal, oldVal){
            if (newVal != undefined || newVal != null) {
                $scope.update_scope_data($scope.g.last_data);
            }
        }, true);
        $scope.update_scope_data = function(newVal){
            $scope.p.update_panel_data(newVal);
        };
        $scope.show_results = function(){
            $scope.shown_results = true;
            $scope.create_plots();
            $scope.sendable = true;

        };
        $scope.create_plots = function () {
            for (var i = 0;i<$scope.values.parametres.length;i++) {
                create_op_plot(
                    'batch_' + $scope.values.batch_id + '_parametre_' + $scope.values.parametres[i].parametre_id,
                    $scope.values.parametres[i].data_type,
                    $scope.values.parametres[i].prev_data,
                    $scope.values.verifications
                );
            }
        };
        $scope.validate = function(){
            $http.post($scope.g.url,
                {
                    action: 'validate_op_batch',
                    batch_id: $scope.values.batch_id
                }
            ).then(
                function(response){
                    $scope.sent = true;
                    $scope.g.badges[3]--;
                },
                function(response){
                    $scope.g.show_failure();
                }
            );
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
ng_app.controller('AutoUpdate', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.$watch('g.last_update_time', function(newVal, oldVal){
            $scope.g.update_counter = 0;
            $scope.g.unsent_changes = false;

        }, true);
        $scope.g.check_if_updated_data = function () {
            $http.get($scope.g.url,
                {
                    params: {
                        action: 'check_if_needs_update',
                        last_time: $scope.g.last_update_time
                    }
                }).then(
                function(response){
                    if (response.data.needs_update === true){
                        $scope.g.update_external_values();
                    }
                    else{
                        $scope.g.update_counter = 0;
                    }
                },
                function(response){
                    $scope.g.show_failure();
                }
            );
        };
        $interval(function(){
            print($scope.g.unsent_changes);
            if ($scope.g.unsent_changes == false) {
                $scope.g.update_counter++;
                if ($scope.g.update_counter%3===0){
                    $scope.g.update_todo_delays
                }
                if ($scope.g.update_counter>11)
                {
                    $scope.g.update_counter = 0;
                    $scope.g.check_if_updated_data();
                }
            }
            else{
                $scope.g.update_counter = 0;
            }
        }, 10000);
        $scope.g.update_external_values = function(){
            $scope.g.updating_foreign = true;
            $scope.g.get_data();
            $scope.g.panel_class = 'panel-info';
            $timeout(function (){
                $scope.g.reset_color();
                $scope.g.updating_foreign = false;
                $scope.g.update_counter = 0;
            }, 3000);
        };
    }
]);
