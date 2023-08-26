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

export default function Home() {
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
            key={index}
            name={item.name}
            description={item.description}
          />
        ))}
      </MainContent>
      <AddButton>
        <Image priority src={AddIcon} alt="add icon" />
      </AddButton>
    </>
  );
}
