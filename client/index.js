import 'ag-grid-enterprise';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import { Grid } from 'ag-grid-community';

let serverMode;

function toggleGrid() {
	if(serverMode === 'CLIENT') {
		serverMode = 'SERVER'
		createServerSideGrid();
		return 
	}
	if(serverMode === 'SERVER') {
		serverMode = 'CLIENT'
		createClientSideGrid()
		return
	}
}

function createServerSideGrid() {
	const gridOptions = {
		rowModelType: 'serverSide',
		columnDefs: [
			{ 
				field: 'athlete', 
				hide: true
			},
			{
				field: 'country',
				rowGroup: true, 
				hide: true
			},
			{ field: 'sport' },
			{ field: 'year', filter: 'number' },
			{ field: 'gold', aggFunc: 'sum' },
			{ field: 'silver', aggFunc: 'sum' },
			{ field: 'bronze', aggFunc: 'sum' },
		],
		suppressAggFuncInHeader: true,
		autoGroupColumnDef: {
			cellRenderer:'agGroupCellRenderer',
			headerName: 'Athlete'
		}
	};

	const gridDiv = document.querySelector('#myGrid');
	
	if(gridDiv.firstChild) gridDiv.firstChild.remove();

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
}

function createClientSideGrid() {
	const gridOptions = {
		columnDefs: [
			{ field: 'country', rowGroup: true, hide: true },
			{ field: 'sport'},
			{ field: 'year', },
			{ field: 'gold', aggFunc: 'sum' },
			{ field: 'bronze', aggFunc: 'sum' },
			{ field: 'silver', aggFunc: 'sum' },
		],
		defaultColDef: {
			flex: 1,
			minWidth: 100,
		},
		autoGroupColumnDef: {
			headerName: 'Athlete',
			hide: true,
			field: 'athlete',
			cellRenderer: 'agGroupCellRenderer',
			cellRendererParams: {
				checkbox: true,
			},
		},
		rowSelection: 'multiple',
		groupSelectsChildren: true,
		suppressRowClickSelection: true,
		suppressAggFuncInHeader: true,
	};
	
		const gridDiv = document.querySelector('#myGrid');

		if(gridDiv.firstChild) gridDiv.firstChild.remove();
		
		new Grid(gridDiv, gridOptions);
	
		// do http request to get our sample data - not using any framework to keep the example self contained.
		// you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
		var httpRequest = new XMLHttpRequest();
		httpRequest.open(
			'GET',
			'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json'
		);
		httpRequest.send();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4 && httpRequest.status === 200) {
				var httpResult = JSON.parse(httpRequest.responseText);
				gridOptions.api.setRowData(httpResult);
			}
		};
}

document.addEventListener('DOMContentLoaded', function() { 
	serverMode = 'SERVER'
	document.querySelector('#grid-toggle').addEventListener('click', toggleGrid)
	createServerSideGrid();
});
