import Box from '@mui/material/Box';
import { FormLabel } from '@mui/material';

interface IItemText {
  header: string;
  text?: string;
  horizontal?: boolean;
}
export const ItemText = ({ header, text = '-', horizontal = true }: IItemText) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        ...(horizontal ? { alignItems: 'center' } : {}),
        width: '190px'
      }}
    >
      <FormLabel
        sx={{
          width: '50%'
        }}
      >
        {header}
      </FormLabel>
      <h5
        style={{
          width: '50%'
        }}
      >
        {text}
      </h5>
    </Box>
  );
};
