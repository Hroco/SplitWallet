import React, { useState } from 'react';
import { z } from 'zod';
import { BurgerButton, CategoryButton } from '../styles/buttons.styled';
import {
  ParticipantInputDiv,
  MainContentItem,
} from '../styles/newWallet.styled';
import {
  TopPannel,
  MainContent,
  MiddlePannel,
  BottomContent,
  Navbar,
} from '../styles/mainContainers.styled';
import { Input, Select, Label } from '../styles/Input.styled';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import CheckedIcon from '-!svg-react-loader!../assets/icons/checked.svg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserListSchema = z.array(
  z.object({ name: z.string(), emailList: z.string().optional() })
);

const ParticipantsSchema = z.array(z.string());

export default function NewWallet() {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>('');
  const [decription, setDecription] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [participants, setParticipants] = useState<
    z.infer<typeof ParticipantsSchema>
  >([]);

  function handleAddWallet() {
    const userList: z.infer<typeof UserListSchema> = participants.map(
      (name, index) => {
        if (index == 0) {
          return { name: name, email: 'samko1311@gmail.com' };
        }
        return { name: name };
      }
    );

    const output = {
      name: title,
      description: decription,
      currency: currency,
      category: category,
      userList: userList,
    };

    axios.post('/api/wallets/addWallet/', output);

    navigate('/');
  }

  function getName(i: number): string {
    if (participants == undefined) return '';
    const output = participants[i];
    if (output == undefined) return '';
    return output;
  }

  function setName(i: number, name: string) {
    const newParticipants = [...participants];
    newParticipants[i] = name;
    setParticipants(newParticipants);
  }

  function deleteUser(i: number) {
    const newParticipants = [...participants];
    if (i >= 0 && i < newParticipants.length) {
      newParticipants.splice(i, 1);
      setParticipants(newParticipants);
    } else {
      console.error('Invalid index');
    }
  }

  const participantElements = [];
  for (let i = 0; i < participants.length + 1; i++) {
    participantElements.push(
      <MainContentItem>
        <ParticipantInputDiv>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={getName(i)}
              onChange={(e) => setName(i, e.target.value)}
            />
          </div>
          {getName(i) != '' && (
            <button onClick={() => deleteUser(i)}>Delete</button>
          )}
        </ParticipantInputDiv>
      </MainContentItem>
    );
  }

  return (
    <>
      <Navbar>
        <BurgerButton onClick={() => navigate('/')}>
          <BackIcon />
        </BurgerButton>
        <h1>New Wallet</h1>
        <BurgerButton onClick={() => handleAddWallet()}>
          <CheckedIcon />
        </BurgerButton>
      </Navbar>
      <MainContent>
        <TopPannel>
          <MainContentItem>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </MainContentItem>
          <MainContentItem>
            <Label htmlFor="description">Description</Label>
            <Input
              type="text"
              id="description"
              value={decription}
              onChange={(e) => setDecription(e.target.value)}
            />
          </MainContentItem>
          <MainContentItem>
            <Label htmlFor="currency">Currency</Label>
            <Select
              id="currency"
              value={currency as string}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="eur">Eur</option>
              <option value="usd">Usd</option>
              <option value="czk">Czech Koruna</option>
            </Select>
          </MainContentItem>
          <MainContentItem>
            <p>
              Specify the curency that will be used to balance the splitwallet.
              Other curencies can be used for expenses.
            </p>
          </MainContentItem>
          <MainContentItem>
            <p>Category</p>
            <div>
              <CategoryButton
                clicked={category == 'trip'}
                onClick={() => setCategory('trip')}
              >
                Trip
              </CategoryButton>
              <CategoryButton
                clicked={category == 'sharedHouse'}
                onClick={() => setCategory('sharedHouse')}
              >
                Shared house
              </CategoryButton>
              <CategoryButton
                clicked={category == 'couple'}
                onClick={() => setCategory('couple')}
              >
                Couple
              </CategoryButton>
              <CategoryButton
                clicked={category == 'event'}
                onClick={() => setCategory('event')}
              >
                Event
              </CategoryButton>
              <CategoryButton
                clicked={category == 'project'}
                onClick={() => setCategory('project')}
              >
                Project
              </CategoryButton>
              <CategoryButton
                clicked={category == 'other'}
                onClick={() => setCategory('other')}
              >
                Other
              </CategoryButton>
            </div>
          </MainContentItem>
        </TopPannel>
        <MiddlePannel>
          <p>Participants ( x / 50 )</p>
        </MiddlePannel>
        <BottomContent>{participantElements}</BottomContent>
      </MainContent>
    </>
  );
}
