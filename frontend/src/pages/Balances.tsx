import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TopPannel,
  MainContent,
  AddButton,
  BurgerButton,
  BottomPannel,
  ExpenseButton,
} from '../styles/MainItemPage.styled';
import AddIcon from '-!svg-react-loader!../assets/icons/addPlus.svg';
import BurgerIcon from '-!svg-react-loader!../assets/icons/hamburger.svg';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import axios from 'axios';

export default function Balances() {
  const { walletId } = useParams();
  const navigate = useNavigate();

  console.log('Balances', walletId);

  return (
    <>
      <TopPannel>
        <BurgerButton onClick={() => navigate('/')}>
          <BackIcon />
        </BurgerButton>
        <h1>Grappe 2023</h1>
        <BurgerButton>
          <BurgerIcon />
        </BurgerButton>
      </TopPannel>
      <TopPannel>
        <ExpenseButton onClick={() => navigate(`/${walletId}/expenses`)}>
          <h1>MY EXPENSES</h1>
        </ExpenseButton>
        <ExpenseButton onClick={() => navigate(`/${walletId}/balances`)}>
          <h1>BALANCES</h1>
        </ExpenseButton>
      </TopPannel>
      <MainContent>
        <h1>Balances</h1>
      </MainContent>
    </>
  );
}
