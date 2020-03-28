export class HeaderCheckbox {
  init(agParams) {
    
    this.eGui = document.createElement('div');

    this.eGui.innerHTML = agParams.displayName === 'Group' ?
      agParams.context.headerState === 'C' ?
        `<input id="selectAll" type="checkbox" name="checkbox" checked> ${agParams.displayName}` :
        `<input id="selectAll" type="checkbox" name="checkbox" > ${agParams.displayName}` :
          `<div>${agParams.displayName}</div>`;

    this.eventListener = (evt) => { 
      if (evt.target.checked) agParams.context.headerState = 'C';
      else {
        agParams.context.headerState = 'U';
        agParams.context.selectedGroups.clear();
        agParams.context.renderedGroups.clear();
        agParams.context.selectedRows = { };
      }
          
      // REDRAW
      const start = agParams.api.getFirstDisplayedRow();
      const end = agParams.api.getLastDisplayedRow();
      const visibleRows = [];
      for (let i = start; i <= end; i++) visibleRows.push(agParams.api.getDisplayedRowAtIndex(i));
      agParams.api.redrawRows({ rowNodes: visibleRows });
    }

    if (agParams.displayName === 'Group') {
      setTimeout(() => {
        this.checkbox = document.getElementById('selectAll');
        if (!this.checkbox) return;
        this.checkbox.addEventListener('change', this.eventListener);
      }, 0);
    }
  }

  getGui() {
    return this.eGui;
  };

  destroy() {
    if (this.checkbox && this.checkbox.removeEventListener) {
      this.checkbox.removeEventListener('change', this.eventListener);
    }
  }

  refresh() {
    return true;
  }

}