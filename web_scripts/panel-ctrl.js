function PanelCtrl(scope, http, interval, timeout){
    this.scope = scope;
    this.http = http;
    this.interval = interval;
    this.timeout = timeout;
    this.unsaved_changes = false;
    this.changes_buffer = [];
    this.previous_archive = [];
    this.panel_class = 'panel-default';
}
PanelCtrl.prototype.show_success = function() {
    this.temp_color_change('panel-success')
};
PanelCtrl.prototype.show_failure = function() {
    this.temp_color_change('panel-danger')
};
PanelCtrl.prototype.temp_color_change = function(panel_type) {
    this.panel_class = panel_type;
    var t = this;
    this.timeout(function (){
        t.reset_color();
    }, 3000);
};
PanelCtrl.prototype.reset_color = function() {
    if (this.unsaved_changes===false) {
        this.panel_class = 'panel-default';
    }
};
PanelCtrl.prototype.add_element = function(){
    var t = this;
    this.http.post(this.scope.url+'/',
        {
            action: 'add_element',
            panel_id: this.scope.panel_id
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
PanelCtrl.prototype.update_buffer = function(obj_id, col, oldVal, newVal) {
    var archive_dict = {
        model: this.scope.object_type,
        id: obj_id,
        at: col,
        old_value: oldVal
    };
    var present_index = this.check_array_presence(archive_dict, this.previous_archive);
    if (present_index===false){
        this.previous_archive.push(archive_dict);
        var new_update = {model: this.scope.object_type, id: obj_id, at: col, new_value: newVal};
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
PanelCtrl.prototype.check_array_presence = function(new_up, check_array) {
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
PanelCtrl.prototype.get_data = function() {
    var s = this.scope;
    this.http.get(s.url,
        {
            params: {action: 'load_panel_elements', panel_id: this.scope.panel_id}
        }).then(
        function(response){
            s.assign_values(response);
        },
        function(response){
            alert('failed');
        }
    );
};
PanelCtrl.prototype.valid_change = function(oldVal, newVal, object, col){
    if (newVal==undefined){
        $(object).attr(col, oldVal);
    }
    else{
        this.update_buffer($(object).attr('id'), col, oldVal, newVal);
    }
};
PanelCtrl.prototype.cancel_update = function() {
    this.changes_buffer = [];
    this.request_update();
};
PanelCtrl.prototype.submit_changes = function() {
    var t = this;
    this.http.put(this.scope.url+'/', {update_list: this.changes_buffer})
        .then(
            function(response){
                t.cancel_update();
                t.show_success();

            },
            function(response){
                t.show_failure();

            }
        );
};
PanelCtrl.prototype.request_update = function() {
    this.show_success();
    this.get_data();
};
PanelCtrl.prototype.watch_changes_buffer = function(newVal, oldVal) {
    if (newVal !== oldVal) {
        if (newVal.length > 0) {
            this.unsaved_changes = true;
        }
        else {
            this.unsaved_changes = false;
            this.unsaved_changes = false;
            this.previous_archive = [];
        }
    }
};
PanelCtrl.prototype.watch_unsaved_changes = function(newVal, oldVal) {
    if (newVal !== oldVal) {
        if (this.unsaved_changes) {
            this.panel_class = 'panel-warning';
        }
        else {
            this.panel_class = 'panel-default';
        }
    }
};
PanelCtrl.prototype.redirect_page = function(id){
    window.location.href=this.scope.redirect_wrapper[0]+id.toString()+this.scope.redirect_wrapper[1];
};