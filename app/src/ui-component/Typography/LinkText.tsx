import Box from '@mui/material/Box';
import { FormLabel } from '@mui/material';
import { ITEMS } from '../../types';
import { Link } from 'react-router-dom';
import { IItemText } from './ItemText';
import { isNumber } from 'lodash';

interface ILinkText extends IItemText {
  header: string;
  text?: string;
  link?: string | null;
  horizontal?: boolean;
  itemType: ITEMS;
}
export const LinkText = ({ header, text = '-', itemType, horizontal = true, link, style }: ILinkText) => {
  if (!link) {
    return null;
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        ...(horizontal ? { alignItems: 'center' } : {}),
        width: '230px',
        justifyContent: 'space-between',
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
      <Link
        //@ts-expect-error
        title={isNumber(text) ? text.toString() : text}
        style={{
          width: '48%',
          textOverflow: 'ellipsis',
          overflow: 'clip',
          whiteSpace: 'nowrap',
          textAlign: 'left',
          ...style
        }}
        to={`/home/${itemType}/${link}`}
      >
        {text}
      </Link>
    </Box>
  );
};
