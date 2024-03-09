import { Box, BoxProps, Typography, useTheme } from '@mui/material';
import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import styled from 'styled-components';

export const StyledElevatedBox = styled(Box)`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
`;

interface IElevatedBox extends BoxProps {
  children?: React.ReactNode;
  header?: string;
  headerStyle?: CSSProperties;
  translateHeader?: boolean;
}

export const ElevatedBox = ({ children, header, headerStyle, sx, translateHeader = true, ...rest }: IElevatedBox) => {
  const { t } = useTranslation();
  const borderRadius = useSelector((state: RootState) => state.customization.borderRadius);
  const theme = useTheme();
  return (
    <StyledElevatedBox
      sx={{
        padding: '8px',
        borderRadius: `${borderRadius}px`,
        overflow: 'clip',
        whiteSpace: 'nowrap',
        background: theme.palette.background.paper,
        ...sx
      }}
      {...rest}
    >
      {header && (
        <Typography
          sx={{
            fontSize: '20px',

            ...headerStyle
          }}
        >
          {translateHeader ? t(header) : header}
        </Typography>
      )}
      {children}
    </StyledElevatedBox>
  );
};
