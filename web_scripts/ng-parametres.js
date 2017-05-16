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
        $scope.notes_height = 60;
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
ng_app.controller('SectorNotesPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.object_type = 'Sector';
        $scope.page_number = 0;
        $scope.notes_height = 40;
        $scope.update_scope_data = function(newVal){
            if (newVal !== null) {
                $scope.p.update_panel_data(newVal);
                $scope.g.page_title = "Secteur d'inspection "+$scope.values[0].title;
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
ng_app.controller('TaskPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.page_number = 0;
        $scope.object_type = 'Task';

        $scope.$watch('g.last_update_time', function(){
            if ($scope.g.last_data !== null) {
                $scope.p.update_panel_data($scope.g.last_data);
            }
        }, true);
    }
]);
ng_app.controller('DepartmentsPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.object_type = 'Department';
        $scope.page_number = 0;

        $scope.update_scope_data = function(newVal){
            if (newVal !== null) {
                $scope.p.update_panel_data(newVal);
                $scope.sectors = newVal.sectors;
                $scope.rounds = newVal.rounds;
                print($scope.p);
                print($scope.g);

            }
        };
        $scope.$watch('g.last_update_time', function(){
            $scope.update_scope_data($scope.g.last_data);
        }, true);
    }
]);