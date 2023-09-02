import React, { useEffect, useState } from 'react';
import {
  TopPannel,
  MainContent,
  AddButton,
  BurgerButton,
} from '../styles/index.styled';
import AddIcon from '-!svg-react-loader!../assets/icons/addPlus.svg';
import BurgerIcon from '-!svg-react-loader!../assets/icons/hamburger.svg';
import content from '../assets/testContent';
import MainItem from '../components/MainItem';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function HomePage() {
  const navigate = useNavigate();
  const [postResponse, setPostResponse] = useState<any>(null);
  const [walletsList, setWalletsList] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const email = 'samko1311@gmail.com';
      const response = await axios.get(
        `/api/wallets/getWalletsWithEmail/${email}`
      );
      console.log('response', response);
      setPostResponse(response.data);
    })();
  }, []);

  useEffect(() => {
    const { wallets } = postResponse || {};
    setWalletsList(wallets);
  }, [postResponse]);

  /* const router = useRouter();
  //email below is hardcoded for testing purposes
  const userWalletsFromServer = api.wallet.getWalletsWithEmail.useQuery(
    { email: "samko1311@gmail.com" },
    {
      enabled: true,
    }
  );
  const walletsList = userWalletsFromServer.data?.wallets;*/

  // console.log(walletsList);

  return (
    <>
      <TopPannel>
        <h1>SplitWallet</h1>
        <BurgerButton>
          <BurgerIcon />
        </BurgerButton>
      </TopPannel>
      <MainContent>
        {walletsList &&
          walletsList.map((item: any, index: number) => (
            <MainItem
              onClick={() => navigate(`/${item.id}/expenses`)}
              key={index}
              name={item.name}
              description={item.description}
            />
          ))}
      </MainContent>
      <AddButton onClick={() => navigate('/newWallet')}>
        <AddIcon />
      </AddButton>
    </>
  );
}
