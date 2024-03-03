import { ReactNode, forwardRef } from 'react';

// types

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, SxProps, Theme, Typography } from '@mui/material';
// constant
const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 }
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

type Elements = ReactNode | string | object;
interface IMainCard {
  border?: boolean;
  boxShadow?: boolean;
  children: ReactNode[] | ReactNode;
  content?: boolean;
  contentClass?: string;
  contentSX?: object;
  darkTitle?: boolean;
  secondary?: ReactNode | string | object;
  shadow?: string;
  sx?: SxProps<Theme>;
  title?: Elements;
}
const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = '',
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      ...others
    }: IMainCard,
    ref
  ) => {
    const theme = useTheme();

    return (
      //@ts-expect-error
      <Card
        ref={ref}
        sx={{
          border: border ? '1px solid' : 'none',
          borderColor: theme.palette.primary.light,
          ':hover': {
            boxShadow: boxShadow ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)' : 'inherit'
          },
          ...sx
        }}
        {...others}
      >
        {/* card header and action */}
        {title && (
          <CardHeader
            sx={headerSX}
            title={darkTitle ? <Typography variant="h3">{title as string}</Typography> : <>{title}</>}
            action={secondary as ReactNode}
          />
        )}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

export default MainCard;
