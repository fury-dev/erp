import { Box } from '@mui/material';
import { CSSProperties } from 'react';
import { ButtonGroup, IButtons } from './ButtonGroup';

export const HeaderButtons = ({
  buttons,
  containerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '5px',
    height: 'fit-content'
  },
  ...rest
}: {
  containerStyle?: CSSProperties;
  buttons: IButtons[];
}) => {
  return (
    <Box sx={containerStyle}>
      <ButtonGroup buttons={buttons} {...rest} />
    </Box>
  );
};
