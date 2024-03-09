import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Drawer,
  Fab,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Slider,
  Tooltip,
  Typography
} from '@mui/material';
import { IconSettings } from '@tabler/icons-react';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import { gridSpacing } from '../../store/constant';
import SubCard from '../../ui-component/cards/SubCard';
import AnimateButton from '../../ui-component/extended/AnimateButton';
import { saveBorderRadius, saveCurrency, saveAccent } from '../../store/reducers/customizationReducer';
import { RootState } from '../../store';
import { TAccent, TCurrency } from '../../types';

// concat 'px'
function valueText(value: any) {
  return `${value}px`;
}

// ==============================|| LIVE CUSTOMIZATION ||============================== //

const Customization = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const customization = useSelector((state: RootState) => state.customization);

  const [currency, setCurrency] = useState(customization.currency);
  const [accent, setAccent] = useState(customization.accent);

  // drawer on/off
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  // state - border radius
  const [borderRadius, setBorderRadius] = useState(customization.borderRadius);
  const handleBorderRadius = (_event: any, newValue: any) => {
    setBorderRadius(newValue);
  };

  useEffect(() => {
    dispatch(
      saveBorderRadius({
        borderRadius
      })
    );
  }, [dispatch, borderRadius]);

  return (
    <>
      {/* toggle button */}
      <Tooltip title="Live Customize">
        <Fab
          component="div"
          onClick={handleToggle}
          size="medium"
          variant="circular"
          color="secondary"
          sx={{
            borderRadius: 0,
            borderTopLeftRadius: '50%',
            borderBottomLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomRightRadius: '4px',
            top: '25%',
            position: 'fixed',
            right: 10,
            zIndex: theme.zIndex.speedDial
          }}
        >
          <AnimateButton type="rotate">
            <IconButton color="inherit" size="large" disableRipple>
              <IconSettings />
            </IconButton>
          </AnimateButton>
        </Fab>
      </Tooltip>

      <Drawer
        anchor="right"
        onClose={handleToggle}
        open={open}
        PaperProps={{
          sx: {
            width: 280
          }
        }}
      >
        <PerfectScrollbar component="div">
          <Grid container spacing={gridSpacing} sx={{ p: 3 }}>
            <Grid item xs={12}>
              <SubCard title="Accent">
                <FormControl>
                  <RadioGroup
                    aria-label="accent"
                    value={accent}
                    onChange={(e) =>
                      setAccent(() => {
                        dispatch(saveAccent(e.target.value));
                        return e.target.value as TAccent;
                      })
                    }
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="DARK"
                      control={<Radio />}
                      label="Dark"
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 28 },
                        '& .MuiFormControlLabel-label': {
                          color: theme.palette.grey[900]
                        }
                      }}
                    />
                    <FormControlLabel
                      value="LIGHT"
                      control={<Radio />}
                      label="Light "
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 28 },
                        '& .MuiFormControlLabel-label': {
                          color: theme.palette.grey[900]
                        }
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </SubCard>
              <SubCard title="Currency">
                <FormControl>
                  <RadioGroup
                    aria-label="font-family"
                    value={currency}
                    onChange={(e) =>
                      setCurrency(() => {
                        dispatch(saveCurrency(e.target.value));
                        return e.target.value as TCurrency;
                      })
                    }
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="INR"
                      control={<Radio />}
                      label="Rupee ₹"
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 28 },
                        '& .MuiFormControlLabel-label': {
                          color: theme.palette.grey[900]
                        }
                      }}
                    />
                    <FormControlLabel
                      value="USD"
                      control={<Radio />}
                      label="Dollar $"
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 28 },
                        '& .MuiFormControlLabel-label': {
                          color: theme.palette.grey[900]
                        }
                      }}
                    />
                    <FormControlLabel
                      value="STER"
                      control={<Radio />}
                      label="POUND £"
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 28 },
                        '& .MuiFormControlLabel-label': {
                          color: theme.palette.grey[900]
                        }
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </SubCard>
            </Grid>
            <Grid item xs={12}>
              {/* border radius */}
              <SubCard title="Border Radius">
                <Grid item xs={12} container spacing={2} alignItems="center" sx={{ mt: 2.5 }}>
                  <Grid item>
                    <Typography variant="h6" color="secondary">
                      4px
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Slider
                      size="small"
                      value={borderRadius}
                      onChange={handleBorderRadius}
                      getAriaValueText={valueText}
                      valueLabelDisplay="on"
                      aria-labelledby="discrete-slider-small-steps"
                      marks
                      step={2}
                      min={4}
                      max={24}
                      color="secondary"
                      sx={{
                        '& .MuiSlider-valueLabel': {
                          color: 'secondary.light'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" color="secondary">
                      24px
                    </Typography>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
          </Grid>
        </PerfectScrollbar>
      </Drawer>
    </>
  );
};

export default Customization;
