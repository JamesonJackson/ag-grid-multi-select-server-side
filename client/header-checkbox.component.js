export class HeaderCheckbox {
  
  init(agParams) {
    this.agParams = agParams;
    
    this.eGui = document.createElement('div');

    this.eGui.innerHTML = agParams.column.colDef.checkboxSelection ? 
      `<input id="selectAll" type="checkbox" name="checkbox"> ${agParams.displayName}` : 
        `<div>${agParams.displayName}</div>`; 

    document.addEventListener("DOMContentLoaded", function (event) {
      const checkbox = document.getElementById('selectAll');
      checkbox.addEventListener('change', e => {
        agParams.api.gridOptionsWrapper.gridOptions.allSelected = e.target.checked;
        // get all studentId with based on the loaded filter/sort models and set those ids in the batchActionSelectedStudents
        if(e.target.checked) agParams.api.forEachNode((row)=> agParams.api.getRowNode(row.id).selectThisNode(true));
        else agParams.api.forEachNode((row)=> agParams.api.getRowNode(row.id).selectThisNode(false));
      });
  });

  }

  getGui() {
    return this.eGui;
  };

  destroy() {
    //noop for now
  }

  // add additional methods to handle the functionality
}