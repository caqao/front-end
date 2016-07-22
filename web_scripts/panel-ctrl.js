function PanelCtrl(rootscope, scope, http, interval, timeout){
    this.root_scope = rootscope;
    this.scope = scope;
    this.http = http; //TODO
    this.interval = interval;
    this.timeout = timeout;
    this.unsaved_changes = false;
    this.changes_buffer = [];
    this.previous_archive = [];
    this.panel_class = 'panel-default';
}

PanelCtrl.prototype.add_element = function(){
    this.scope.g.post_add_element(this.scope.object_type);
    // var t = this;
    // this.http.post(this.scope.url+'/',
    //     {
    //         action: 'add_element',
    //         panel_id: this.scope.panel_id
    //     }
    // )
    //     .then(
    //         function(response){
    //             t.get_data();
    //             t.show_success();
    //
    //         },
    //         function(response){
    //             t.show_failure();
    //         }
    //     );
};
PanelCtrl.prototype.valid_change = function(oldVal, newVal, object, col){ //OK
    if (newVal==undefined){
        $(object).attr(col, oldVal);
    }
    else{
        this.scope.g.update_buffer($(object).attr('id'), col, oldVal, newVal, this.scope.object_type);
    }
};
PanelCtrl.prototype.redirect_page = function(id){ //OK
    window.location.href=this.scope.redirect_wrapper[0]+id.toString()+this.scope.redirect_wrapper[1];
};