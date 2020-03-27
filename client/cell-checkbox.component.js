export class CellCheckbox {
  init(agParams) {    
    // object not created yet...
    if(agParams.context.renderedRows[agParams.node.parent.id]) agParams.context.renderedRows[agParams.node.parent.id].add(agParams.node.id)
    
    if(agParams.context.selectedGroups.has(agParams.node.parent.id)) agParams.context.selectedRows[agParams.node.parent.id].add(agParams.node.id);
    this.checkbox = null;
    this.agParams = agParams;
    this.eGui = document.createElement('span');
    this.eGui.innerHTML = agParams.value ?
      agParams.context.allSelected 
      || agParams.context.selectedGroups.has(agParams.node.parent.id) 
      || agParams.context.selectedRows[agParams.node.parent.id].has(agParams.node.id) ?
        `<input id="checkbox-${agParams.rowIndex}" type="checkbox" name="checkbox" checked> ${agParams.value}` :
        `<input id="checkbox-${agParams.rowIndex}" type="checkbox" name="checkbox"> ${agParams.value}` : '';

    this.eventListener = (evt) => {
      if (evt.target.checked) agParams.context.selectedRows[agParams.node.parent.id].add(agParams.node.id);
      else {
        agParams.context.selectedRows[agParams.node.parent.id].delete(agParams.node.id);
        agParams.context.selectedGroups.delete(agParams.node.parent.id);
        agParams.context.allSelected = false;
      }

      const visibleRows = [];
      const start = agParams.api.getFirstDisplayedRow();
      const end = agParams.api.getLastDisplayedRow();
      for (let i = start; i <= end; i++) visibleRows.push(agParams.api.getDisplayedRowAtIndex(i));
      agParams.api.redrawRows({ rowNodes: visibleRows });
      agParams.api.refreshHeader();
    };

    setTimeout(() => {
      this.checkbox = document.getElementById(`checkbox-${agParams.rowIndex}`);
      if (!this.checkbox) return;
      this.checkbox.addEventListener('change', this.eventListener)
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