import React from 'react';
import { Dialog, Menu } from '../styles/DropDownMenu.styled';

type DropDownMenuProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

export default function DropDownMenu({
  isOpen,
  setIsOpen,
  children,
}: DropDownMenuProps) {
  function onRequestClose() {
    setIsOpen(false);
  }

  return (
    <Dialog onClick={onRequestClose}>
      <Menu onClick={(e) => e.stopPropagation()}>{children}</Menu>
    </Dialog>
  );
}
