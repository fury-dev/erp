import { Toolbar, alpha, Typography, Tooltip, IconButton } from '@mui/material';
import { useState } from 'react';
import { Filter, IFilter } from './Filter';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import { TQueryParams } from '../../../service/controllers';

interface LayoutTableToolbarProps extends Omit<IFilter, 'updateApiFilter'> {
  numSelected: number;
  title?: string;
  showToolbar?: boolean;
  updateApiFilter?: (params: TQueryParams) => Promise<void>;
}

export function LayoutTableToolbar(props: LayoutTableToolbarProps) {
  const { numSelected, title, loading, updateApiFilter, showToolbar } = props;
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
          })
        }}
      >
        {numSelected > 0 && showToolbar ? (
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
          showToolbar && (
            <Tooltip title="Filter list">
              <IconButton onClick={() => setShow((prev) => !prev)}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )
        )}
      </Toolbar>
      {show && updateApiFilter && <Filter updateApiFilter={updateApiFilter} loading={loading} />}
    </>
  );
}
