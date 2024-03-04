import { Box, BoxProps, Typography } from '@mui/material';
import React, { CSSProperties } from 'react';
import styled from 'styled-components';

 
export const StyledElevatedBox = styled(Box)`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  background-color: white;
`;

interface IElevatedBox extends BoxProps {
  children?: React.ReactNode;
  header?: string;
  headerStyle?: CSSProperties;
}

export const ElevatedBox = ({ children, header, headerStyle, sx, ...rest }: IElevatedBox) => {
  return (
    <StyledElevatedBox
      sx={{
        padding: '4px',
        ...sx
      }}
      {...rest}
    >
      <Typography
        sx={{
          fontSize: '20px',

          ...headerStyle
        }}
      >
        {header}
      </Typography>
      {children}
    </StyledElevatedBox>
  );
};
