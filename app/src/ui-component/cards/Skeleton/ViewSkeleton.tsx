import { Box, Grid, Skeleton } from '@mui/material';
import { mapSkeletonItemText } from './components/Skeleton';

export const ViewSkeleton = () => {
  return (
    <Grid container>
      <Grid item xs={8}>
        <Skeleton width={'90%'} height={'350px'} />
      </Grid>
      <Grid item xs={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {mapSkeletonItemText(6)}
        </Box>
      </Grid>
      <Grid item xs={8}>
        {mapSkeletonItemText(4)}
      </Grid>
      <Grid item xs={12}>
        <Skeleton width={'90%'} height={'350px'} />
      </Grid>
    </Grid>
  );
};
