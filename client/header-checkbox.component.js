export class HeaderCheckbox {
  init(agParams) {
    this.checkbox = null;
    this.agParams = agParams;
    this.eGui = document.createElement('div');

    // this needs to get smarter
    // three states: checked, not checked, indeterminate
    // for the time being we can just reset to empty
    this.eGui.innerHTML = agParams.displayName === 'Group' ?
      `<input id="selectAll" type="checkbox" name="checkbox"> ${agParams.displayName}` :
      `<div>${agParams.displayName}</div>`;

    // this will be taken care of by angular life-cycle hooks
    setTimeout(()=> {
      this.checkbox = document.getElementById('selectAll');
      // temp safe-guard
      if (!this.checkbox) return;
      // add change listener
      this.checkbox.addEventListener('change', e => {
        
        agParams.context.allSelected = e.target.checked
        
        if(!e.target.checked) agParams.context.selectedGroups.clear();
        
        // get visible rows
        const start = agParams.api.getFirstDisplayedRow();
        const end = agParams.api.getLastDisplayedRow();
        
        const visibleRows = [];
        for (let i = start; i <= end; i++) visibleRows.push(agParams.api.getDisplayedRowAtIndex(i));
        
        // redraw only the rows that are currently visible, then let the cell render take care of the rest while scrolling
        agParams.api.redrawRows({ rowNodes: visibleRows });
      });
    }, 0);
  }

  getGui() {
    return this.eGui;
  };

  destroy() {
    //todo: remove evt listener 
  }

  refresh() {
    return true;
  }

}