function PanelCtrl(scope, http, interval, timeout){
    this.scope = scope;
    this.http = http; //TODO
    this.interval = interval;
    this.timeout = timeout;
    this.unsaved_changes = false;
    this.changes_buffer = [];
    this.previous_archive = [];
    this.panel_class = 'panel-default';
}
PanelCtrl.prototype.update_panel_data = function (new_values) {
    this.scope.values = new_values.values_list_list[this.scope.page_number];
    this.scope.columns = new_values.columns_list_list[this.scope.page_number];
};
PanelCtrl.prototype.add_element = function(){
    this.scope.g.post_add_element(this.scope.object_type);
};
PanelCtrl.prototype.valid_change = function(oldVal, newVal, object, col){
    if (newVal==undefined || (typeof newVal === 'number' && newVal < 0)){
        $(object).attr(col, oldVal);
    }
    else if (col==='notes'){
        alert('aasdsdf s')
    }
    else{
        this.scope.g.update_buffer($(object).attr('id'), col, oldVal, newVal, this.scope.object_type);
    }
};
PanelCtrl.prototype.valid_notes_change = function(oldValue, newDisplay, object){
    console.log('change');
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

function NavCtrl(http) {
    this.http = http;
    this.navs = null;
    this.url = window.location.href;

}
NavCtrl.prototype.get_navs = function() {
    var t = this;
    this.http.get(this.url,
        {
            params: {action: 'load_navs'}
        }).then(
        function(response){
            t.set_navs(response.data.navs);
        },
        function(response){
            alert('failure')
        }
    );
};
NavCtrl.prototype.set_navs = function (navsDict) {
    this.navs = navsDict;
};
