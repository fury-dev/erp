import { useNavigate } from '@remix-run/react';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography
} from '@mui/material';

// third-party

// project imports
import MainCard from '../../../../ui-component/cards/MainCard';
import Transitions from '../../../../ui-component/extended/Transitions';

// assets
import { IconEdit, IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { RootState } from '../../../../store';
import { useAuthContext } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const customization = useSelector((state: RootState) => state.customization);
  const navigate = useNavigate();
  const currentDateTime = new Date();
  const morningTime = new Date(currentDateTime.getDate(), currentDateTime.getMonth(), currentDateTime.getFullYear(), 4);
  const afternoonTime = new Date(currentDateTime.getDate(), currentDateTime.getMonth(), currentDateTime.getFullYear(), 12);
  const eveningTime = new Date(currentDateTime.getDate(), currentDateTime.getMonth(), currentDateTime.getFullYear(), 17);
  const nightTime = new Date(currentDateTime.getDate(), currentDateTime.getMonth(), currentDateTime.getFullYear(), 20);

  let message = 'goodMorning';
  // console.log(currentDateTime, currentDateTime.getFullYear());
  // console.log(afternoonTime);
  // console.log(nightTime);

  if (currentDateTime.getTime() > afternoonTime.getTime() && currentDateTime.getTime() < eveningTime.getTime()) {
    message = 'goodAfternoon';
  } else if (currentDateTime.getTime() > afternoonTime.getTime() && currentDateTime.getTime() < nightTime.getTime()) {
    message = 'goodEvening';
  } else if (currentDateTime.getTime() > nightTime.getTime() && currentDateTime.getTime() < morningTime.getTime()) {
    message = 'goodNight';
  }

  const [open, setOpen] = useState(false);
  const { setUser, user } = useAuthContext();

  const anchorRef = useRef(null);
  const handleLogout = async () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/');
  };

  const handleClose = (event: { target: any }) => {
    //@ts-ignore
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      //@ts-ignore
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            //@ts-ignore
            src={IconUser}
            sx={{
              //@ts-ignore
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings ref={anchorRef} stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          //@ts-ignore
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  border={false}
                  //@ts-ignore
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}
                >
                  <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                          {t(`general.${message}`)}
                        </Typography>
                        <Typography variant="h4">{user?.username}</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                  <Divider />

                  <List
                    component="nav"
                    sx={{
                      width: '100%',
                      maxWidth: 350,
                      minWidth: 300,
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: '10px',
                      [theme.breakpoints.down('md')]: {
                        minWidth: '100%'
                      },
                      '& .MuiListItemButton-root': {
                        mt: 0.5
                      }
                    }}
                  >
                    {' '}
                    <ListItemButton
                      sx={{
                        borderRadius: `${customization.borderRadius}px`
                      }}
                      onClick={() =>
                        navigate('/change-password', {
                          state: {
                            email: user?.email
                          }
                        })
                      }
                    >
                      <ListItemIcon>
                        <IconEdit stroke={1.5} size="1.3rem" />
                      </ListItemIcon>
                      <ListItemText primary={<Typography variant="body2">{t('auth.changePassword.title')}</Typography>} />
                    </ListItemButton>
                    <ListItemButton
                      sx={{
                        borderRadius: `${customization.borderRadius}px`
                      }}
                      onClick={handleLogout}
                    >
                      <ListItemIcon>
                        <IconLogout stroke={1.5} size="1.3rem" />
                      </ListItemIcon>
                      <ListItemText primary={<Typography variant="body2">{t('auth.logout')}</Typography>} />
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
