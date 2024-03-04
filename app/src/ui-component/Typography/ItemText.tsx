import Box from '@mui/material/Box';
import { FormLabel } from '@mui/material';
import { CSSProperties } from 'react';

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
        width: '210px',
        padding: '4px'
      }}
    >
      <FormLabel
        sx={{
          width: '50%',
          whiteSpace: 'nowrap',
          textAlign: 'right'
        }}
      >
        {header}
      </FormLabel>
      <h5
        style={{
          width: '50%',
          textOverflow: 'ellipsis',
          ...style
        }}
      >
        {text}
      </h5>
    </Box>
  );
};
