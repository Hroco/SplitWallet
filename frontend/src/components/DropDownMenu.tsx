import React, { useLayoutEffect, useRef } from 'react';
import { Dialog, Menu, Button } from '../styles/DropDownMenu.styled';

import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import { useNavigate } from 'react-router-dom';

type DropDownMenuProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DropDownMenu({ isOpen, setIsOpen }: DropDownMenuProps) {
  const navigate = useNavigate();

  function onRequestClose() {
    setIsOpen(false);
  }

  return (
    <Dialog onClick={onRequestClose}>
      <Menu onClick={(e) => e.stopPropagation()}>
        <Button onClick={() => navigate(`/mysettings`)}>
          <BackIcon />
          My settings
        </Button>
      </Menu>
    </Dialog>
  );
}
