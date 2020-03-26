import 'ag-grid-enterprise';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { Grid } from 'ag-grid-community';
import { HeaderCheckbox } from './header-checkbox.component';
import { CellCheckbox } from './cell-checkbox.component';
import { GroupCheckbox } from './group-checkbox.component';

const gridOptions = {
	rowModelType: 'serverSide',
	rowSelection: 'multiple',
	animateRows: false,
	suppressChangeDetection:true,
	// ctx available to all cell renderers
	context:{
		groupedColumn: 'country',
		allSelected: false,
		selectedGroups: new Set(),
		selectedRows: new Set(),
	},
	components: { 
		agColumnHeader: HeaderCheckbox,
		'cellCheckboxRenderer': CellCheckbox,
	},
	columnDefs: [
		{ 
			field: 'athlete', 
			cellRenderer: 'cellCheckboxRenderer',
		},
		{
			field: 'country',
			rowGroup: true, 
			hide: true
		},
		{ field: 'sport' },
		{ field: 'year', filter: 'number', filterParams: { newRowsAction: 'keep' } },
		{ field: 'gold', aggFunc: 'sum' },
		{ field: 'silver', aggFunc: 'sum' },
		{ field: 'bronze', aggFunc: 'sum' },
	],
	autoGroupColumnDef: {
		groupSelectsChildren: true,
		cellRenderer:'agGroupCellRenderer',
    cellRendererParams: {
			innerRenderer: GroupCheckbox,
    },
	}
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
			.then(response => params.successCallback(response.rows, response.lastRow))
			.catch(error => {
				console.error(error);
				params.failCallback();
			})
	}
};

gridOptions.api.setServerSideDatasource(datasource);