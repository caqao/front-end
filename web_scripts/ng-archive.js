ng_app.controller('ArchivePicker', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.g.shown = false;

        $scope.init = function(){
            $scope.chosen_element = 0;
            $scope.get_all_choices();
            $scope.begin_date =  new Date();
            $scope.begin_date.setHours(0);
            $scope.begin_date.setMinutes(0);
            $scope.begin_date.setSeconds(0);
            $scope.begin_date.setMilliseconds(0);
            $scope.end_date =  new Date();
            $scope.end_date.setHours(23);
            $scope.end_date.setMinutes(59);
            $scope.end_date.setSeconds(59);
            // $scope.end_date.setMilliseconds(999);
        };
        $scope.$watch('begin_date', function(newValue){
            if (newValue===undefined){
                $scope.valid_begin = false;
            }
            else{
                if(newValue === null){
                    $scope.begin_date = new Date(2016,7,31);
                }
                $scope.valid_begin = $scope.end_date > $scope.begin_date;
            }
        }, true);
        $scope.$watch('end_date', function(newValue){
            if (newValue===undefined){
                $scope.valid_end = false;
            }
            else{
                if(newValue === null){
                    $scope.end_date = new Date();
                }
                $scope.valid_end = $scope.end_date > $scope.begin_date;
            }
        }, true);
        $scope.get_all_choices = function(){
            $http.get($scope.g.url,
                {
                    params: {action: 'get_all_choices'}
                }).then(
                function(response){
                    $scope.element_options=response.data.element_options;
                    $scope.sectors=response.data.sectors || null;
                    $scope.rounds=response.data.rounds || null;
                    $scope.detectors=response.data.detectors || null;
                    $scope.departments=response.data.departments || null;
                    $scope.cq_parametres=response.data.cq_parametres || null;
                    $scope.op_parametres=response.data.op_parametres || null;
                },
                function(response){
                    $scope.g.show_failure();
                }
            );
        };
        $scope.toggle_show = function(){
            if ($scope.g.shown===false){
                var choice_data = $scope.make_choice_data();
                $scope.g.chosen_element=$scope.chosen_element;
                choice_data.chosen_element=$scope.chosen_element;
                choice_data.action = 'get_data_from_choice';
                choice_data.begin = $scope.begin_date/1000;
                choice_data.end = $scope.end_date/1000;
                $http.get($scope.g.url,
                    {
                        params: choice_data
                    }).then(
                    function(response){
                        print(response.data.results);
                        // $scope.results = response.data.results;
                        $scope.g.results=response.data.results;
                        // print($scope.g.results);
                    },
                    function(response){
                        $scope.g.show_failure();
                    }
                );
            }
            // $scope.g.results = $scope.results;
            $scope.g.shown = ! $scope.g.shown;
        };
        $scope.make_choice_data = function(){
            switch ($scope.chosen_element){
                case 1:
                    return {
                        parametres: $scope.chosen_cq_parametres
                    };
                    break;
                case 2:
                    return {
                        parametres: $scope.chosen_op_parametres
                    };
                    break;
                case 3:
                    return {
                        detectors: $scope.chosen_detectors
                    };
                    break;
                case 4:
                    return {
                        departments: $scope.chosen_departments
                    };
                    break;
                default:
                    return {};
                    break;
            }
        };
    }
]);
ng_app.controller('ArchivePanel', ['$scope', '$http', '$interval', '$timeout', 'PageData',
    function($scope, $http, $interval, $timeout, PageData) {
        $scope.g = PageData.g;
        $scope.init = function(index){
            $scope.values = $scope.g.results[index];
            print($scope.values);

        };

    }
]);