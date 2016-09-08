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
        $scope.$watch('chosen_sector', function(newValue){
            if (newValue!==undefined){
                $scope.parametre_choices=$($scope.cq_parametres).attr('p_'+newValue);
            }
        }, true);
        $scope.$watch('chosen_round', function(newValue){
            if (newValue!==undefined){
                $scope.parametre_choices=$($scope.op_parametres).attr('p_'+newValue);
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
                        $scope.g.results=response.data.results;
                    },
                    function(response){
                        $scope.g.show_failure();
                    }
                );
            }
            $scope.g.shown = ! $scope.g.shown;
        };
        $scope.make_choice_data = function(){
            switch ($scope.chosen_element){
                case 1:
                    return {
                        parametres: $scope.chosen_parametres
                    };
                    break;
                case 2:
                    return {
                        parametres: $scope.chosen_parametres
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
            $scope.plot_id= 'plot-'+index;
            $scope.clicked_archive = null;
            $scope.values = $scope.g.results[index];
            $scope.show_graph = null;
            $scope.panel_class = 'panel-default';
            $scope.graph_class = ($scope.values.data_type === 3 || $scope.g.chosen_element===3) ? 'measDiv' : 'scatterDiv';
            $scope.changetraker = 0;
        };
        $scope.$watch('clicked_archive', function(newValue){
            if (newValue!==undefined && newValue!==null){
                switch ($scope.g.chosen_element){
                    case 3:
                        $scope.clicked_archive.translated_conformity = $scope.translate_bool(newValue.conform_eject);
                        if(typeof(newValue.detec1) === "boolean"){
                            $scope.clicked_archive.d1=$scope.translate_bool(newValue.detec1);
                            $scope.clicked_archive.d2=$scope.translate_bool(newValue.detec2);
                            $scope.clicked_archive.d3=$scope.translate_bool(newValue.detec3);

                        }
                        else{
                            $scope.clicked_archive.d1=newValue.detec1;
                            $scope.clicked_archive.d2=newValue.detec2;
                            $scope.clicked_archive.d3=newValue.detec3;
                        }
                        if (newValue.reject !== false){
                            if (newValue.reject.user.length && newValue.reject.user !== null  && newValue.reject.user !== undefined ){
                                $scope.clicked_archive.show_reject = true;
                                $scope.clicked_archive.validation_str = 'validé par '+newValue.reject.user || 'N/A';
                            }
                            else{
                                $scope.clicked_archive.show_reject = false;
                                $scope.clicked_archive.validation_str = 'jamais validé';
                            }
                        }
                        break;
                    case 4:
                        $scope.clicked_archive.user = newValue.validated_by;
                        $scope.clicked_archive.translated_conformity = newValue.done ? 'Fait' : 'Non-fait';
                        break;

                    default:
                        $scope.clicked_archive.translated_conformity = $scope.translate_bool(newValue.conform);
                        break;
                }
                // if ($scope.g.chosen_element === 3){
                //     $scope.clicked_archive.translated_conformity = $scope.translate_bool(newValue.conform_eject);
                //     if(typeof(newValue.detec1) === "boolean"){
                //         $scope.clicked_archive.d1=$scope.translate_bool(newValue.detec1);
                //         $scope.clicked_archive.d2=$scope.translate_bool(newValue.detec2);
                //         $scope.clicked_archive.d3=$scope.translate_bool(newValue.detec3);
                //
                //     }
                //     else{
                //         $scope.clicked_archive.d1=newValue.detec1;
                //         $scope.clicked_archive.d2=newValue.detec2;
                //         $scope.clicked_archive.d3=newValue.detec3;
                //     }
                //     if (newValue.reject !== false){
                //         if (newValue.reject.user.length && newValue.reject.user !== null  && newValue.reject.user !== undefined ){
                //             $scope.clicked_archive.show_reject = true;
                //             $scope.clicked_archive.validation_str = 'validé par '+newValue.reject.user || 'N/A';
                //         }
                //         else{
                //             $scope.clicked_archive.show_reject = false;
                //             $scope.clicked_archive.validation_str = 'jamais validé';
                //         }
                //     }
                //
                //
                // }
                // else{
                //     $scope.clicked_archive.translated_conformity = $scope.translate_bool(newValue.conform);
                // }
            }
        }, true);
        $scope.translate_bool = function(boolean){
            return boolean === true ? 'Conforme' : boolean === false ? 'Non-conforme' : 'N/A';
        };
        $scope.format_numeric_detector_correction = function (new_bool, new_value) {
            return $scope.translate_bool(new_bool)+": "+new_value
        };
        $scope.show_results = function () {
            if ($scope.show_graph === null){
                $scope.create_plot();
            }
            $scope.show_graph = !$scope.show_graph;
        };
        $scope.create_plot = function(){
            $scope.graph_div = document.getElementById($scope.plot_id);
            switch ($scope.g.chosen_element){
                case 1:
                case 2:
                    archive_op_plot(
                        $scope.plot_id,
                        $scope.values.data_type,
                        $scope.values.prev_data
                    );
                    break;
                case 3:
                    if ($scope.values.numeric_inputs === true){
                        archive_num_det_plot(
                            $scope.plot_id,
                            $scope.values.prev_data,
                            $scope.values.threshold
                        );
                    }
                    else{
                        archive_bool_det_plot(
                            $scope.plot_id,
                            $scope.values.prev_data
                        );
                    }
                    break;
                case 4:
                    sanit_archive_plot(
                        $scope.plot_id,
                        $scope.values.prev_data
                    );
                    break;
                default:
                    reject_archive_plot(
                        $scope.plot_id,
                        $scope.values.prev_data
                    );
                    break;
            }
            $scope.graph_div.on('plotly_click', function(data){$scope.show_clicked_data(data)});
        };
        $scope.show_clicked_data = function(data){
            var prev_data_id = data.points[0].fullData.text[data.points[0].pointNumber];
            for (var i = 0; i<$scope.values.prev_data.length;i++){
                if ($scope.values.prev_data[i].id === prev_data_id){
                    $scope.set_clicked_data($scope.values.prev_data[i]);
                }
            }
        };
        $scope.set_clicked_data = function(clicked_data){
            $scope.clicked_archive = clicked_data;
            $scope.$apply();
        };
    }
]);