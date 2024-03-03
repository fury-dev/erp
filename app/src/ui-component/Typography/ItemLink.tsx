import Box from '@mui/material/Box';
import { FormLabel } from '@mui/material';
import { ITEMS } from '../../types';
import { Link } from 'react-router-dom';

interface IItemLink {
  header: string;
  text?: string;
  link?: string | null;
  horizontal?: boolean;
  itemType: ITEMS;
}
export const ItemLink = ({ header, text = '-', itemType, horizontal = true, link }: IItemLink) => {
  if (!link) {
    return null;
  }
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
      <Link
        style={{
          width: '50%'
        }}
        to={`/home/${itemType}/${link}`}
      >
        {text}
      </Link>
    </Box>
  );
};
