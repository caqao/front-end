var ng_app = angular.module('caqao_app', []);
ng_app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);
ng_app.service('PageData', function($http, $interval, $timeout){
    this.g = new PageCtrl($http, $interval, $timeout);
});
ng_app.service('NavData', function($http){
    this.g = new NavCtrl($http);
});
ng_app.directive('watchResizeTabs', function(){
    return {
        restrict: 'A',
        link: function(scope, elem, attr) {
            angular.element(window).on('resize', function(){
                scope.$apply(function(){
                    var off = document.getElementById('top_affix').offsetHeight+30;
                    scope.content_style = {"padding": off+"px 0 0 0"};
                });
            });
        }
    }
});
ng_app.controller('NavBar', ['$scope', '$http', 'NavData',
    function($scope, $http, NavData) {
        $scope.g = NavData.g;
        $scope.g.get_navs();
        $scope.$watch('g.user', function(newUser){
            if (newUser !== null){
                $scope.admin_link = newUser.admin;
                $scope.is_anon = newUser.anon;
                $scope.username = newUser.username;
            }
        }, true);
        $scope.$watch('g.navs', function(newData){
            if (newData !== null){
                $scope.navs = newData;
            }
        }, true);
    }
]);
ng_app.controller('Page', ['$scope', '$http', '$interval', '$timeout', '$window', 'PageData',
    function($scope, $http, $interval, $timeout, $window, PageData) {
        $scope.g = PageData.g;
        $scope.g.get_data();
        $scope.show_tabs = $scope.g.count_if_show_tabs();
        $scope.loaded_page=true;
        var off = document.getElementById('top_affix').offsetHeight;
        $scope.content_style = {"padding": off+"px 0 0 0"};

        $scope.update_scope_data = function(newVal){
            if (newVal !== null) {
                $scope.sectors = newVal.sectors;
                $scope.rounds = newVal.rounds;
            }
        };
        $scope.$watch('g.last_update_time', function(){
            $scope.update_scope_data($scope.g.last_data);
        }, true);
        $scope.$watch('g.changes_buffer', function(newVal, oldVal){
            $scope.g.watch_changes_buffer(newVal, oldVal);
        }, true);
        $scope.$watch('g.unsaved_changes', function(newVal, oldVal){
                $scope.g.watch_unsaved_changes(newVal, oldVal);
            }, true
        );
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