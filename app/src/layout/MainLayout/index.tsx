import { Outlet } from '@remix-run/react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import { drawerWidth } from '../../store/constant';
import Customization from '../../layout/Customization';
import Header from './Header';
import Sidebar from './Sidebar';
import { RootState } from '../../store';
import { setMenu } from '../../store/reducers/customizationReducer';

// assets
// import { IconChevronRight } from '@tabler/icons-react';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }: { theme: any; open: boolean }) => ({
  ...theme.typography?.mainContent,
  ...(!open && {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    [theme.breakpoints.up('md')]: {
      marginLeft: -(drawerWidth - 20),
      width: `calc(100% - ${drawerWidth}px)`
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px',
      width: `calc(100% - ${drawerWidth}px)`,
      padding: '16px'
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10px',
      width: `calc(100% - ${drawerWidth}px)`,
      padding: '16px',
      marginRight: '10px'
    }
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: `calc(100% - ${drawerWidth}px)`,
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px'
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10px'
    }
  })
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  // Handle left drawer
  const leftDrawerOpened = useSelector((state: RootState) => state.customization?.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch(
      setMenu({
        opened: !leftDrawerOpened
      })
    );
  };

  console.log(theme);
  return (
    <Box sx={{ display: 'flex', width: '100%', backgroundColor: theme.palette.background.paper }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%'
        }}
      >
        {/* drawer */}
        <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

        {/* main content */}
        <Main theme={theme} open={leftDrawerOpened}>
          {/* breadcrumb */}
          {/* <Breadcrumbs
            separator={FaChevronRight}
            navigation={navigation}
            icon
            title
            rightAlign
            card={undefined}
            divider={undefined}
            icons={undefined}
            maxItems={undefined}
            titleBottom={undefined}
          /> */}
          <Outlet />
        </Main>
      </Box>
      <Customization />
    </Box>
  );
};

export default MainLayout;
