import Box from '@mui/material/Box';
import { FormLabel } from '@mui/material';
import { CSSProperties } from 'react';
import { isNumber } from 'lodash';

export interface IItemText {
  header: string;
  text?: string | number;
  horizontal?: boolean;
  style?: CSSProperties;
}
export const ItemText = ({ header, text = '-', horizontal = true, style }: IItemText) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        ...(horizontal ? { alignItems: 'center' } : {}),
        width: '230px',
        justifyContent: 'space-between',
        padding: '4px',
        height: 'fit-content',
        textOverflow: 'ellipsis',
        overflow: 'clip',
        whiteSpace: 'nowrap'
      }}
    >
      <FormLabel
        sx={{
          width: '48%',
          textAlign: 'left'
        }}
      >
        {header}
      </FormLabel>
      <h5
        title={isNumber(text) ? text.toString() : text}
        style={{
          width: '48%',
          textOverflow: 'ellipsis',
          overflow: 'clip',
          whiteSpace: 'nowrap',
          textAlign: 'left',

          ...style
        }}
      >
        {text}
      </h5>
    </Box>
  );
};
