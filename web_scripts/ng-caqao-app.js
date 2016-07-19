// angular.module('caqao_app', ['ngCookies'])
    // .config([
    //     '$httpProvider',
    //     '$interpolateProvider',
    //     function($httpProvider, $interpolateProvider) {
    //         // $interpolateProvider.startSymbol('{$');
    //         // $interpolateProvider.endSymbol('$}');
    //         console.log('sooooomething');
    //
    //         $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    //         $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    // }])
    // .run([
    //     '$http',
    //     '$cookies',
    //     function($http, $cookies) {
    //         $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    // }])
angular.module('caqao_app', [])
    .controller('DetectorsPage', ['$scope', '$http', function($scope, $http) {
        $http.get('/insp_cq/detectors',
            {params: {get_action: 'load_panel_elements', div_id: 'div-0'}
        }).then(function (response) {
            $scope.values = response.data.elements.detectors;
            $scope.sectors = response.data.elements.sectors;
            $scope.rounds = response.data.elements.rounds;

        }).then(function (response) {
            console.log(response);
        })
        ;
        $scope.columns = [
            {name: 'id', title: '#', width: 10},
            {name: 'sector', title: 'Secteur CQ', width: 25},
            {name: 'op_round', title: 'Ronde OP', width: 25},
            {name: 'conform_ejection_threshold', title: 'Tolérance', width: 10},
            {name: 'op_interval', title: 'Intervalle OP', width: 10},
            {name: 'is_active_cq', title: 'Actif CQ', width: 10},
            {name: 'is_active_op', title: 'Actif Prod', width: 10}
        ];
    }])
;
