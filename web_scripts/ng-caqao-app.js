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
ng_app.directive('watchResize', function(){
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
ng_app.controller('LoginPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.page_number = 0;
        $scope.loginTypeArray = [];
        $scope.loginTypeArray.push({label: "Pseudonyme", val: 0});
        $scope.loginTypeArray.push({label: "Nom", val: 1});
        $scope.loginTypeArray.push({label: "Courriel", val: 2});
        $scope.readyForm = false;
        $scope.selected_type = 0;
        $scope.password = '';
        $scope.ok_pass = false;
        $scope.ok_log = false;

        $scope.$watch('g.last_update_time', function(){
            if ($scope.g.last_data !== null) {
                $scope.p.update_panel_data($scope.g.last_data);
            }
        }, true);
        $scope.ChangeInputType = function (val_int) {
            $scope.selected_type = val_int;
        };
        $scope.$watch('selected_type', function(){
            $scope.clear_inputs();
        }, true);
        $scope.$watch('password', function(newVal){
            $scope.ok_pass = newVal.length > 4;
        }, true);
        $scope.$watch('u_n', function(newVal){
            if (newVal.length > 4){
                for (i=0;  i<$scope.values.length; i++){
                    if ($scope.values[i].username === newVal){
                        $scope.ok_log = true;
                        break;
                    }
                }
            }
        }, true);
        $scope.$watch('p_n', function(newVal){
            $scope.valid_first = false;
            if (newVal.length > 0){
                for (i=0;  i<$scope.values.length; i++){
                    if ($scope.values[i].first_name === newVal){
                        $scope.valid_first = true;
                        if($scope.values[i].last_name === $scope.n_n){
                            $scope.ok_log = true;
                            break;
                        }
                    }
                }
            }
        }, true);
        $scope.$watch('n_n', function(newVal){
            $scope.valid_last = false;
            if (newVal.length > 0){
                for (i=0;  i<$scope.values.length; i++){
                    if ($scope.values[i].last_name === newVal){
                        $scope.valid_last = true;
                        if($scope.values[i].first_name === $scope.p_n){
                            $scope.ok_log = true;
                            break;
                        }
                    }
                }
            }
        }, true);
        $scope.$watch('email', function(newVal){
            if (newVal !== undefined && newVal.length > 8){
                for (i=0;  i<$scope.values.length; i++){
                    if ($scope.values[i].email === newVal){
                        $scope.ok_log = true;
                        break;
                    }
                }
            }
        }, true);
        $scope.clear_inputs = function(){
            $scope.u_n = '';
            $scope.p_n = '';
            $scope.n_n = '';
            $scope.email = '';
            $scope.ok_log = false;
        };
        $scope.submit_login = function(){
            $http.post($scope.g.url,
                {
                    action: 'login',
                    password: $scope.password,
                    first_name: $scope.p_n,
                    last_name: $scope.n_n,
                    username: $scope.u_n,
                    email: $scope.email,
                    login_type: $scope.selected_type
                }
            )
                .then(
                    function(response){
                        if (response.data.valid === 1){
                            $scope.g.redirect(response.data.next_page);
                        }
                        else{
                            $scope.p.show_error(response.data.error_message);
                        }
                    },
                    function(response){
                        alert('transmission error')
                    }
                );
        }
    }
]);
ng_app.controller('NewUserPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.page_number = 0;
        $scope.u_n = '';
        $scope.p_n = '';
        $scope.n_n = '';
        $scope.pw1 = '';
        $scope.pw2 = '';
        $scope.email = '';
        $scope.group = undefined;
        $scope.ok_un = false;
        $scope.ok_em = false;
        $scope.ok_pw = false;
        $scope.groupTypeArray = [];
        $scope.groupTypeArray.push({label: "Contrôle qualité", val: 1});
        $scope.groupTypeArray.push({label: "Opérateur", val: 2});
        $scope.groupTypeArray.push({label: "Sanitation", val: 3});
        $scope.$watch('u_n', function(newVal){
            $scope.already_un = false;
            $scope.ok_un = false;
            if (newVal.length > 4){
                var found = false;
                for (i=0;  i<$scope.values.length; i++){
                    if ($scope.values[i].username === newVal){
                        found = true;
                        break;
                    }
                }
                $scope.already_un = found;
                $scope.ok_un = !found;
            }

        }, true);
        $scope.$watch('email', function(newVal){
            $scope.already_mail = false;
            $scope.ok_em = false;
            if (newVal !== undefined && newVal.length > 8){
                var found = false;
                for (i=0;  i<$scope.values.length; i++){
                    if ($scope.values[i].email === newVal){
                        found = true;
                        break;
                    }
                }
                $scope.already_mail = found;
                $scope.ok_em = !found;
            }
        }, true);
        $scope.$watch('pw1', function(newVal){
            $scope.ok_pw =  (newVal !== undefined && newVal.length > 4 && newVal === $scope.pw2)
        }, true);
        $scope.$watch('pw2', function(newVal){
            $scope.ok_pw =  (newVal !== undefined && newVal.length > 4 && newVal === $scope.pw1)
        }, true);

        $scope.$watch('g.last_update_time', function(){
            if ($scope.g.last_data !== null) {
                $scope.p.update_panel_data($scope.g.last_data);
            }
        }, true);
        $scope.change_group = function(group_number){
            $scope.group = group_number;
        };
        $scope.submit_user = function(){
            $http.post($scope.g.url,
                {
                    action: 'add_user',
                    password: $scope.pw1,
                    first_name: $scope.p_n,
                    last_name: $scope.n_n,
                    username: $scope.u_n,
                    email: $scope.email,
                    group: $scope.group,
                    login_type: $scope.selected_type
                }
            )
                .then(
                    function(response){
                        if (response.data.valid === 1){
                            $scope.g.redirect(response.data.next_page);
                        }
                        else{
                            $scope.p.show_error(response.data.error_message);
                        }
                    },
                    function(response){
                        alert('transmission error')
                    }
                );
        }
    }
]);
ng_app.controller('ForgottenPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.page_number = 0;
        // $scope.chosen_email = 'Votre adresse courriel';
        $scope.chosen_email = false;

        $scope.$watch('g.last_update_time', function(){
            if ($scope.g.last_data !== null) {
                $scope.p.update_panel_data($scope.g.last_data);
            }
        }, true);
        $scope.submit_forgotten_pw = function(){
            $http.post($scope.g.url,
                {
                    action: 'forgot_password',
                    email: $scope.chosen_email
                }
            )
                .then(
                    function(response){
                        if (response.data.valid === 1){
                            $scope.p.show_success(response.data.success_message);

                        }
                        else{
                            $scope.p.show_error(response.data.error_message);
                        }
                    },
                    function(response){
                        alert('transmission error')
                    }
                );
        }
    }
]);