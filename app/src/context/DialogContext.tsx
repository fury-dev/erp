import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';
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
const DialogContext = createContext<TDialogContext | null>(null);

export const DialogContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [component, setComponent] = useState<ReactNode | null>(null);

  const values = useMemo(
    () => ({
      open,
      setOpen,
      component,
      setComponent
    }),
    [open, setOpen]
  );
  return (
    <DialogContext.Provider value={values}>
      {component ? (
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

export const useDialogContext = () => {
  const dialogContext = useContext(DialogContext);
  if (!dialogContext) {
    throw new Error('DialogContext cannot be accessed');
  }
  return dialogContext;
};
