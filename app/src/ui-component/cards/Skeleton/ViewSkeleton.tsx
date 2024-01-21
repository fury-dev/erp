import { Box, Grid, Skeleton } from '@mui/material';
export const mapSkeletonItemText = (n: number) => {
  return new Array(6).fill(n).map(() => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '50px',
        justifyContent: 'space-between',
        width: '170px'
      }}
    >
      <Skeleton width={'50px'} height={'20px'} />
      <Skeleton width={'50px'} height={'20px'} />
    </Box>
  ));
};
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
