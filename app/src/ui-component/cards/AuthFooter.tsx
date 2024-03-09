// material-ui
import { Link, Typography, Stack } from '@mui/material';

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://github.com/fury-r" target="_blank" underline="hover">
      fury-r
    </Typography>
  </Stack>
);

export default AuthFooter;
