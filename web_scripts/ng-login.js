ng_app.controller('LoginPanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.g.show_logo = true;
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
ng_app.controller('PasswordChangePanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.p = new PanelCtrl($scope, $interval, $timeout);
        $scope.page_number = 1;
        $scope.ok_new_pw = false;
        $scope.old_pw = '';
        $scope.new_pw1 = '';
        $scope.new_pw2 = '';
        $scope.$watch('new_pw1', function(newVal){
            $scope.ok_new_pw = (newVal !== undefined && newVal.length > 4 && newVal === $scope.new_pw2)
        }, true);
        $scope.$watch('new_pw2', function(newVal){
            $scope.ok_new_pw = (newVal !== undefined && newVal.length > 4 && newVal === $scope.new_pw1)
        }, true);
        $scope.$watch('g.last_update_time', function(){
            if ($scope.g.last_data !== null) {
                $scope.p.update_panel_data($scope.g.last_data);
            }
        }, true);
        $scope.submit_new_pw = function(){
            $http.post($scope.g.url,
                {
                    action: 'new_password',
                    old_pw: $scope.old_pw,
                    new_pw: $scope.new_pw1,
                    email: $scope.chosen_email
                }
            )
                .then(
                    function(response){
                        if (response.data.valid === 1){
                            $scope.old_pw = '';
                            $scope.new_pw1 = '';
                            $scope.new_pw2 = '';
                            $scope.p.show_success(response.data.success_message);

                        }
                        else{
                            $scope.old_pw = '';
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
