var ng_app = angular.module('caqao_app', []);
ng_app.config(
    ['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.xsrfCookieName = 'csrftoken';
            $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }]);
ng_app.controller('Page', ['$rootScope', '$scope', '$http', '$interval', '$timeout',
    function($rootScope, $scope, $http, $interval, $timeout) {
        $rootScope.g = new PageCtrl($rootScope, $scope, $http, $interval, $timeout);
        $scope.g = $rootScope.g;
        $scope.g.get_data();
        //TODO create service to load data first

        $scope.assign_values = function(response){
            alert('assign data');
            $rootScope.values_list = response.data.elements.values_list;
            console.log($rootScope);
            $rootScope.sectors = response.data.elements.sectors;
            $rootScope.rounds = response.data.elements.rounds;
            $rootScope.columns_list = response.data.elements.columns_list;
        };
        $scope.$watch('g.changes_buffer', function(newVal, oldVal){
            $scope.g.watch_changes_buffer(newVal, oldVal);
        }, true);
        $scope.$watch('g.unsaved_changes', function(newVal, oldVal){
                $scope.g.watch_unsaved_changes(newVal, oldVal);
            }, true
        );
    }]);
ng_app.controller('DetectorsPanel', ['$rootScope', '$scope', '$http', '$interval', '$timeout',
    function($rootScope, $scope, $http, $interval, $timeout) {
    $scope.g = $rootScope.g;
    $scope.p = new PanelCtrl($rootScope, $scope, $http, $interval, $timeout);
    $scope.object_type = 'Detector';
        alert('la');
    $scope.values = $rootScope.values_list[0];
    $scope.columns = $rootScope.columns_list[0];

}]);
ng_app.controller('SectorsPanel', ['$rootScope', '$scope', '$http', '$interval', '$timeout',
    function($rootScope, $scope, $http, $interval, $timeout) {
    $scope.g = $rootScope.g;
    $scope.p = new PanelCtrl($rootScope, $scope, $http, $interval, $timeout);
    $scope.object_type = 'Sector';
    $scope.values = $rootScope.values_list[0];
    $scope.columns = $rootScope.columns_list[0];
    $scope.redirect_wrapper = ['/insp_cq/','/sector'];
}]);
ng_app.controller('RoundsPanel', ['$rootScope', '$scope', '$http', '$interval', '$timeout',
function($rootScope, $scope, $http, $interval, $timeout) {
    $scope.g = $rootScope.g;
    $scope.p = new PanelCtrl($rootScope, $scope, $http, $interval, $timeout);
    $scope.object_type = 'Round';
    $scope.redirect_wrapper = ['/prod/','/round'];
}]);