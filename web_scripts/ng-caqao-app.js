var ng_app = angular.module('caqao_app', []);
ng_app.config(
    ['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.xsrfCookieName = 'csrftoken';
            $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }]);
ng_app.controller('DetectorsPage', ['$scope', '$http', '$interval', '$timeout',
    function($scope, $http, $interval, $timeout) {
    $scope.p = new PanelCtrl($scope, $http, $interval, $timeout);
    $scope.url = '/insp_cq/detectors';
    $scope.panel_id = 'div_0';
    $scope.p.get_data();
    $scope.object_type = 'Detector';

    $scope.assign_values = function(response){
        $scope.values = response.data.elements.detectors;
        $scope.sectors = response.data.elements.sectors;
        $scope.rounds = response.data.elements.rounds;
        $scope.columns = response.data.elements.columns;
    };
    $scope.$watch('p.changes_buffer', function(newVal, oldVal){
        $scope.p.watch_changes_buffer(newVal, oldVal);
    }, true);
    $scope.$watch('p.unsaved_changes', function(newVal, oldVal){
        $scope.p.watch_unsaved_changes(newVal, oldVal);
    }, true
    );
    $scope.show_modifications = function () {
        alert('incoming_feature'); //TODO format all modifications
    };
}]);
ng_app.controller('SectorsPage', ['$scope', '$http', '$interval', '$timeout',
    function($scope, $http, $interval, $timeout) {
    $scope.p = new PanelCtrl($scope, $http, $interval, $timeout);
    $scope.url = '/insp_cq/sectors';
    $scope.panel_id = 'div_0';
    $scope.p.get_data();
    $scope.object_type = 'Sector';
    $scope.redirect_wrapper = ['/insp_cq/','/sector'];

    $scope.assign_values = function(response){
        $scope.values = response.data.elements.sectors;
        $scope.columns = response.data.elements.columns;
    };
    $scope.$watch('p.changes_buffer', function(newVal, oldVal){
        $scope.p.watch_changes_buffer(newVal, oldVal);
    }, true);
    $scope.$watch('p.unsaved_changes', function(newVal, oldVal){
            $scope.p.watch_unsaved_changes(newVal, oldVal);
        }, true
    );
    $scope.show_modifications = function () {
        alert('incoming_feature'); //TODO format all modifications
    };
}]);
ng_app.controller('RoundsPage', ['$scope', '$http', '$interval', '$timeout',
function($scope, $http, $interval, $timeout) {
    $scope.p = new PanelCtrl($scope, $http, $interval, $timeout);
    $scope.url = '/prod/rounds';
    $scope.panel_id = 'div_0';
    $scope.p.get_data();
    $scope.object_type = 'Round';
    $scope.redirect_wrapper = ['/prod/','/round'];

    $scope.assign_values = function(response){
        $scope.values = response.data.elements.rounds;
        $scope.columns = response.data.elements.columns;
    };
    $scope.$watch('p.changes_buffer', function(newVal, oldVal){
        $scope.p.watch_changes_buffer(newVal, oldVal);
    }, true);
    $scope.$watch('p.unsaved_changes', function(newVal, oldVal){
            $scope.p.watch_unsaved_changes(newVal, oldVal);
        }, true
    );
    $scope.show_modifications = function () {
        alert('incoming_feature'); //TODO format all modifications
    };
}]);