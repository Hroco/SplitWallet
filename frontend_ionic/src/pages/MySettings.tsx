import React, { useEffect, useState } from 'react';
import { BurgerButton } from '../styles/buttons.styled';
import {
  MainContent,
  MiddlePannel,
  BottomContent,
  Navbar,
} from '../styles/mainContainers.styled';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import { useHistory } from 'react-router-dom';
// import axios from 'axios';
import { Button } from '../styles/DropDownMenu.styled';

export default function MySettings() {
  const history = useHistory();
  const [fullName, setFullName] = useState<string>('');
  const [nick, setNick] = useState<string>('');

  return (
    <>
      <Navbar>
        <BurgerButton onClick={() => history.push(`/`)}>
          <BackIcon />
        </BurgerButton>
        <h1>My settings</h1>
      </Navbar>
      <MainContent>
        <p>Profile Image</p>
        <p>Welcome {'Samuel Hrotik'}</p>
        <p>Email</p>

        <MiddlePannel>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <label htmlFor="nick">Nickname</label>
          <input
            type="text"
            id="nick"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
          />

          <p>Preferences</p>
        </MiddlePannel>
        <p>Notifications</p>

        <BottomContent>
          <Button>SignOut</Button>
        </BottomContent>
      </MainContent>
    </>
  );
}