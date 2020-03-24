import { Grid } from 'ag-grid-community';
import { HeaderCheckbox } from './header-checkbox.component';
import 'ag-grid-enterprise';

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

const gridOptions = {
	allSelected: false,
	// replace the header with our own custom header
	components: { agColumnHeader: HeaderCheckbox },
	rowModelType: 'serverSide',
	columnDefs: [
		{ field: 'athlete', checkboxSelection: true, },
		{
			field: 'country',
			// rowGroup: true, 
			// hide: true
		},
		{ field: 'sport' },
		{ field: 'year', filter: 'number', filterParams: { newRowsAction: 'keep' } },
		{ field: 'gold', aggFunc: 'sum' },
		{ field: 'silver', aggFunc: 'sum' },
		{ field: 'bronze', aggFunc: 'sum' },
	],
	defaultColDef: { sortable: true },

	// debug: true,
	// cacheBlockSize: 20,
	// maxBlocksInCache: 3,
	// purgeClosedRowNodes: true,
	// maxConcurrentDatasourceRequests: 2,
	// blockLoadDebounceMillis: 1000
};

const gridDiv = document.querySelector('#myGrid');
new Grid(gridDiv, gridOptions);

const datasource = {
	getRows(params) {
		fetch('./olympicWinners/', {
			method: 'post',
			body: JSON.stringify(params.request),
			headers: { "Content-Type": "application/json; charset=utf-8" }
		})
			.then(httpResponse => httpResponse.json())
			.then(response => {
				params.successCallback(response.rows, response.lastRow);
				if(gridOptions.allSelected) gridOptions.api.forEachNode((node) => gridOptions.api.getRowNode(node.id).selectThisNode(true))
			})
			.catch(error => {
				console.error(error);
				params.failCallback();
			})
	}
};

gridOptions.api.setServerSideDatasource(datasource);