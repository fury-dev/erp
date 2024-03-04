import Box from '@mui/material/Box';
import { FormLabel } from '@mui/material';
import { ITEMS } from '../../types';
import { Link } from 'react-router-dom';
import { IItemText } from './ItemText';

interface IItemLink extends IItemText {
  header: string;
  text?: string;
  link?: string | null;
  horizontal?: boolean;
  itemType: ITEMS;
}
export const ItemLink = ({ header, text = '-', itemType, horizontal = true, link, style }: IItemLink) => {
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
          width: '50%',
          whiteSpace: 'nowrap',
          textAlign: 'right'
        }}
      >
        {header}
      </FormLabel>
      <Link
        style={{
          width: '50%',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          ...style
        }}
        to={`/home/${itemType}/${link}`}
      >
        {text}
      </Link>
    </Box>
  );
};
