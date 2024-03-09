import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography
  // useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from '../../../../hooks/useScriptRef';
import AnimateButton from '../../../../ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from '../../../../utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { omit } from 'lodash';
import { useChangePassword } from '../../../../hooks/useChangePassword';
import { useTranslation } from 'react-i18next';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthWrapper1 from '../AuthWrapper1';
import AuthFooter from '../../../../ui-component/cards/AuthFooter';
import { useAuthContext } from '../../../../context/AuthContext';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const ChangePasswordForm = ({ ...others }) => {
  const theme = useTheme();
  const location = useLocation();
  const { setUser } = useAuthContext();
  const scriptedRef = useScriptRef();
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const { submitQuery, data, apiErrors, loading } = useChangePassword();
  const navigate = useNavigate();

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState<any>();
  useEffect(() => {
    console.log(location.state);
    if (!location.state?.email) {
      navigate('/');
    }
  }, [location, navigate]);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  const passwordValidationYup = Yup.string()
    .required('No password provided.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.');
  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{t('auth.changePassword.title')}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          newPasswordAgain: '',
          newPassword: ''
        }}
        validationSchema={Yup.object().shape({
          newPasswordAgain: passwordValidationYup,
          newPassword: passwordValidationYup
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (values.newPassword !== values.newPasswordAgain) {
              setErrors({ newPasswordAgain: 'Passwords are not same' });
            } else {
              await submitQuery({ email: location.state.email, password: values.newPasswordAgain });
              navigate('/');
              setStatus({ success: true });
              setSubmitting(false);
            }
          } catch (err: any) {
            console.log(err);

            if (scriptedRef.current) {
              setStatus({ success: false });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            {/* @ts-ignore */}

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-register">{t('auth.fields.newPassword')}</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-register"
                type={showPassword ? 'text' : 'password'}
                value={values.newPassword}
                name="newPassword"
                label={t('auth.fields.newPassword')}
                onBlur={handleBlur}
                onChange={async (e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
              />
              {touched.newPassword && errors.newPassword && (
                <FormHelperText error id="standard-weight-helper-text-password-register">
                  {errors.newPassword}
                </FormHelperText>
              )}
            </FormControl>
            {/*@ts-ignore*/}
            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-register">{t('auth.fields.newPasswordAgain')}</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-register"
                type={showPassword ? 'text' : 'password'}
                value={values.newPasswordAgain}
                name="newPasswordAgain"
                label={t('auth.fields.newPasswordAgain')}
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
              />
              {touched.newPasswordAgain && errors.newPasswordAgain && (
                <FormHelperText error id="standard-weight-helper-text-password-register">
                  {errors.newPasswordAgain}
                </FormHelperText>
              )}
            </FormControl>
            {strength !== 0 && (
              <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )}

            <Box sx={{ mt: 3 }}>
              <FormHelperText error={apiErrors?.message}>{apiErrors?.message || data?.message}</FormHelperText>
            </Box>

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={loading} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  {t('general.submit')}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

const ChangePassword = () => {
  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item xs={12}>
                    <ChangePasswordForm />
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};
export default ChangePassword;
