import { Toolbar, alpha, Typography, Tooltip, IconButton } from '@mui/material';
import { useState } from 'react';
import { Filter, IFilter } from './Filter';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';

interface LayoutTableToolbarProps extends IFilter {
  numSelected: number;
  title?: string;
}

export function LayoutTableToolbar(props: LayoutTableToolbarProps) {
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
