export class CellCheckbox {
  // checks if the athlete has been loaded
  init(agParams) {
    this.checkbox = null;
    this.agParams = agParams;
    this.eGui = document.createElement('span');
    this.eGui.innerHTML = agParams.value ?
      agParams.context.allSelected 
      || agParams.context.selectedGroups.has(agParams.node.data[agParams.context.groupedColumn]) 
      || agParams.context.selectedRows.has(`${agParams.value}_${agParams.node.id}`) ?
        `<input id="checkbox-${agParams.rowIndex}" type="checkbox" name="checkbox" checked> ${agParams.value}` :
        `<input id="checkbox-${agParams.rowIndex}" type="checkbox" name="checkbox"> ${agParams.value}` : '';

    this.eventListener = (evt) => {
      if (evt.target.checked) {
        // add them
        agParams.context.selectedRows.add(`${agParams.value}_${agParams.node.id}`)
      } else {
        agParams.context.selectedRows.delete(`${agParams.value}_${agParams.node.id}`)
      }
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
    if (this.checkbox && this.checkbox.removeEventListener) this.checkbox.removeEventListener('change', this.eventListener);
    
  }

}