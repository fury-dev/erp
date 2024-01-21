import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Box } from '@mui/material';
import { TItems } from '../../../types';
import { visuallyHidden } from '@mui/utils';

import { SortOrder, TableColumn } from '../types';
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

export function LayoutTableHead<T extends TItems>(props: LayoutTableProps<T>) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } = props;
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
