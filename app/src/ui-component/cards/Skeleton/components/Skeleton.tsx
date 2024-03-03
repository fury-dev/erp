import { Skeleton } from '@mui/material';
import { Box } from '@mui/material';

export const mapSkeletonItemText = (n: number) => {
  return new Array(6).fill(n).map((_, index) => (
    <Box
      key={index.toString()}
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
