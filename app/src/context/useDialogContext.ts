import { useContext } from 'react';
import { DialogContext } from './DialogContext';

export const useDialogContext = () => {
  const dialogContext = useContext(DialogContext);
  if (!dialogContext) {
    throw new Error('DialogContext cannot be accessed');
  }
  return dialogContext;
};
