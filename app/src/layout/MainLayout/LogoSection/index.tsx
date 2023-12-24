import { useDispatch, useSelector } from 'react-redux';
import { Link } from '@remix-run/react';

// material-ui
import { ButtonBase, Typography } from '@mui/material';

// project imports
import config from '../../../config';
import { setIsOpen } from '../../../store/reducers/customizationReducer';
import { RootState } from '../../../store';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state: RootState) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <ButtonBase disableRipple onClick={() => dispatch(setIsOpen({ id: defaultId }))} component={Link} to={config.defaultPath}>
      <Typography variant="h2">CMS</Typography>
    </ButtonBase>
  );
};

export default LogoSection;
