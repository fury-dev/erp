import { Skeleton } from '@mui/material';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

export const mapSkeletonItemText = (n: number) => {
  const borderRadius = useSelector((state: RootState) => `${state.customization.borderRadius}px`);

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
      <Skeleton
        width={'50px'}
        height={'20px'}
        sx={{
          borderRadius
        }}
      />
      <Skeleton
        width={'50px'}
        height={'20px'}
        sx={{
          borderRadius
        }}
      />
    </Box>
  ));
};
