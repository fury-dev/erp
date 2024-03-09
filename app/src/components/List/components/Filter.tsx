import { TextField, InputAdornment, Select, MenuItem, Button, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { TQueryParams } from '../../../service/controllers';

export interface IFilter {
  updateApiFilter: (params: TQueryParams) => Promise<void>;
  loading: boolean;
}

export const Filter = ({ updateApiFilter, loading }: IFilter) => {
  type TDeleted = 'active' | 'obsolete';
  const [search, setSearch] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<TDeleted>('active');

  useEffect(() => {
    updateApiFilter({ search, deleted: deleted === 'obsolete' ? 2 : 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateApiFilter]);

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
          onClick={() => updateApiFilter({ search, deleted: deleted === 'obsolete' ? 2 : 1 })}
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
