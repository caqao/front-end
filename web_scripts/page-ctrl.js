function PageCtrl(http, interval, timeout){
    this.http = http;
    this.interval = interval;
    this.timeout = timeout;
    this.url = window.location.href;
    this.unsaved_changes = false;
    this.changes_buffer = [];
    this.previous_archive = [];
    this.panel_class = 'panel-default';
    this.page_title = '';
    this.last_data = null;
    this.last_update_time = null;
    this.tabs_data = null;
    this.sectors = [];
    this.rounds = [];
    this.data_types = [];
    this.slim = true;
    this.other = null;
}
PageCtrl.prototype.update_buffer = function(obj_id, col, oldVal, newVal, model) {
    var archive_dict = {
        model: model,
        id: obj_id,
        at: col,
        old_value: oldVal
    };
    var present_index = this.check_array_presence(archive_dict, this.previous_archive);
    if (present_index===false){
        this.previous_archive.push(archive_dict);
        var new_update = {model: model, id: obj_id, at: col, new_value: newVal};
        this.changes_buffer.push(new_update);
    }else{
        var buff_index = this.check_array_presence(archive_dict, this.changes_buffer);
        if ($(this.previous_archive[present_index]).attr('old_value') == newVal){
            this.previous_archive.splice(present_index, 1);
            this.changes_buffer.splice(buff_index, 1);
        }else{
            $(this.changes_buffer[buff_index]).attr('new_value', newVal);
        }
    }
};
PageCtrl.prototype.check_array_presence = function(new_up, check_array) {
    var nup = $(new_up);
    for (i=0;i<check_array.length; i++){
        var chg = $(check_array[i]);
        if (chg.attr('model')==nup.attr('model') &&
            chg.attr('id')==nup.attr('id') &&
            chg.attr('at')==nup.attr('at')){
            return i;
        }
    }
    return false;
};
PageCtrl.prototype.get_data = function() {
    var t = this;
    this.http.get(this.url,
        {
            params: {action: 'load_all_elements'}
        }).then(
        function(response){
            t.update_last_data(response.data);
        },
        function(response){
            t.show_failure();
        }
    );
};
PageCtrl.prototype.post_custom_data = function(post_data) {
    var t = this;
    this.http.post(this.url,
            post_data
        ).then(
        function(response){
            t.update_last_data(response.data);
        },
        function(response){
            t.show_failure();
        }
    );
};
PageCtrl.prototype.get_custom_data = function(parametres) {
    var t = this;
    this.http.get(this.url,
        {
            params: parametres
        }).then(
        function(response){
            t.update_last_data(response.data);
        },
        function(response){
            t.show_failure();
        }
    );
};
PageCtrl.prototype.update_last_data = function(data){
    this.last_data = data.elements;
    this.sectors = data.elements.sectors || this.sectors;
    this.rounds = data.elements.rounds || this.rounds;
    this.data_types = data.elements.data_types || this.data_types;
    this.other = data.other || this.other;
    this.last_update_time = data.last_update_time;
};
PageCtrl.prototype.cancel_update = function() {
    this.changes_buffer = [];
    this.request_update();
};
PageCtrl.prototype.submit_changes = function() {
    var t = this;
    this.http.put(this.url, {update_list: this.changes_buffer})
        .then(
            function(response){
                t.cancel_update();
                // t.show_success();

            },
            function(response){
                t.show_failure();
            }
        );
};
PageCtrl.prototype.request_update = function() {
    this.get_data();
    this.show_success();
};
PageCtrl.prototype.watch_changes_buffer = function(newVal, oldVal) {
    if (newVal !== oldVal) {
        if (newVal.length > 0) {
            this.unsaved_changes = true;
        }
        else {
            this.unsaved_changes = false;
            this.previous_archive = [];
        }
    }
};
PageCtrl.prototype.watch_unsaved_changes = function(newVal, oldVal) {
    if (newVal !== oldVal) {
        if (this.unsaved_changes) {
            this.panel_class = 'panel-warning';
        }
        else {
            this.panel_class = 'panel-default';
        }
    }
};
PageCtrl.prototype.post_add_element = function(model){
    var t = this;
    this.http.post(this.url,
        {
            action: 'add_element',
            model: model
        }
    )
    .then(
        function(response){
            t.get_data();
            t.show_success();

        },
        function(response){
            t.show_failure();
        }
    );
};
PageCtrl.prototype.show_success = function() {
    this.temp_color_change('panel-success')
};
PageCtrl.prototype.show_failure = function() {
    this.temp_color_change('panel-danger')
};
PageCtrl.prototype.temp_color_change = function(panel_type) {
    this.panel_class = panel_type;
    var t = this;
    this.timeout(function (){
        t.reset_color();
    }, 3000);
};
PageCtrl.prototype.reset_color = function() {
    if (this.unsaved_changes===false) {
        this.panel_class = 'panel-default';
    }
};
PageCtrl.prototype.count_if_show_tabs = function() {
    return document.getElementsByClassName('TabPill').length > 1;
    // return true;
};
PageCtrl.prototype.toggle_slim = function() {
    this.slim = !this.slim;
};
PageCtrl.prototype.redirect = function(u){
    window.location.href = u;
};

PageCtrl.prototype.get_products_from_round = function(newRound) {
    var t = this;
    this.http.get(this.url,
        {
            params: {action: 'get_products_from_round', round: newRound}

        }).then(
        function(response){
            t.product_choices = response.data.products;
        },
        function(response){
            t.show_failure();
        }
    );
};
