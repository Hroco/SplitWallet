import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import {
  BurgerButton,
  ParticipantInputDiv,
  CategoryButton,
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
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UserListSchema = z.array(
  z.object({
    id: z.string().optional(),
    name: z.string(),
    emailList: z.string().optional(),
    canBeDeleted: z.boolean(),
  })
);

// const ParticipantsSchema = z.array(z.string());

export default function EditWallet() {
  const navigate = useNavigate();
  const { walletId } = useParams();
  const [title, setTitle] = useState<string>('');
  const [decription, setDecription] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [participants, setParticipants] = useState<
    z.infer<typeof UserListSchema>
  >([]);
  const [postResponse, setPostResponse] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const id = walletId;
      const response = await axios.get(`/api/wallets/getWalletById/${id}`);
      console.log('response', response);
      setPostResponse(response.data);
    })();
  }, []);

  useEffect(() => {
    const { wallet } = postResponse || {};
    setWallet(wallet);
  }, [postResponse]);

  useEffect(() => {
    console.log('wallet', wallet);
    if (wallet == undefined) return;
    setTitle(wallet.name);
    setDecription(wallet.description);
    setCurrency(wallet.currency);
    setCategory(wallet.category);
    console.log('participants', participants);

    const walletUsers = wallet.walletUsers;

    if (participants.length == 0) {
      const newParticipants = [...participants];
      for (let i = 0; i < walletUsers.length; i++) {
        const walletUser = walletUsers[i];
        if (walletUser == undefined) throw new Error('User is undefined.');
        const user = walletUser.users;
        const walletItems = walletUser.WalletItem;
        const recieverData = walletUser.RecieverData;

        const canBeDeleted =
          walletItems.length == 0 && recieverData.length == 0;

        if (user == undefined) {
          const newItem = {
            id: walletUser.id,
            name: walletUser.name,
            canBeDeleted: canBeDeleted,
          };
          newParticipants[i] = newItem;
        } else {
          const email = user.email;
          const newItem = {
            id: walletUser.id,
            name: walletUser.name,
            emailList: email,
            canBeDeleted: canBeDeleted,
          };
          newParticipants[i] = newItem;
        }
      }
      setParticipants(newParticipants);
    }
  }, [wallet]);

  function handleAddWallet() {
    /* const userList: z.infer<typeof UserListSchema> = participants.map(
      (item, index) => {
        if (index == 0) {
          return { name: item.name, email: 'samko1311@gmail.com' };
        }
        return { name: name };
      }
    );*/

    const output = {
      name: title,
      description: decription,
      currency: currency,
      category: category,
      userList: participants,
    };

    axios.put(`/api/wallets/editWallet/${walletId}`, output);

    navigate('/');
  }

  function getName(i: number): string {
    if (participants == undefined) return '';
    const output = participants[i];
    if (output == undefined) return '';
    return output.name;
  }

  function setName(i: number, name: string) {
    const newParticipants = [...participants];
    let newParticipant = newParticipants[i];
    if (newParticipant == undefined) {
      newParticipant = { name: '', canBeDeleted: true };
      newParticipants.push(newParticipant);
    }
    newParticipants[i].name = name;
    setParticipants(newParticipants);
  }

  function deleteUser(i: number) {
    const newParticipants = [...participants];
    if (i >= 0 && i < newParticipants.length) {
      if (!newParticipants[i].canBeDeleted) {
        console.error('Cannot delete this user because it is in one of items.');
        return;
      }
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
        <h1>Edit Wallet</h1>
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
            <Label htmlFor="currency">Title</Label>
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
