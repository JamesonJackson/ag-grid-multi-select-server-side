export class HeaderCheckbox {
  init(agParams) {
    this.checkbox = null;
    const nothingRenderedYet = !agParams.context.renderedGroups.size;
    const allGroupsSelected = agParams.context.renderedGroups.size === agParams.context.selectedGroups.size;
    agParams.context.allSelected = nothingRenderedYet ? false : allGroupsSelected;

    this.agParams = agParams;
    this.eGui = document.createElement('div');
    // this needs to get smarter
    // three states: checked, not checked, indeterminate
    // for the time being we can just reset to empty
    this.eGui.innerHTML = agParams.displayName === 'Group' ?
      agParams.context.allSelected ?
        `<input id="selectAll" type="checkbox" name="checkbox" checked> ${agParams.displayName}` :
        `<input id="selectAll" type="checkbox" name="checkbox" > ${agParams.displayName}` :
          `<div>${agParams.displayName}</div>`;

    this.eventListener = (evt) => {
      agParams.context.allSelected = evt.target.checked

      if (!evt.target.checked) {
        agParams.context.selectedGroups.clear();
      };

      const start = agParams.api.getFirstDisplayedRow();
      const end = agParams.api.getLastDisplayedRow();
      const visibleRows = [];
      for (let i = start; i <= end; i++) visibleRows.push(agParams.api.getDisplayedRowAtIndex(i));
      agParams.api.redrawRows({ rowNodes: visibleRows });
    }

    // this will be taken care of by angular life-cycle hooks
    if (agParams.displayName === 'Group') {
      setTimeout(() => {
        this.checkbox = document.getElementById('selectAll');
        // temp safe-guard
        if (!this.checkbox) return;
        // add change listener
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