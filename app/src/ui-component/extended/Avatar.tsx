// material-ui
import { useTheme } from '@mui/material/styles';
import MuiAvatar from '@mui/material/Avatar';

// types
import React, { CSSProperties } from 'react';

// ==============================|| AVATAR ||============================== //

const Avatar = ({
  color,
  outline,
  size,
  sx,
  children,
  component,
  ...others
}: {
  className?: string;
  color?: string;
  outline?: Boolean;
  size?: string;
  sx?: CSSProperties;
  children: React.ReactNode;
  component?: any;
  href?: any;
  target?: string;
  alt?: string;
}) => {
  const theme = useTheme();

  const colorSX: any = color && !outline && { color: theme.palette.background.paper, bgcolor: `${color}.main` };
  const outlineSX = outline && {
    color: color ? `${color}.main` : `primary.main`,
    bgcolor: theme.palette.background.paper,
    border: '2px solid',
    borderColor: color ? `${color}.main` : `primary.main`
  };
  let sizeSX = {};
  switch (size) {
    case 'badge':
      sizeSX = {
        width: theme.spacing(3.5),
        height: theme.spacing(3.5)
      };
      break;
    case 'xs':
      sizeSX = {
        width: theme.spacing(4.25),
        height: theme.spacing(4.25)
      };
      break;
    case 'sm':
      sizeSX = {
        width: theme.spacing(5),
        height: theme.spacing(5)
      };
      break;
    case 'lg':
      sizeSX = {
        width: theme.spacing(9),
        height: theme.spacing(9)
      };
      break;
    case 'xl':
      sizeSX = {
        width: theme.spacing(10.25),
        height: theme.spacing(10.25)
      };
      break;
    case 'md':
      sizeSX = {
        width: theme.spacing(7.5),
        height: theme.spacing(7.5)
      };
      break;
    default:
      sizeSX = {};
  }

  return <MuiAvatar component={component} children={children} sx={{ ...colorSX, ...outlineSX, ...sizeSX, ...sx }} {...others} />;
};

export default Avatar;
