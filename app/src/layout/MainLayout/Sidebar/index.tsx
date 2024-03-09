// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView } from 'react-device-detect';

// types

// project imports
import MenuList from './MenuList';
import LogoSection from '../LogoSection';
import { drawerWidth } from '../../../store/constant';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
interface ISidebar {
  drawerOpen: boolean;
  drawerToggle: any;
  window?: any;
}

const StyledPerfectScrollbar = styled(PerfectScrollbar)`
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #000000;
  }
`;
const Sidebar = ({ drawerOpen = false, drawerToggle = () => 0, window }: ISidebar) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const customization = useSelector((state: RootState) => state.customization);
  const drawer = (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
          <LogoSection />
        </Box>
      </Box>
      <BrowserView>
        <StyledPerfectScrollbar
          component="div"
          style={{
            height: 'fit-content',
            paddingLeft: '16px',
            paddingRight: '16px',
            padding: '5px',
            backgroundColor: theme.palette.background.default,
            borderRadius: `${customization.borderRadius}px`,
            margin: '5px'
          }}
        >
          <MenuList />
        </StyledPerfectScrollbar>
      </BrowserView>
    </>
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto', margin: '10px' }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            color: theme.palette.text.primary,
            borderRight: 'none',
            [theme.breakpoints.up('md')]: {
              top: '88px'
            }
          }
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
