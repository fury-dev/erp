import React, { createContext, useMemo, useState } from 'react';
import { TItems } from '../types';

type TMultiSelectContext = {
  selected: TItems[];

  setSelected: React.Dispatch<React.SetStateAction<TItems[]>>;
};
export const MultiSelectContext = createContext<TMultiSelectContext | null>(null);

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
