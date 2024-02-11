import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTheme } from '@mui/material';

export interface IDialogBox {
  title: string;
  children: React.ReactNode | React.ReactNode[];
  open: boolean;
  onClose: () => void;
  width?: string;
  height?: string;
}

export const DialogBox = ({ title, children, open, onClose, width = '700px', height = 'fit-content' }: IDialogBox) => {
  const theme = useTheme();
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        style={{
          position: 'fixed',
          top: '50%',
          right: '50%',
          transform: 'translate(50%,-50%)',
          maxWidth: 'fit-content',
          width,
          height,
          padding: '10px',
          backgroundColor: theme.palette.background.default,
          borderRadius: '10px',
          boxShadow: ' rgba(0, 0, 0, 0.24) 0px 3px 8px'
        }}
        as="div"
        className="relative z-10"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 "
                  style={{
                    textAlign: 'center'
                  }}
                >
                  {title}
                </Dialog.Title>

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
