/**
 * Created by alexis on 16/05/17.
 */
ng_app.controller('SanitationDepartmentsSetup', ['$scope', '$http',
    function($scope, $http) {
        $scope.init = function () {
            $scope.json_data = new JsonDataHandler($http, $scope.update_callback);


            $scope.new_modal_id = "#add_dept_modal";
            $scope.edit_modal_id = "#edit_dept_modal";
        };
        $scope.update_callback = function (data) {
            $scope.departments = $scope.json_data.data;
            $scope.manage_notifications(data);
            $scope.clear_entries();
            alert('callback');


        };
        $scope.manage_notifications = function (data) {
            // print($scope.departments); // TODO service for notification data
        };
        $scope.post_new_element = function() {
            alert($scope.ne_department_text);
        };
        $scope.post_new_element = function () {
            d = {
                department_text: $scope.ne_department_text
            };
            $scope.json_data.post_new_element(d);
        };
        $scope.post_edited_element = function () {
            d = {
                id: $scope.edit_department_id,
                attributes: {
                    department_text: $scope.edit_department_text
                }
            };
            $scope.json_data.post_edited_element(d);
        };
        $scope.open_new_modal = function () {
            $($scope.edit_modal_id).modal("show");
        };
        $scope.open_edit_modal = function (department) {
            $scope.edit_department_id = department.id;
            $scope.edit_department_text = department.department_text;
            $($scope.edit_modal_id).modal("show");
        };
        $scope.clear_entries = function () {
            $($scope.edit_modal_id).modal("hide");
            $($scope.new_modal_id).modal("hide");

            $scope.ne_department_text = '';
            $scope.edit_department_id = null;
            $scope.edit_department_text = '';

        }
    }
]);