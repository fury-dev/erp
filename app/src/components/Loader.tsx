import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export const Loader = ({ title = 'Loading...' }: { title?: string }) => {
  return (
    <Box position="absolute" top="45%" left="55%" display="flex" flexDirection="column" justifyContent="center">
      <CircularProgress />
      {title}
    </Box>
  );
};
