import React, { createContext, useContext, useMemo, useState } from 'react';
import { TItems } from '../types';
import assert from 'assert';

type TMultiSelectContext = {
  selected: TItems[];

  setSelected: React.Dispatch<React.SetStateAction<TItems[]>>;
};
const MultiSelectContext = createContext<TMultiSelectContext | null>(null);

export const MultiSelectContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState<TItems[]>([]);

  const values = useMemo(
    () => ({
      selected,
      setSelected
    }),
    [selected, setSelected]
  );
  return <MultiSelectContext.Provider value={values}>{children}</MultiSelectContext.Provider>;
};

export const useMultiSelect = () => {
  const multiSelect = useContext(MultiSelectContext);
  if (!multiSelect) {
    throw new Error('MultiSelect cannot be accessed');
  }
  return multiSelect;
};
