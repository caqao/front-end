// /**
//  * Created by alexis on 17/05/17.
//  */
// ng_app.service('$json_data', function($http) {
//     var jdh = new JsonDataHandler($http);
//     // jdh.load_data();
//     this.data = null;
//
//     this.get_data = function () {
//         return jdh.get_data();
//     };
//
//     this.set_data = function (data) {
//         jdh.set_data(data);
//     };
//
//     this.load_data = function () {
//         jdh.load_data();
//         print(jdh.get_data());
//         this.data = jdh.get_data();
//     };
// });
function JsonDataHandler(http, update_func){
    this.http = http;
    this.update_callback = update_func;
    this.load_data();
}
JsonDataHandler.prototype.set_data = function (data) {
    this.data = data;
};
JsonDataHandler.prototype.get_data = function () {
    return this.data;
};
JsonDataHandler.prototype.load_data = function () {
    var t = this;
    this.http.get(window.location.href,
        {
            params: {action: 'load_page_data'}

        }).then(
        function(response){
            t.set_data(response.data);
            t.update_callback(response.data);
        },
        function(response){
            alert('transmission échouée');
        }
    );
};
JsonDataHandler.prototype.post_edited_element = function (data_dict) {
    var t = this;
    this.http.post(window.location.href,
        {
            action: 'edit_element',
            data: data_dict
        }
        ).then(
        function(response){
            t.set_data(response.data);
            t.update_callback(response.data);
        },
        function(response){
            alert('transmission échouée');
        }
    );
};
JsonDataHandler.prototype.post_new_element = function (data_dict) {
    var t = this;
    this.http.post(window.location.href, {
            action: 'new_element',
            data: data_dict
        }
        ).then(
        function(response){
            t.set_data(response.data);
            t.update_callback(response.data);
        },
        function(response){
            alert('transmission échouée');
        }
    );
};
// JsonDataHandler.prototype.post = function (data_dict){};
