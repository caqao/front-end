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
ng_app.controller('NavBar', ['$scope', '$http', 'NavData',
    function($scope, $http, NavData) {
        $scope.g = NavData.g;
        $scope.g.get_navs();

        $scope.$watch('g.navs', function(newData){
            if (newData !== null){
                $scope.navs = newData;
            }
        }, true);
    }

]);
ng_app.controller('Page', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.g.get_data();
        $scope.show_tabs = $scope.g.count_if_show_tabs();
        $scope.loaded_page=true;

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
ng_app.controller('DetectorsPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.object_type = 'Detector';
        $scope.page_number = 0;

        $scope.update_scope_data = function(newVal){
            if (newVal !== null) {
                $scope.p.update_panel_data(newVal);
                $scope.sectors = newVal.sectors;
                $scope.rounds = newVal.rounds;
            }
        };
        $scope.$watch('g.last_update_time', function(){
            $scope.update_scope_data($scope.g.last_data);
        }, true);
    }
]);
ng_app.controller('SectorsPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.object_type = 'Sector';
        $scope.page_number = 0;

        $scope.update_scope_data = function(newVal){
            if (newVal !== null) {
                $scope.p.update_panel_data(newVal);
                $scope.sectors = newVal.sectors;
                $scope.rounds = newVal.rounds;
            }
        };
        $scope.$watch('g.last_update_time', function(){
            $scope.update_scope_data($scope.g.last_data);
        }, true);
        $scope.redirect_wrapper = ['/insp_cq/','/sector'];
    }
]);
ng_app.controller('RoundNotesPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.object_type = 'Round';
        $scope.page_number = 0;
        $scope.notes_height = 40;
        $scope.update_scope_data = function(newVal){
            if (newVal !== null) {
                $scope.p.update_panel_data(newVal);
                $scope.g.page_title = "Ronde d'opération "+$scope.values[0].title;
            }
        };
        $scope.set_scope_height = function () {
            if ($scope.values !== undefined) {
                $scope.notes_height = 24+22*(($scope.values[0].display.match(/\n/g) || []).length + 1);
            }
        };
        $scope.$watch('g.last_update_time', function(){
            $scope.update_scope_data($scope.g.last_data);
            $scope.set_scope_height();
        }, true);
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