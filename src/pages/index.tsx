import Image from "next/image";
import {
  TopPannel,
  MainContent,
  AddButton,
  BurgerButton,
} from "../styles/index.styled";
import AddIcon from "../assets/icons/addPlus.svg";
import BurgerIcon from "../assets/icons/hamburger.svg";
import content from "~/assets/testContent";
import MainItem from "~/components/MainItem";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function Home() {
  const router = useRouter();
  //email below is hardcoded for testing purposes
  const userWalletsFromServer = api.wallet.getWalletsWithEmail.useQuery(
    { email: "samko1311@gmail.com" },
    {
      enabled: true,
    }
  );
  const walletsList = userWalletsFromServer.data?.wallets;

  console.log(walletsList);

  return (
    <>
      <TopPannel>
        <h1>SplitWallet</h1>
        <BurgerButton>
          <Image priority src={BurgerIcon} alt="add icon" />
        </BurgerButton>
      </TopPannel>
      <MainContent>
        {walletsList &&
          walletsList.map((item, index) => (
            <MainItem
              onClick={() => router.push(`/${item.id}/expenses`)}
              key={index}
              name={item.name}
              description={item.description}
            />
          ))}
      </MainContent>
      <AddButton onClick={() => router.push("/newWallet")}>
        <Image priority src={AddIcon} alt="add icon" />
      </AddButton>
    </>
  );
}
