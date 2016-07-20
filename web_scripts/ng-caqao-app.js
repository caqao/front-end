// angular.module('caqao_app', ['ngCookies'])
    // .config([
    //     '$httpProvider',
    //     '$interpolateProvider',
    //     function($httpProvider, $interpolateProvider) {
    //         // $interpolateProvider.startSymbol('{$');
    //         // $interpolateProvider.endSymbol('$}');
    //         console.log('sooooomething');
    //
    //         $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    //         $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    // }])
    // .run([
    //     '$http',
    //     '$cookies',
    //     function($http, $cookies) {
    //         $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    // }])
angular.module('caqao_app', [])
    .config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.xsrfCookieName = 'csrftoken';
            $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        }])
    .controller('DetectorsPage', ['$scope', '$http', function($scope, $http) {
        $scope.unsaved_changes = false;

        $scope.get_data = function() {
            $http.get('/insp_cq/detectors',
                {
                    params: {get_action: 'load_panel_elements', div_id: 'div-0'}
                }).then(
                function(response){
                    $scope.values = response.data.elements.detectors;
                    $scope.sectors = response.data.elements.sectors;
                    $scope.rounds = response.data.elements.rounds;
                },
                function(response){
                    alert('failed');
                }
            );
        };
        $scope.get_data();
        $scope.panel_class = 'panel-default';
        $scope.object_type = 'Detector';
        $scope.changes_buffer = [];
        $scope.columns = [
            {name: 'id', title: '#', width: 10},
            {name: 'sector', title: 'Secteur CQ', width: 25},
            {name: 'op_round', title: 'Ronde OP', width: 25},
            {name: 'conform_ejection_threshold', title: 'Tolérance', width: 10},
            {name: 'op_interval', title: 'Intervalle OP', width: 10},
            {name: 'is_active_cq', title: 'Actif CQ', width: 10},
            {name: 'is_active_op', title: 'Actif Prod', width: 10}
        ];

        $scope.$watch('changes_buffer', function(newVal, oldVal){
            if (newVal !== oldVal) {
                if (newVal.length > 0) {
                    $scope.unsaved_changes = true;
                }
                else {
                    $scope.unsaved_changes = false;
                }
            }
        }, true);
        $scope.$watch('unsaved_changes', function(newVal, oldVal){
            if (newVal !== oldVal) {
                if ($scope.unsaved_changes) {
                    $scope.panel_class = 'panel-warning';
                }
                else {
                    $scope.panel_class = 'panel-default';
                }
            }
        }, true);


        $scope.valid_change = function(oldVal, newVal, object, col){
            if (newVal==undefined){
                $(object).attr(col, oldVal);
            }
            else{
                $scope.add_to_change_buffer($(object).attr('id'), col, newVal)
            }
        };
        $scope.add_to_change_buffer = function(obj_id, col, newVal) {
            var new_update = {
                model: $scope.object_type,
                id: obj_id,
                at: col,
                new_value: newVal
            };
            var present_index = $scope.check_update_presence(new_update);
            if (present_index===false){
                $scope.changes_buffer.push(new_update)
            }else{
                $scope.changes_buffer[present_index] = new_update;
            }
        };
        $scope.check_update_presence = function(new_up) {
            var nup = $(new_up);
            for (i=0;i<$scope.changes_buffer.length; i++){
                var chg = $($scope.changes_buffer[i]);
                if (chg.attr('model')==nup.attr('model') &&
                    chg.attr('id')==nup.attr('id') &&
                    chg.attr('at')==nup.attr('at')){
                    return i;
                }
            }
            return false;

        };
        $scope.cancel_update = function() {
            $scope.changes_buffer = [];
            $scope.request_update();
        };
        $scope.submit_changes = function() {
            var csrftoken = getCookie('csrftoken');
            $http.put('/insp_cq/detectors/', {update_list: $scope.changes_buffer})
                .then(
                    function(response){
                        $scope.cancel_update();
                    },
                    function(response){
                        // failure callback
                        console.log('failure');
                    }
                );
        };
        $scope.request_update = function() {
            $scope.get_data();
        };
        $scope.show_modifications = function () {
            alert('incoming_feature'); //TODO format all modifications
        };

    }])
;
