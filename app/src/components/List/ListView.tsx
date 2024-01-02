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
  Button,
  TextField,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import { MenuItem, Select } from '@mui/material';

import { visuallyHidden } from '@mui/utils';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Loader } from '..';
import { useMultiSelect } from '../../context/MuliSelectContext';
import { ITEMS, TItems } from '../../types';
import { IButtons } from './ButtonGroup';
import { FaSearch } from 'react-icons/fa';
import { TQueryParams } from '../../service/controllers';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

interface HeadCell<T extends TItems> {
  disablePadding?: boolean;
  label?: string;
  numeric?: boolean;
  getValue?: (params: T) => string;
  buttons?: IButtons[];
  field: keyof T;
}
type TableColumn<T extends Product | Order | Expense> = Omit<Omit<GridColDef, 'type'>, 'field'> & HeadCell<T>;
type SortOrder = 'asc' | 'desc';
type TableOrder = keyof (Product | Order | Expense);
interface IListView<T extends Product | Order | Expense> {
  rows: T[];
  columns: TableColumn<T>[];
  initialState?: GridInitialStateCommunity;
  loading?: boolean;
  checkboxSelection?: boolean;
  headerButtons?: React.ReactNode;
  startPolling: Function;
  stopPolling: Function;
  pageSizeOptions?: number[];
  title: string;
  actionCell?: Omit<TableColumn<T>, 'field'> & {
    field: string;
  };
  updateApiFilter: (params: TQueryParams) => Promise<void>;
}
interface LayoutTableProps<T extends TItems> {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: SortOrder;
  orderBy: keyof T;
  rowCount: number;
  headCells: TableColumn<T>[];
  hasHeader?: boolean;
}

function LayoutTableHead<T extends TItems>(props: LayoutTableProps<T>) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, hasHeader } = props;
  const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
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
            key={headCell.field as string}
            align={headCell?.align ? 'left' : headCell.align}
            padding={headCell?.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.field ? order : false}
            sx={{
              whiteSpace: 'nowrap'
            }}
          >
            {headCell?.buttons ? (
              headCell.headerName
            ) : (
              <TableSortLabel
                active={orderBy === headCell.field}
                direction={orderBy === headCell.field ? order : 'asc'}
                onClick={createSortHandler(headCell.field)}
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

interface LayoutTableToolbarProps extends IFilter {
  numSelected: number;
  title?: string;
}

interface IFilter {
  updateApiFilter: (params: TQueryParams) => Promise<void>;
  loading: boolean;
}

export const Filter = ({ updateApiFilter, loading }: IFilter) => {
  type TDeleted = 'active' | 'obsolete';
  const [search, setSearch] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<TDeleted>('active');

  return (
    <Box display="flex" justifyContent="flex-end" px="5px" width="100%%">
      <Box display="flex" justifyContent="space-between" px="5px" width="50%">
        <TextField
          inputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <FaSearch />
              </InputAdornment>
            )
          }}
          label="Search"
          value={search}
          sx={{
            width: '70%'
          }}
          onChange={(e) => setSearch(e.currentTarget.value)}
          variant="outlined"
        />
        <Select
          id="outlined-adornment-currency-product"
          value={deleted}
          onChange={(e) => setDeleted(e.target.value as TDeleted)}
          name="distributorPrice.currency"
          onBlur={(e) => setDeleted(e.target.value as TDeleted)}
          sx={{
            height: '56px'
          }}
        >
          <MenuItem value={'active'}>Active</MenuItem>
          <MenuItem value={'obsolete'}>Obsolete</MenuItem>
        </Select>
        <Button
          disableElevation
          disabled={loading}
          onClick={() => updateApiFilter({ search, deleted: deleted === 'obsolete' })}
          size="large"
          variant="contained"
          color="secondary"
        >
          <FaSearch />
        </Button>
      </Box>
    </Box>
  );
};

function LayoutTableToolbar(props: LayoutTableToolbarProps) {
  const { numSelected, title, loading, updateApiFilter } = props;
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      {' '}
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
            <IconButton onClick={() => setShow((prev) => !prev)}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
      {show && <Filter updateApiFilter={updateApiFilter} loading={loading} />}
    </>
  );
}

export const ListView = <T extends TItems>({
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
  startPolling,
  stopPolling,
  pageSizeOptions = [10, 50],
  rows,
  title,
  actionCell,
  updateApiFilter
}: IListView<T>) => {
  useEffect(() => {
    console.log('startPolling');
    startPolling();
    return () => {
      stopPolling();
    };
  }, [startPolling]);
  const [order, setOrder] = React.useState<SortOrder>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof T>('updatedAt');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const { selected, setSelected } = useMultiSelect();

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof T) => {
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

  function stableSort<T>(array: readonly T[], comparator: (a: any, b: any) => number) {
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
    () => rows && stableSort<T>(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <div style={{ height: '100%', width: '100' }}>
      {headerButtons}

      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <LayoutTableToolbar numSelected={selected.length} title={title} loading={loading} updateApiFilter={updateApiFilter} />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
              <LayoutTableHead
                numSelected={selected.length}
                //@ts-ignore
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                headCells={actionCell ? [...columns, actionCell as TableColumn<T>] : columns}
                hasHeader={(actionCell?.buttons || []).length > 0}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `layout-table-checkbox-${index}`;

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
                          id={`${row.id}-${value.field as string}`}
                          key={index.toString()}
                          align={value.align ? 'left' : value.align}
                          width={value.width}
                        >
                          {/* @ts-ignore */}
                          {value?.getValue ? value.getValue(row) : row[value.field as keyof typeof row]}
                        </TableCell>
                      ))}
                      {actionCell && (
                        <TableCell id={`actions`}>
                          {actionCell?.buttons?.map((value, index) => (
                            <Button
                              key={`header-button-${index}`}
                              id={row.id as string}
                              endIcon={value.icon}
                              disableElevation
                              {...value.rest}
                            >
                              {value.title}
                            </Button>
                          ))}
                        </TableCell>
                      )}
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
