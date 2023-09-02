import React from 'react';
import {
  TopPannel,
  MainContent,
  BurgerButton,
  BottomPannel,
} from '../styles/MainItemPage.styled';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import { useNavigate, useParams } from 'react-router-dom';

export default function Open() {
  const { walletItemId } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <TopPannel>
        <BurgerButton onClick={() => navigate('/')}>
          <BackIcon />
        </BurgerButton>
        <h1>Nazov polozky</h1>
        <BurgerButton>Edit</BurgerButton>
      </TopPannel>
      <MainContent>
        <h1>Content</h1>
      </MainContent>
      <BottomPannel>
        <BurgerButton onClick={() => navigate('/')}>
          <BackIcon />
          <p>Previouse</p>
        </BurgerButton>
        <BurgerButton rotate={'180'} onClick={() => navigate('/')}>
          <p>Next</p>
          <BackIcon />
        </BurgerButton>
      </BottomPannel>
    </>
  );
}
