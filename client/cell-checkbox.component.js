export class CellCheckbox {
  init(agParams) {
    
    if(agParams.context.selectedGroups.has(agParams.node.parent.id)) agParams.context.selectedRows.add(agParams.node.id);

    this.checkbox = null;
    this.agParams = agParams;
    this.eGui = document.createElement('span');
    
    this.eGui.innerHTML = agParams.value ?
      agParams.context.allSelected 
      || agParams.context.selectedGroups.has(agParams.node.parent.id) 
      || agParams.context.selectedRows.has(`${agParams.node.id}`) ?
        `<input id="checkbox-${agParams.rowIndex}" type="checkbox" name="checkbox" checked> ${agParams.value}` :
        `<input id="checkbox-${agParams.rowIndex}" type="checkbox" name="checkbox"> ${agParams.value}` : '';

    this.eventListener = (evt) => {
      if (evt.target.checked) agParams.context.selectedRows.add(`${agParams.node.id}`);
      else {
        // setting this manually until group-checkbox compares the renderes and selected rows
        agParams.context.selectedGroups.delete(`${agParams.node.parent.id}`)
        agParams.context.selectedRows.delete(`${agParams.node.id}`);
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

    console.log(agParams.context.selectedRows);
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