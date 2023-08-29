import Image from "next/image";
import { z } from "zod";
import { api } from "~/utils/api";
import {
  TopPannel,
  MainContent,
  BurgerButton,
  MiddlePannel,
  BottomContent,
  ParticipantInputDiv,
  CategoryButton,
} from "../styles/newWallet.styled";
import BackIcon from "../assets/icons/back.svg";
import CheckedIcon from "../assets/icons/checked.svg";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession } from "next-auth/react";

const UserListSchema = z.array(
  z.object({ name: z.string(), emailList: z.string().optional() })
);

const ParticipantsSchema = z.array(z.string());

export default function Home() {
  const session = useSession();
  const user = session.data?.user;

  const [title, setTitle] = useState<string>("");
  const [decription, setDecription] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [participants, setParticipants] = useState<
    z.infer<typeof ParticipantsSchema>
  >([]);

  const router = useRouter();
  const editCutomerById = api.wallet.addWallet.useMutation({
    onSuccess: () => {
      // console.log("success");
    },
  });

  function handleAddWallet() {
    // console.log(participants);

    const userList: z.infer<typeof UserListSchema> = participants.map(
      (name, index) => {
        if (index == 0) {
          /*if (user == undefined) throw new Error("User doesnt exist.");
          const email = user.email;
          if (email == undefined) throw new Error("User doesnt have email.");

          return { name: name, emailList: [email] };*/
          return { name: name, email: "samko1311@gmail.com" };
        }
        return { name: name };
      }
    );

    // console.log(userList);
    editCutomerById.mutate({
      name: title,
      description: decription,
      currency: currency,
      category: category,
      userList: userList,
    });

    /*router.push("/");*/
  }

  function getName(i: number): string {
    if (participants == undefined) return "";
    const output = participants[i];
    if (output == undefined) return "";
    return output;
  }

  function setName(i: number, name: string) {
    const newParticipants = [...participants];
    newParticipants[i] = name;
    setParticipants(newParticipants);
  }

  const participantElements = [];
  for (let i = 0; i < participants.length + 1; i++) {
    participantElements.push(
      <ParticipantInputDiv>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={getName(i)}
            onChange={(e) => setName(i, e.target.value)}
          />
        </div>
        <button>Add</button>
      </ParticipantInputDiv>
    );
  }

  return (
    <>
      <TopPannel>
        <BurgerButton onClick={() => router.push("/")}>
          <Image priority src={BackIcon} alt="add icon" />
        </BurgerButton>
        <h1>New Wallet</h1>
        <BurgerButton onClick={() => handleAddWallet()}>
          <Image priority src={CheckedIcon} alt="add icon" />
        </BurgerButton>
      </TopPannel>
      <MainContent>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          value={decription}
          onChange={(e) => setDecription(e.target.value)}
        />
        <label htmlFor="currency">Title</label>
        <select
          id="currency"
          value={currency as string}
          onChange={(e) => setCurrency(e.target.value)}
        >
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
          <CategoryButton
            clicked={category == "trip"}
            onClick={() => setCategory("trip")}
          >
            Trip
          </CategoryButton>
          <CategoryButton
            clicked={category == "sharedHouse"}
            onClick={() => setCategory("sharedHouse")}
          >
            Shared house
          </CategoryButton>
          <CategoryButton
            clicked={category == "couple"}
            onClick={() => setCategory("couple")}
          >
            Couple
          </CategoryButton>
          <CategoryButton
            clicked={category == "event"}
            onClick={() => setCategory("event")}
          >
            Event
          </CategoryButton>
          <CategoryButton
            clicked={category == "project"}
            onClick={() => setCategory("project")}
          >
            Project
          </CategoryButton>
          <CategoryButton
            clicked={category == "other"}
            onClick={() => setCategory("other")}
          >
            Other
          </CategoryButton>
        </div>
      </MainContent>
      <MiddlePannel>
        <p>Participants ( x / 50 )</p>
      </MiddlePannel>
      <BottomContent>{participantElements}</BottomContent>
    </>
  );
}
