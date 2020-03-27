export class GroupCheckbox {
  init(agParams) {
    // ON INITIAL LOAD
    // Create rendered  data structure on the fly
    agParams.context.renderedGroups.add(agParams.node.id);
    // set up data structure
    if(!agParams.context.selectedRows[agParams.node.id]) agParams.context.selectedRows[agParams.node.id] = new Set();
    if(!agParams.context.renderedRows[agParams.node.id]) agParams.context.renderedRows[agParams.node.id] = new Set();
    // Create selected if 'all' checked
    // We need to update these data structure before setting the innerHTML
    if(agParams.context.allSelected) agParams.context.selectedGroups.add(agParams.node.id);
    // init some props
    this.checkbox = null;
    this.agParams = agParams;
    this.eGui = document.createElement('span');

    this.eGui.innerHTML = agParams.value ?
      agParams.context.selectedGroups.has(agParams.node.id) || ( agParams.context.renderedRows[agParams.node.id].size&& agParams.context.selectedRows[agParams.node.id].size === agParams.context.renderedRows[agParams.node.id].size)  ?
        `<input id="${agParams.node.id}" type="checkbox" name="checkbox" checked> ${agParams.value}` :
        `<input id="${agParams.node.id}" type="checkbox" name="checkbox"> ${agParams.value}` : '';

    this.eventListener = (evt) => {
      if (evt.target.checked) {
        agParams.context.selectedGroups.add(agParams.node.id);
      } else {
        agParams.context.selectedGroups.delete(agParams.node.id);
        agParams.context.allSelected = false;
        // we will likely have to change our data structure here
        agParams.context.selectedRows[agParams.node.id].clear()
      }

      const start = agParams.api.getFirstDisplayedRow();
      const end = agParams.api.getLastDisplayedRow();
      const visibleRows = [];
      for (let i = start; i <= end; i++) visibleRows.push(agParams.api.getDisplayedRowAtIndex(i));
      agParams.api.redrawRows({ rowNodes: visibleRows });
      agParams.api.refreshHeader();
    }

    setTimeout(() => {
      this.checkbox = document.getElementById(`${agParams.node.id}`);
      if (!this.checkbox) return;
      this.checkbox.addEventListener('change', this.eventListener);
    }, 0);
  }

  refresh() {
    return true;
  }

  getGui() {
    return this.eGui;
  };

  destroy() {
    if (this.checkbox && this.checkbox.removeEventListener) {
      this.checkbox.removeEventListener('change', this.eventListener);
    }
  }

}