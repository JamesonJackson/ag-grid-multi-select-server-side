export class GroupCheckbox {

  init(agParams) {
    this.checkbox = null;
    this.agParams = agParams;
    this.eGui = document.createElement('span');

    const rowGroupField = agParams.node.field;
    const group = agParams.node.data[rowGroupField]

    // on init if all are selected, put this group on the set, otherwise we will toggle them manually with the checkbox
    if (agParams.context.allSelected) {
      agParams.context.groupedColumn = rowGroupField;
      agParams.context.selectedGroups.add(group);
      // add the students for this group...
    } else {
      // ?
    }

    this.eGui.innerHTML = agParams.value ?
      agParams.context.selectedGroups.has(agParams.node.data[agParams.context.groupedColumn]) ?
        `<input id="checkbox-${agParams.rowIndex}" type="checkbox" name="checkbox" checked> ${agParams.value}` :
        `<input id="checkbox-${agParams.rowIndex}" type="checkbox" name="checkbox"> ${agParams.value}` : '';

    this.eventListener = (evt) => {
      if (evt.target.checked) agParams.context.selectedGroups.add(group);
      else agParams.context.selectedGroups.delete(group);
      
      const start = agParams.api.getFirstDisplayedRow();
      const end = agParams.api.getLastDisplayedRow();
      const visibleRows = [];
      
      for (let i = start; i <= end; i++) visibleRows.push(agParams.api.getDisplayedRowAtIndex(i));
      agParams.api.redrawRows({ rowNodes: visibleRows });
    }

    setTimeout(() => {
      this.checkbox = document.getElementById(`checkbox-${agParams.rowIndex}`);
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