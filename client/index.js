import 'ag-grid-enterprise';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import { Grid } from 'ag-grid-community';

let serverMode;
let sharedSortModel;
let expandedGroupIds = [];

const sharedColumnDefs = [
	{
		field: 'country',
		rowGroup: true,
		hide: true,
	},
	{ field: 'sport' },
	{ field: 'year' },
	{ field: 'gold', aggFunc: 'sum' },
	{ field: 'bronze', aggFunc: 'sum' },
	{ field: 'silver', aggFunc: 'sum' },
];

// side-effects
function toggleGrid() {
	if (serverMode === 'CLIENT') {
		serverMode = 'SERVER';
		const gridOptions = createServerSideGrid(sharedSortModel.api.getSortModel());
		addSharedListeners(gridOptions);
		
		gridOptions.onRowGroupOpened = function (params) {
			if (params.node.expanded) expandedGroupIds.push(params.node.key);
			else expandedGroupIds = expandedGroupIds.filter((grpId) => !grpId.startsWith(params.node.key));
		};

		return;
	}
	if (serverMode === 'SERVER') {
		serverMode = 'CLIENT';
		const gridOptions = createClientSideGrid(sharedSortModel.api.getSortModel());
		addSharedListeners(gridOptions);

		gridOptions.onRowGroupOpened = function (params) {
			if (params.node.expanded) expandedGroupIds.push(params.node.key);
			else expandedGroupIds = expandedGroupIds.filter((grpId) => !grpId.startsWith(params.node.key));
		};

		return;
	}
}

function addSharedListeners(gridOptions) {
	gridOptions.onSortChanged = (currentSortModel) => {
		sharedSortModel = currentSortModel;
	}
	return gridOptions;
}

function createServerSideGrid(sortModel) {
	const gridOptions = {
		rowModelType: 'serverSide',
		defaultColDef: {
			sortable: true,
			resizable: true,
		},
		columnDefs: sharedColumnDefs,
		suppressAggFuncInHeader: true,
		autoGroupColumnDef: {
			cellRenderer: 'agGroupCellRenderer',
			headerName: 'Group',
			field: 'athlete',
		},
		 // supply id from data to the grid
		 getRowNodeId: function(data) {
			return data.id;
		},
	};

	const gridDiv = document.querySelector('#myGrid');

	if (gridDiv.firstChild) gridDiv.firstChild.remove();

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
					const rowsWithIds = addGroupIdsToRows(params.request, response.rows);
					params.successCallback(rowsWithIds, response.lastRow);
					// to preserve group state we expand any previously expanded groups for this block
					rowsWithIds.forEach(function(row) {
						if (expandedGroupIds.indexOf(row.id) > -1) {
							gridOptions.api.getRowNode(row.id).setExpanded(true);
						}
					});
				})
				.catch(error => {
					console.error(error);
					params.failCallback();
				})
		}
	};

	// set sortModel
	gridOptions.api.setSortModel(sortModel);

	// initiate datasource
	gridOptions.api.setServerSideDatasource(datasource);

	return gridOptions;
}


function createClientSideGrid(sortModel) {
	const gridOptions = {
		defaultColDef: { sortable: true },
		columnDefs: sharedColumnDefs,
		autoGroupColumnDef: {
			headerName: 'Group',
			hide: true,
			field: 'athlete',
			cellRenderer: 'agGroupCellRenderer',
			cellRendererParams: { checkbox: true },
		},
		rowSelection: 'multiple',
		groupSelectsChildren: true,
		suppressRowClickSelection: true,
		suppressAggFuncInHeader: true,
	};

	const gridDiv = document.querySelector('#myGrid');

	if (gridDiv.firstChild) gridDiv.firstChild.remove();

	new Grid(gridDiv, gridOptions);

	// set sortModel
	gridOptions.api.setSortModel(sortModel);

	// do http request to get our sample data - not using any framework to keep the example self contained.
	// you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
	const httpRequest = new XMLHttpRequest();
	httpRequest.open(
		'GET',
		'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json'
	);
	httpRequest.send();
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState === 4 && httpRequest.status === 200) {
			const httpResult = JSON.parse(httpRequest.responseText);
			gridOptions.api.setRowData(httpResult);
			gridOptions.api.forEachNode((node)=> {
				if(expandedGroupIds.includes(node.key)) node.setExpanded(true);
			})
		}
	};

	return gridOptions;
}

function addGroupIdsToRows(request, rows) {
  const { groupKeys } = request;
	const rowGroupIds = request.rowGroupCols.map((group) => group.id);
	if (groupKeys.length === rowGroupIds.length) return rows;
	const groupIds = rowGroupIds.slice(0, groupKeys.length + 1);
  return rows.map((row) => addGroupIdToRow(row, groupIds, groupKeys));
}

function addGroupIdToRow(row, groupIds, groupKeys) {
  // id's are created using a simple heuristic based on group keys: i.e. group node ids will
  // be in the following format: 'Russia', 'Russia-2002'
  const groupPart = groupIds
    .map((id) => row[id])
    .join('-');
	
	// account for nested groupings ?
	row.id = groupKeys.length ? groupKeys.join('-') + groupPart : groupPart;

	return row;
}

document.addEventListener('DOMContentLoaded', function () {
	serverMode = 'SERVER'
	document.querySelector('#grid-toggle').addEventListener('click', toggleGrid)
	const gridOptions = createServerSideGrid();
	addSharedListeners(gridOptions);
	gridOptions.onRowGroupOpened = function (params) {
		const id = params.data.id;
		if (params.node.expanded) expandedGroupIds.push(id);
		else expandedGroupIds = expandedGroupIds.filter((grpId) => !grpId.startsWith(id));
	};
});
