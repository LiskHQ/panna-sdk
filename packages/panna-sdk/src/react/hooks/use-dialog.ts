import { Dispatch, SetStateAction, useState } from 'react';

type UseDialogHook = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export function useDialog(): UseDialogHook {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return { isOpen, onOpen, onClose, setIsOpen };
}
