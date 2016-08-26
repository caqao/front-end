function PanelCtrl(scope, interval, timeout){
    this.scope = scope;
    this.interval = interval;
    this.timeout = timeout;
    this.unsaved_changes = false;
    this.changes_buffer = [];
    this.previous_archive = [];
    this.panel_class = 'panel-default';
    this.loaded = false;
    this.show_alert = false;
    this.collapsed = [];
    this.success_message = false;
    this.error_message = false;
}
PanelCtrl.prototype.add_collapse = function () {
  this.collapsed.push(true);
};
PanelCtrl.prototype.update_panel_data = function (new_values) {
    var tab_values = new_values.values_list_list[this.scope.page_number];
    if (this.scope.values_index !== undefined){
        this.scope.values = tab_values[this.scope.values_index]
    }
    else{
        this.scope.values = tab_values;
    }
    if (new_values.columns_list_list !== undefined) {
        this.scope.columns = new_values.columns_list_list[this.scope.page_number];
    }
    this.loaded = true;
};
PanelCtrl.prototype.add_element = function(){
    this.scope.g.post_add_element(this.scope.object_type);
};
PanelCtrl.prototype.valid_change = function(oldVal, newVal, object, col){
    if (newVal==undefined || (typeof newVal === 'number' && newVal < 0 && (col == 'nb_meas' || col == 'interval_days' ))){
        $(object).attr(col, oldVal);
    }
    else{
        this.scope.g.update_buffer($(object).attr('id'), col, oldVal, newVal, this.scope.object_type);
    }
};
PanelCtrl.prototype.valid_min_change = function(oldVal, newVal, object, col){
    if (newVal>$(object).attr(col.replace('in', 'ax'))){
        newVal = undefined;
    }
    this.valid_change(oldVal, newVal, object, col);
};
PanelCtrl.prototype.valid_max_change = function(oldVal, newVal, object, col){
    if (newVal<$(object).attr(col.replace('ax', 'in'))){
        newVal = undefined;
    }
        this.valid_change(oldVal, newVal, object, col);
};
PanelCtrl.prototype.valid_notes_change = function(oldValue, newDisplay, object){
    if (newDisplay==undefined){
        $(object).attr('display', this.to_display(oldValue));
        $(object).attr('notes', oldValue);
    }
    else {
        this.scope.g.update_buffer(
            $(object).attr('id'), 'notes', oldValue, this.to_note(newDisplay), this.scope.object_type);
    }
};
PanelCtrl.prototype.to_display = function(s){
    return s.replace('/n', '\n').replace('/t', '\t');
};
PanelCtrl.prototype.to_note = function(s){
    return s.replace('\n', '/n').replace('\t', '/t');
};
PanelCtrl.prototype.redirect_page = function(id){
    window.location.href=this.scope.redirect_wrapper[0]+id.toString()+this.scope.redirect_wrapper[1];
};
PanelCtrl.prototype.update_default_scope_data = function(newVal){
    if (newVal !== null) {
        this.update_panel_data(newVal);
    }
};
PanelCtrl.prototype.toggle_info = function() {
    this.show_alert = !this.show_alert;
};
PanelCtrl.prototype.toggle_collapse = function(index) {
    this.show_alert = false;
    this.collapsed[index] = !this.collapsed[index];
};
PanelCtrl.prototype.show_success = function(message) {
    this.error_message = false;
    this.success_message = message;
};
PanelCtrl.prototype.show_error = function(message) {
    this.success_message = false;
    this.error_message = message;
};

PanelCtrl.prototype.update_delay_data = function(i, time, interval_hrs){
    if (interval_hrs == 0){
        this.scope.values[i].panel_class = "panel-default";
    }
    else {
        if (this.scope.values[i].prev_data.length < this.scope.values[i].nb_meas) {
            this.scope.values[i].next_deadline = time;
            this.scope.values[i].panel_class = "panel-info";
            this.scope.values[i].delay_message = null;
        }
        else {
            var last_time = this.scope.values[i].prev_data[this.scope.values[i].prev_data.length - this.scope.values[i].nb_meas].time;
            this.scope.values[i].next_deadline = last_time * 1000 + interval_hrs * 3600000;
            var remaining_time = this.scope.values[i].next_deadline - time;
            if (remaining_time < 0) {
                this.scope.values[i].panel_class = "panel-danger";
                this.scope.values[i].delay_message = "Retard!";
            }
            else {
                if (remaining_time < 900000) {
                    this.scope.values[i].panel_class = "panel-warning";
                    this.scope.values[i].delay_message = "Bientôt!";
                }
                else {
                    this.scope.values[i].panel_class = "panel-success";
                    this.scope.values[i].delay_message = null;
                }
            }
        }
    }
};
PanelCtrl.prototype.update_all_delays = function(intervals){
    var d = new Date();
    for (var i=0;i<this.scope.values.length;i++) {
        this.update_delay_data(i, d, intervals[0] || intervals);
    }
};
PanelCtrl.prototype.toggle_show_results = function (i) {
    if (this.scope.show_results[i]===null){
        this.scope.create_plot(i);
    }
    this.scope.show_results[i] = !this.scope.show_results[i];
};
PanelCtrl.prototype.temporary_hide = function(i){
    var t = this;
    this.timeout(function (){
        t.scope.create_plot(i);
        t.scope.show_results[i] = true;
    }, 10);
};
PanelCtrl.prototype.toggle_comment = function(i){
    if (this.scope.values[i].comment === undefined){
        this.scope.values[i].comment = '';
    }
    else{
        delete this.scope.values[i].comment;
    }
};