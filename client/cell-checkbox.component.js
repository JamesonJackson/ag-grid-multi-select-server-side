export class CellCheckbox {
  init(agParams) { 
    
    // Set up selected row object for group
    if(agParams.node.parent.id && !agParams.context.selectedRows[agParams.node.parent.id]) agParams.context.selectedRows[agParams.node.parent.id] = new Set();
    // Set up rendered rows object 
    if(agParams.node.parent.id && !agParams.context.renderedRows[agParams.node.parent.id]) agParams.context.renderedRows[agParams.node.parent.id] = new Set();
    
    // Is the header state 'CHECKED' - then set checkbox/selected
    if (agParams.context.groupState[agParams.node.parent.id] === 'C') agParams.context.selectedRows[agParams.node.parent.id].add(agParams.node.id);
    
    // Is it indeterminate - then check rendered; if already rendered, then use the current groupState, otherwise it is 'CHECKED'
    if (agParams.context.groupState[agParams.node.parent.id]  === 'I') {
      if (!agParams.context.renderedRows[agParams.node.parent.id].has(agParams.node.id)) agParams.context.selectedRows[agParams.node.parent.id].add(agParams.node.id);
    }

    this.eGui = document.createElement('span');
    this.eGui.innerHTML = agParams.value ?
          agParams.context.selectedRows[agParams.node.parent.id].has(agParams.node.id) ?
            `<input id="checkbox-${agParams.rowIndex}" type="checkbox" name="checkbox" checked> ${agParams.value}` :
              `<input id="checkbox-${agParams.rowIndex}" type="checkbox" name="checkbox"> ${agParams.value}` : '';

    if(agParams.context.renderedRows[agParams.node.parent.id]) 
      agParams.context.renderedRows[agParams.node.parent.id].add(agParams.node.id);

    this.eventListener = (evt) => {
      if (evt.target.checked) {
        agParams.context.selectedRows[agParams.node.parent.id].add(agParams.node.id);
        agParams.context.groupState[agParams.node.parent.id] = 'I'
      }
      else {
        agParams.context.selectedRows[agParams.node.parent.id].delete(agParams.node.id);
        agParams.context.groupState[agParams.node.parent.id] = 'I'
        agParams.context.headerState = 'I'
      }

      // REDRAW
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