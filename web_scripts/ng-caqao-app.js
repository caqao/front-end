var ng_app = angular.module('caqao_app', [

]);
ng_app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.post['Content-Type'] = ''
        + 'application/x-www-form-urlencoded; charset=UTF-8';
}]);
ng_app.service('PageData', function($http, $interval, $timeout){
    this.g = new PageCtrl($http, $interval, $timeout);
    this.g.get_data();

});
ng_app.directive('watchResizeTabs', function(){ //depreciated
    return {
        restrict: 'A',
        link: function(scope, elem, attr) {
            angular.element(window).on('resize', function(){
                scope.$apply(function(){
                    var off = document.getElementById('top_affix').offsetHeight+30;
                    off = off > 200 ? 200 : off;
                    scope.content_style = {"padding": off+"px 0 0 0"};
                });
            });
        }
    }
});
ng_app.filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);
ng_app.controller('Page', ['$scope', '$http', '$interval', '$timeout', '$window', 'PageData',
    function($scope, $http, $interval, $timeout, $window, PageData) {
        $scope.g = PageData.g;
        // $scope.g.get_data();
        $scope.show_tabs = $scope.g.count_if_show_tabs();
        $scope.loaded_page=true;
        var off = document.getElementById('top_affix').offsetHeight;
        off = off > 200 ? 200 : off;
        $scope.content_style = {"padding": off+"px 0 0 0"};
        $scope.$watch('g.changes_buffer', function(newVal, oldVal){
            $scope.g.watch_changes_buffer(newVal, oldVal);
        }, true);
        $scope.$watch('g.unsaved_changes', function(newVal, oldVal){
                $scope.g.watch_unsaved_changes(newVal, oldVal);
            }, true
        );
        $scope.init = function(conf){
            $scope.g.needs_user_confirmation = conf;
            if (conf){
                var r = confirm("Svp confirmez que vous êtes toujours "+conf+
                    ".\nSi ce n'est pas vous, veuillez cliquer Cancel,\nvous serez redirigé"+
                    " vers la page de connexion.");
                if (r == true) {
                    $scope.g.needs_user_confirmation = 0;
                } else {
                    $scope.g.redirect('/');
                }
            }
        };
    }
]);
ng_app.controller('BlankPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.p.loaded = true;
    }
]);
ng_app.controller('DefaultPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.$watch('g.last_update_time', function(){
            if ($scope.g.last_data !== null) {
                $scope.p.update_panel_data($scope.g.last_data);
            }
        }, true);
        $scope.init = function(page_number, obj_type, kwargs){
            $scope.page_number = page_number;
            $scope.object_type = obj_type;
            if ( kwargs.redirect_wrapper !== undefined){
                $scope.redirect_wrapper = kwargs.redirect_wrapper.split('~');
            }
        };
    }
]);