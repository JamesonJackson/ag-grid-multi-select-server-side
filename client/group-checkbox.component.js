export class GroupCheckbox {
  init(agParams) {    
    
    this.eGui = document.createElement('span');
    
    // Is the header state 'CHECKED: C' - then set checkbox/selected
    if (agParams.context.headerState === 'C') {
      agParams.context.groupState[agParams.node.id] = 'C';
      agParams.context.selectedGroups.add(agParams.node.id);
    }
    
    // Is it 'UNCHECKED: U'
    // This is tricky
    // Without this logic you can not update the group selection if the headerState is 'U'
    if (agParams.context.headerState === 'U') {
      agParams.context.selectedGroups.has(agParams.node.id) ? agParams.context.groupState[agParams.node.id] = 'C' : agParams.context.groupState[agParams.node.id] = 'U'
    }
   
    // Is it 'INDETERMINATE: I' - then check rendered; if already rendered, then use the current groupState, otherwise it is 'CHECKED'
    if (agParams.context.headerState === 'I') {
      if (!agParams.context.renderedGroups.has(agParams.node.id)) agParams.context.groupState[agParams.node.id] = 'C';
    }

    this.eGui.innerHTML = agParams.value ?
      agParams.context.groupState[agParams.node.id]  === 'C'  ?
        `<input id="${agParams.node.id}" type="checkbox" name="checkbox" checked> ${agParams.value}` :
        `<input id="${agParams.node.id}" type="checkbox" name="checkbox"> ${agParams.value}` : '';

    // After setting the HTML, consider the group rendered
    // This is key when handling the indeterminate states
    agParams.context.renderedGroups.add(agParams.node.id);

    this.eventListener = (evt) => {
      // Change group state... based on this state and the one above it
      if (evt.target.checked) {
        agParams.context.selectedGroups.add(agParams.node.id);
        agParams.context.groupState[agParams.node.id] = 'C';
      }
      else {
        agParams.context.groupState[agParams.node.id] = 'U';
        if(agParams.context.selectedRows[agParams.node.id]) agParams.context.selectedRows[agParams.node.id].clear();

        // eh
        agParams.context.selectedGroups.delete(agParams.node.id);
        
        if(agParams.context.renderedRows[agParams.node.id]) agParams.context.renderedRows[agParams.node.id].clear();

        // Is the header going to be changed to indeterminate? ONLY if it is currently  ☑️
        if (agParams.context.headerState === 'C') agParams.context.headerState = 'I'
      }
      // REDRAW
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