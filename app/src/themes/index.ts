import { ThemeOptions, createTheme } from '@mui/material/styles';

// assets
//@ts-ignore
import colors from '../assets/scss/_themes-vars.module.scss';

// project imports
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
import themeTypography from './typography';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import { RootState } from '../store';

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization: RootState['customization']) => {
  const color = colors;

  const themeOption = {
    colors: color,
    heading: customization.accent === 'LIGHT' ? color.grey900 : color.grey50,
    paper: customization.accent === 'LIGHT' ? color.paper : color.darkPaper,
    backgroundDefault: customization.accent === 'LIGHT' ? color.grey200 : color.darkBackground,
    background: customization.accent === 'LIGHT' ? color.primaryLight : color.darkBackground,
    darkTextPrimary: customization.accent == 'LIGHT' ? color.grey700 : color.darkTextPrimary,
    darkTextSecondary: customization.accent === 'LIGHT' ? color.grey500 : color.darkTextSecondary,
    textDark: customization.accent === 'LIGHT' ? color.grey900 : color.grey50,
    menuSelected: customization.accent === 'LIGHT' ? color.secondaryDark : color.darkSecondaryDark,
    menuSelectedBack: customization.accent === 'LIGHT' ? color.secondaryLight : color.darkSecondaryLight,
    divider: customization.accent === 'LIGHT' ? color.grey200 : color.grey50,

    customization
  };

  const themeOptions: ThemeOptions = {
    direction: 'ltr',
    palette: themePalette(themeOption),
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px'
        }
      }
    },
    typography: themeTypography(themeOption) as TypographyOptions
  };

  const themes = createTheme(themeOptions);
  themes.components = componentStyleOverrides(themeOption);

  return themes;
};

export default theme;
