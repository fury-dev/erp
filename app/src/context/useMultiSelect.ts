import { useContext } from 'react';
import { MultiSelectContext } from './MuliSelectContext';

export const useMultiSelect = () => {
  const multiSelect = useContext(MultiSelectContext);
  if (!multiSelect) {
    throw new Error('MultiSelect cannot be accessed');
  }
  return multiSelect;
};
