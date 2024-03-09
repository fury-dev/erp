import { Box, Grid, Skeleton } from '@mui/material';
import { mapSkeletonItemText } from './components/Skeleton';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

export const ViewSkeleton = () => {
  const borderRadius = useSelector((state: RootState) => `${state.customization.borderRadius}px`);
  return (
    <Grid container>
      <Grid item xs={12}>
        <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
          <Skeleton
            width={'10%'}
            height={'50px'}
            sx={{
              marginRight: '5px',
              borderRadius
            }}
          />
          <Skeleton
            width={'10%'}
            height={'50px'}
            sx={{
              borderRadius
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={9}>
        <Skeleton
          width={'90%'}
          height={'450px'}
          sx={{
            borderRadius
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {mapSkeletonItemText(6)}
        </Box>
      </Grid>
      <Grid item xs={8}>
        {mapSkeletonItemText(4)}
      </Grid>
      <Grid item xs={12}>
        <Skeleton
          width={'90%'}
          height={'350px'}
          sx={{
            borderRadius
          }}
        />
      </Grid>
    </Grid>
  );
};
