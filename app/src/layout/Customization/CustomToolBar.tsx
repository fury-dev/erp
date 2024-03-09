import { Box, Grid } from '@mui/material';
import { useDialogContext } from '../../context/useDialogContext';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { ButtonGroup } from '../../components/List/ButtonGroup';
import { useTranslation } from 'react-i18next';

export const CustomToolBar = ({ deleteRequest, Component }: { Component: JSX.Element; deleteRequest: () => Promise<void> }) => {
  const { setComponent } = useDialogContext();
  const { t } = useTranslation();
  return (
    <Grid item xs={12}>
      <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
        <ButtonGroup
          buttons={[
            {
              title: t('general.edit'),
              icon: <FaEdit />,
              rest: {
                onClick: () => setComponent(Component),
                variant: 'contained'
              }
            },
            {
              title: t('general.delete'),
              icon: <MdDelete />,
              rest: {
                onClick: () => deleteRequest(),
                color: 'error'
              }
            }
          ]}
        />
      </Box>
    </Grid>
  );
};
