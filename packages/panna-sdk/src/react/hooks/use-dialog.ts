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
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const onClose = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return { isOpen, onOpen, onClose, setIsOpen };
}
