import React, { useEffect } from 'react';

import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity';
import { Paper, TableContainer, Table, TableBody, TableRow, TableCell, Checkbox, TablePagination, Box, Button } from '@mui/material';

import { Loader } from '..';
import { TItems } from '../../types';
import { TQueryParams } from '../../service/controllers';
import { ListSkeleton } from '../../ui-component/cards/Skeleton/ListSkeleton';
import { SortOrder, TableColumn } from './types';
import { LayoutTableToolbar } from './components/LayoutTableToolbar';
import { LayoutTableHead } from './components/LayoutTableHead';
import { useMultiSelect } from '../../context/useMultiSelect';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

interface IListView<T extends TItems> {
  rows: T[];
  columns: TableColumn<T>[];
  initialState?: GridInitialStateCommunity;
  loading?: boolean;
  checkboxSelection?: boolean;
  headerButtons?: React.ReactNode;
  startPolling: (...rest: any) => any;
  stopPolling: (...rest: any) => any;
  pageSizeOptions?: number[];
  title: string;
  actionCell?: Omit<TableColumn<T>, 'field'> & {
    field: string;
  };
  updateApiFilter: (params: TQueryParams) => Promise<void>;
  rowOnClick?: (item: T) => void;
}

export const ListView = <T extends TItems>({
  columns,
  loading = false,
  headerButtons,
  startPolling,
  stopPolling,
  rows,
  title,
  actionCell,
  updateApiFilter,
  rowOnClick
}: IListView<T>) => {
  useEffect(() => {
    console.log('startPolling');
    startPolling();
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);
  const [order, setOrder] = React.useState<SortOrder>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof T>('updatedAt');
  const [page, setPage] = React.useState(0);
  // const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const { selected, setSelected } = useMultiSelect();

  const handleRequestSort = (_: React.MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // const newSelected = rows.map((n) => n.id);
      setSelected(rows);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_: React.MouseEvent<unknown>, id: any) => {
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

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setDense(event.target.checked);
  // };

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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () => rows && stableSort<T>(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return loading ? (
    <ListSkeleton />
  ) : (
    <div style={{ height: '100%', width: '100' }}>
      {headerButtons}

      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <LayoutTableToolbar numSelected={selected.length} title={title} loading={loading} updateApiFilter={updateApiFilter} />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
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
                    <TableRow
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      onClick={rowOnClick ? () => rowOnClick(row) : () => null}
                    >
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
                        <TableCell id={`actions`} onClick={(e) => e.stopPropagation()}>
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
                      //@ts-ignore
                      // height: (false ? 33 : 53) * emptyRows
                      height: 53 * emptyRows
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
