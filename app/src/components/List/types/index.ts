import { GridColDef } from '@mui/x-data-grid';
import { TItems } from '../../../types/items';
import { IButtons } from '../ButtonGroup';
export type SortOrder = 'asc' | 'desc';

export interface HeadCell<T extends TItems> {
  disablePadding?: boolean;
  label?: string;
  numeric?: boolean;
  getValue?: (params: T) => string;
  buttons?: IButtons[];
  field: keyof T;
}
export type TableColumn<T extends TItems> = Omit<Omit<GridColDef, 'type'>, 'field'> & HeadCell<T>;
export type TableOrder = keyof TItems;
