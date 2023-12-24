import React, { useCallback, useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Product } from '../../types/items/product';
import { Order } from '../../types/items/order';
import { Expense } from '../../types/items/expense';
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity';
import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  TablePagination,
  IconButton,
  TableHead,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
  Box,
  Button
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import CircularProgress from '@mui/material/CircularProgress';
import { Loader } from '..';
import { useMultiSelect } from '../../context/MuliSelectContext';
import { TItems } from '../../types';
import { IButtons } from './ButtonGroup';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

interface HeadCell {
  disablePadding?: boolean;
  label?: string;
  numeric?: boolean;
  getValue?: (params: any) => string;
  buttons?: IButtons[];
}
type TableColumm = Omit<GridColDef, 'type'> & HeadCell;
type SortOrder = 'asc' | 'desc';
type TableOrder = keyof (Product | Order | Expense);
interface IListView {
  rows: (Product | Order | Expense)[];
  columns: TableColumm[];
  initialState?: GridInitialStateCommunity;
  loading?: boolean;
  checkboxSelection?: boolean;
  headerButtons?: React.ReactNode;
  apiAction: Function;
  pageSizeOptions?: number[];
  title: string;
  actionCell?: TableColumm;
}
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: TableOrder) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: SortOrder;
  orderBy: TableOrder;
  rowCount: number;
  headCells: TableColumm[];
  hasHeader?: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, hasHeader } = props;
  const createSortHandler = (property: TableOrder) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts'
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.field}
            align={headCell?.align ? 'left' : headCell.align}
            padding={headCell?.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.field ? order : false}
          >
            {headCell?.buttons ? (
              headCell.headerName
            ) : (
              <TableSortLabel
                active={orderBy === headCell.field}
                direction={orderBy === headCell.field ? order : 'asc'}
                onClick={createSortHandler(headCell.field as TableOrder)}
              >
                {headCell.headerName}
                {orderBy === headCell.field ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  title?: string;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, title } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          {title}
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export const ListView = ({
  columns,
  initialState = {
    pagination: {
      paginationModel: { page: 0, pageSize: 5 }
    },
    sorting: {
      sortModel: [{ field: 'updatedAt', sort: 'desc' }]
    }
  },
  checkboxSelection = false,
  loading = false,
  headerButtons,
  apiAction,
  pageSizeOptions = [10, 50],
  rows,
  title,
  actionCell
}: IListView) => {
  const executeApiAction = useCallback(async () => {
    await apiAction();
  }, [apiAction]);

  useEffect(() => {
    apiAction();
  }, [apiAction]);
  const [order, setOrder] = React.useState<SortOrder>('asc');
  const [orderBy, setOrderBy] = React.useState<TableOrder>('updatedAt');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const { selected, setSelected } = useMultiSelect();

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: TableOrder) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(rows);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: any) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: TItems[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: any) => selected.findIndex((value) => value.id === id) !== -1;

  function getComparator<Key extends keyof any>(
    order: SortOrder,
    orderBy: Key
  ): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <div style={{ height: '100%', width: '100' }}>
      {headerButtons}

      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          {/* <EnhancedTableToolbar numSelected={selected.length} title={title} /> */}
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
              <EnhancedTableHead
                numSelected={selected.length}
                //@ts-ignore
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                headCells={actionCell ? [...columns, actionCell] : columns}
                hasHeader={(actionCell?.buttons || []).length > 0}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow tabIndex={-1} key={row.id} selected={isItemSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(event) => handleClick(event, row)}
                          inputProps={{
                            'aria-labelledby': labelId
                          }}
                        />
                      </TableCell>

                      {columns.map((value, index) => (
                        <TableCell
                          id={`${row.id}-${value.field}`}
                          key={index.toString()}
                          align={value.align ? 'left' : value.align}
                          width={value.width}
                        >
                          {value?.getValue ? value.getValue(row) : row[value.field as keyof typeof row]}
                        </TableCell>
                      ))}
                      <TableCell id={`actions`}>
                        {actionCell?.buttons?.map((value, index) => (
                          <Button key={`header-button-${index}`} id={row.id} endIcon={value.icon} disableElevation {...value.rest}>
                            {value.title}
                          </Button>
                        ))}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      {loading && <Loader />}
    </div>
  );
};
