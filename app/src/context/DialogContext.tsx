import React, { ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
const FilteredDiv = styled.div`
  filter: blur(5px);
`;

type TDialogContext = {
  open: boolean;

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setComponent: React.Dispatch<React.SetStateAction<ReactNode>>;
  component: ReactNode;
};
export const DialogContext = createContext<TDialogContext | null>(null);

export const DialogContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState<boolean>(true);
  const [component, setComponent] = useState<ReactNode | null>(null);

  const values = useMemo(
    () => ({
      open,
      setOpen,
      component,
      setComponent
    }),
    [component, open]
  );
  useEffect(() => {
    console.log(component);
  }, [component]);
  useEffect(() => {
    console.log(open);
  }, [open]);
  return (
    <DialogContext.Provider value={values}>
      {component && open ? (
        <FilteredDiv>
          {component}
          {children}
        </FilteredDiv>
      ) : (
        <> {children}</>
      )}
    </DialogContext.Provider>
  );
};
