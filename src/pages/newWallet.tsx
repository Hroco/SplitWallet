import Image from "next/image";
import {
  TopPannel,
  MainContent,
  BurgerButton,
  MiddlePannel,
  BottomContent,
  ParticipantInputDiv,
} from "../styles/newWallet.styled";
import BackIcon from "../assets/icons/back.svg";
import CheckedIcon from "../assets/icons/checked.svg";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <TopPannel>
        <BurgerButton onClick={() => router.push("/")}>
          <Image priority src={BackIcon} alt="add icon" />
        </BurgerButton>
        <h1>New Wallet</h1>
        <BurgerButton onClick={() => router.push("/")}>
          <Image priority src={CheckedIcon} alt="add icon" />
        </BurgerButton>
      </TopPannel>
      <MainContent>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" />
        <label htmlFor="description">Description</label>
        <input type="text" id="description" />
        <label htmlFor="curency">Title</label>
        <select id="curency">
          <option value="eur">Eur</option>
          <option value="usd">Usd</option>
          <option value="czk">Czech Koruna</option>
        </select>
        <p>
          Specify the curency that will be used to balance the splitwallet.
          Other curencies can be used for expenses.
        </p>
        <p>Category</p>
        <div>
          <button>Trip</button>
          <button>Shared house</button>
          <button>Couple</button>
          <button>Event</button>
          <button>Project</button>
          <button>Other</button>
        </div>
      </MainContent>
      <MiddlePannel>
        <p>Participants ( x / 50 )</p>
      </MiddlePannel>
      <BottomContent>
        <ParticipantInputDiv>
          <div>
            <label htmlFor="name">My name</label>
            <input type="text" id="name" />
          </div>
          <button>Add</button>
        </ParticipantInputDiv>
        <ParticipantInputDiv>
          <div>
            <label htmlFor="otherName">Other participant</label>
            <input type="text" id="otherName" />
          </div>
          <button>Add</button>
        </ParticipantInputDiv>
        <ParticipantInputDiv>
          <div>
            <label htmlFor="otherName2">Other participant</label>
            <input type="text" id="otherName2" />
          </div>
          <button>Add</button>
        </ParticipantInputDiv>
      </BottomContent>
    </>
  );
}
