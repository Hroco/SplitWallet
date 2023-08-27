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

export default function Home() {
  const router = useRouter();

  return (
    <>
      <TopPannel>
        <h1>SplitWallet</h1>
        <BurgerButton>
          <Image priority src={BurgerIcon} alt="add icon" />
        </BurgerButton>
      </TopPannel>
      <MainContent>
        {content.map((item, index) => (
          <MainItem
            onClick={() => router.push("/clli0trg90002d7w8ibuhws4x/expenses")}
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
