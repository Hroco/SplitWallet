import React, { useEffect, useState } from 'react';
import { WalletAddButton, BurgerButton } from '../styles/buttons.styled';
import { MainContent, Navbar } from '../styles/mainContainers.styled';
import AddIcon from '-!svg-react-loader!../assets/icons/addPlus.svg';
import BurgerIcon from '-!svg-react-loader!../assets/icons/hamburger.svg';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import content from '../assets/testContent';
import MainItem from '../components/MainItem';
import { useNavigate } from 'react-router-dom';
import BurgerMenu from '../components/DropDownMenu';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';
import { Button } from '../styles/DropDownMenu.styled';

export default function HomePage() {
  const navigate = useNavigate();
  const [postResponse, setPostResponse] = useState<any>(null);
  const [walletsList, setWalletsList] = useState<any>(null);
  const [shouldShowBurgerMenu, setShouldShowBurgerMenu] = useState(false);

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

  // if (true) return <LoadingScreen />;

  return (
    <>
      <Navbar>
        <h1>SplitWallet</h1>
        <BurgerButton onClick={() => setShouldShowBurgerMenu(true)}>
          <BurgerIcon />
        </BurgerButton>
        {shouldShowBurgerMenu && (
          <BurgerMenu
            isOpen={shouldShowBurgerMenu}
            setIsOpen={setShouldShowBurgerMenu}
          >
            <Button onClick={() => navigate(`/mysettings`)}>
              <BackIcon />
              My settings
            </Button>
          </BurgerMenu>
        )}
      </Navbar>
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
      <WalletAddButton onClick={() => navigate('/newWallet')}>
        <AddIcon />
      </WalletAddButton>
    </>
  );
}
