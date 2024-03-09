import { Box, Grid } from '@mui/material';
import { Button } from '../../components/Button';
import { useSelector } from 'react-redux';
import { useDialogContext } from '../../context/useDialogContext';
import { RootState } from '../../store';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

export const CustomToolBar = ({ deleteRequest, Component }: { Component: JSX.Element; deleteRequest: () => Promise<void> }) => {
  const customization = useSelector((state: RootState) => state.customization);
  const { setComponent } = useDialogContext();
  const borderRadiusPx = `${customization.borderRadius}px`;
  return (
    <Grid item xs={12}>
      <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
        <Button sx={{ borderRadius: borderRadiusPx }} variant="contained" onClick={() => setComponent(Component)} startIcon={<FaEdit />}>
          Edit
        </Button>
        <Button
          sx={{ borderRadius: borderRadiusPx }}
          variant="contained"
          color="error"
          onClick={() => deleteRequest()}
          startIcon={<MdDelete />}
        >
          Delete
        </Button>
      </Box>
    </Grid>
  );
};
