import React, { useEffect, useState } from 'react';
import {
  MainContent,
  TopPannel,
  MiddlePannel,
  BottomContent,
  Navbar,
} from '../styles/mainContainers.styled';
import { MainContentItem } from '../styles/newWallet.styled';
import { Input, Select, Label } from '../styles/Input.styled';
import { ParticipantInputDiv } from '../styles/newWalletItem.styled';
import { BurgerButton } from '../styles/buttons.styled';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import CheckedIcon from '-!svg-react-loader!../assets/icons/checked.svg';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { set } from 'mongoose';
import LoadingScreen from '../components/LoadingScreen';

const ParticipantsSchema = z.array(
  z.object({
    id: z.string(),
    checked: z.boolean(),
    cutFromAmount: z.number(),
  })
);

const OutputParticipantsSchema = z.array(
  z.object({
    id: z.string(),
    cutFromAmount: z.number(),
  })
);

const WalletItemSchema = z.object({
  walletId: z.string(),
  name: z.string(),
  amount: z.number(),
  date: z.date(),
  payer: z.string(),
  tags: z.string().optional(),
  recieversData: z.array(
    z.object({ id: z.string(), cutFromAmount: z.number() })
  ),
  type: z.string(),
});

function arraysAreEqual(arr1: any, arr2: any) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
      return false;
    }
  }

  return true;
}

export default function Edit() {
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [payerId, setPayerId] = useState<string>('');
  const [type, setType] = useState<string>('expense');
  const [mainCheckBoxMode, setMainCheckBoxMode] = useState<string>('checked');
  const [participants, setParticipants] = useState<
    z.infer<typeof ParticipantsSchema>
  >([]);
  const [postResponse, setPostResponse] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [postResponse2, setPostResponse2] = useState<any>(null);
  const [walletItem, setWalletItem] = useState<any>(null);

  const { walletId, walletItemId } = useParams();
  const navigate = useNavigate();

  if (walletId == undefined) throw new Error('WalletId is undefined.');
  if (typeof walletId != 'string') throw new Error('WalletId is not string.');

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
    (async () => {
      const id = walletItemId;
      const response = await axios.get(
        `/api/wallets/getWalletItemByWalletItemId/${id}`
      );
      console.log('walletItem in response Edit', response.data);
      setPostResponse2(response.data);
    })();
  }, []);

  useEffect(() => {
    const { walletItem } = postResponse2 || {};
    console.log('walletItem in Edit', walletItem);
    console.log('walletItem in Edit', walletItem);
    setWalletItem(walletItem);
  }, [postResponse2]);

  useEffect(() => {
    console.log('walletItem in Edit', walletItem);
    if (walletItem == undefined) return;
    setTitle(walletItem.name);
    setAmount(walletItem.amount);
    setDate(new Date(walletItem.date));
    setPayerId(walletItem.payer.id);
    setType(walletItem.type);
    console.log('participants', participants);

    if (wallet == undefined) return;
    const walletUsers = wallet.walletUsers;

    if (participants.length == 0) {
      const newParticipants = [...participants];
      for (let i = 0; i < walletUsers.length; i++) {
        const walletUser = walletUsers[i];
        if (walletUser == undefined) throw new Error('User is undefined.');

        const existingReceiver = walletItem.recievers.find(
          (reciever: any) => reciever.reciever.id === walletUser.id
        );

        if (existingReceiver == undefined) {
          const newItem = {
            id: walletUser.id,
            cutFromAmount: 0,
            checked: false,
          };
          newParticipants[i] = newItem;
        } else {
          const newItem = {
            id: walletUser.id,
            cutFromAmount: existingReceiver.amount,
            checked: true,
          };
          newParticipants[i] = newItem;
        }
      }
      setParticipants(newParticipants);
    }

    const newParticipants = participants.map((participant) => {
      return {
        ...participant,
        checked: true,
      };
    });

    console.log('newParticipants', newParticipants);
    // setParticipants()
  }, [walletItem]);

  useEffect(() => {
    const numberOfCheckedUsers = participants.filter(
      (participant) => participant.checked === true
    ).length;
    if (numberOfCheckedUsers > 0) {
      const newUserAmount = amount / numberOfCheckedUsers;

      // Use map to create a new array with updated amount for checked participants
      const updatedParticipants = participants.map((participant) => {
        if (participant.checked) {
          return {
            ...participant,
            cutFromAmount: newUserAmount,
          };
        } else {
          return {
            ...participant,
            cutFromAmount: 0,
          };
        }
        return participant; // for unchecked participants, keep the original object
      });

      // Update the state with the new array of participants
      if (!arraysAreEqual(updatedParticipants, participants)) {
        // console.log('updatedParticipants', updatedParticipants);
        // console.log('participants', participants);
        setParticipants(updatedParticipants);
      }
    }
  }, [amount, participants]);

  function handleMainCheckBoxClick() {
    if (mainCheckBoxMode == 'checked') {
      setMainCheckBoxMode('unchecked');
      setParticipants(
        participants.map((participant) => {
          return {
            ...participant,
            checked: false,
          };
        })
      );
    } else if (
      mainCheckBoxMode == 'unchecked' ||
      mainCheckBoxMode == 'crossed'
    ) {
      setMainCheckBoxMode('checked');
      setParticipants(
        participants.map((participant) => {
          return {
            ...participant,
            checked: true,
          };
        })
      );
    }
  }

  useEffect(() => {
    // update state of main checbox to one of three posible states
    const numberOfCheckedUsers = participants.filter(
      (participant) => participant.checked === true
    ).length;

    if (numberOfCheckedUsers == participants.length)
      setMainCheckBoxMode('checked');
    else if (numberOfCheckedUsers == 0) setMainCheckBoxMode('unchecked');
    else setMainCheckBoxMode('crossed');
  }, [participants]);

  /* useEffect(() => {
    if (wallet == undefined) return;
    const walletUsers = wallet.walletUsers;

    if (participants.length == 0) {
      const newParticipants = [...participants];
      for (let i = 0; i < walletUsers.length; i++) {
        const walletUser = walletUsers[i];
        if (walletUser == undefined) throw new Error('User is undefined.');

        const newItem = {
          id: walletUser.id,
          cutFromAmount: 0,
          checked: true,
        };
        newParticipants[i] = newItem;
      }
      setParticipants(newParticipants);
    }

    // line below is for testing and it should be replaced with user id from seesion
    const currentWalletUser = walletUsers.find(
      (walletUser: any) => walletUser.userId === 'clls52cn30000d7vgfv1jx5el'
    );
    if (currentWalletUser == undefined) throw new Error('User is undefined.');

    // if (payerId == '') setPayerId(currentWalletUser.id);
  }, [postResponse]);*/

  // if (wallet == undefined) return <LoadingScreen />;

  function handleEditWalletItem() {
    const numberOfCheckedUsers = participants.filter(
      (participant) => participant.checked === true
    ).length;

    if (numberOfCheckedUsers == 0)
      throw new Error('The amount should concert at least one participant.');
    if (walletId == undefined) throw new Error('WalletId is undefined.');
    if (typeof walletId != 'string') throw new Error('WalletId is not string.');

    const participantData: z.infer<typeof OutputParticipantsSchema> = [];

    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      if (!participant) throw new Error('Participant is undefined.');

      if (participant.checked) {
        participantData.push({
          id: participant.id,
          cutFromAmount: participant.cutFromAmount,
        });
      }
    }

    const newWalletItem: z.infer<typeof WalletItemSchema> = {
      walletId: walletId,
      name: title,
      amount: amount,
      date: date,
      payer: payerId,
      tags: 'Beer',
      recieversData: participantData,
      type: type,
    };

    axios.put(`/api/wallets/editWalletItem/${walletItemId}`, newWalletItem);

    navigate(`/${walletId}/expenses`);
  }

  function getCutFromAmount(i: number): string {
    if (participants == undefined) return '';
    const output = participants[i];
    if (output == undefined) return '';
    return output.cutFromAmount.toString();
  }

  function setCutFromAmount(i: number, cut: number) {
    const newParticipants = [...participants];
    const newItem = newParticipants[i];

    if (newItem == undefined) return;

    newItem.cutFromAmount = cut;
    setParticipants(newParticipants);
  }

  function getCheckedStatus(i: number): boolean {
    if (participants == undefined) return false;
    const output = participants[i];
    if (output == undefined) return false;
    return output.checked;
  }

  function setCheckedStatus(i: number, state: boolean) {
    const newParticipants = [...participants];
    const newItem = newParticipants[i];

    if (newItem == undefined) return;

    newItem.checked = state;
    setParticipants(newParticipants);
  }

  if (wallet == undefined) return <LoadingScreen />;
  if (participants == undefined) return <LoadingScreen />;

  const walletUsers = wallet.walletUsers;

  // console.log('participants', participants);

  const participantElements = [];
  for (let i = 0; i < walletUsers.length; i++) {
    const user = walletUsers[i];
    if (user == undefined) throw new Error('User is undefined.');

    const state = getCheckedStatus(i);

    participantElements.push(
      <ParticipantInputDiv key={i}>
        <div>
          <Input
            type="checkbox"
            id="name"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setCheckedStatus(i, event.target.checked)
            }
            checked={state}
          />
          <Label htmlFor="name">{user.name}</Label>
        </div>

        <Input
          type="number"
          value={getCutFromAmount(i)}
          onChange={(e) => setCutFromAmount(i, parseInt(e.target.value))}
        />
      </ParticipantInputDiv>
    );
  }

  function setHeading() {
    if (type == 'expense') return 'Edit expense';
    if (type == 'income') return 'Edit income';
    if (type == 'moneyTransfer') return 'Edit money transfer';
  }

  function setLabel() {
    if (type == 'expense') return 'Paid by';
    if (type == 'income') return 'Recieved by';
    if (type == 'moneyTransfer') return 'Paid by';
  }

  return (
    <>
      <Navbar>
        <BurgerButton onClick={() => navigate(`/${walletId}/expenses`)}>
          <BackIcon />
        </BurgerButton>
        <h1>{setHeading()}</h1>
        <BurgerButton onClick={() => handleEditWalletItem()}>
          <CheckedIcon />
        </BurgerButton>
      </Navbar>
      <MainContent>
        <TopPannel>
          <MainContentItem>
            <Select
              value={type as string}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="moneyTransfer">Money Transfer</option>
            </Select>
          </MainContentItem>
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
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </MainContentItem>
          <MainContentItem>
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              id="date"
              value={date.toISOString().split('T')[0]}
              onChange={(e) => setDate(new Date(e.target.value))}
            />
          </MainContentItem>
          <MainContentItem>
            <Label htmlFor="payer">{setLabel()}</Label>
            <Select
              id="payer"
              value={payerId as string}
              onChange={(e) => setPayerId(e.target.value)}
            >
              {walletUsers &&
                walletUsers.map((walletUser: any, index: number) => (
                  <option key={walletUser.id} value={walletUser.id}>
                    {walletUser.name}
                  </option>
                ))}
            </Select>
          </MainContentItem>
        </TopPannel>
        <MiddlePannel>
          <button onClick={handleMainCheckBoxClick}>{mainCheckBoxMode}</button>
          <p>For whom</p>
          <button>Advanced</button>
        </MiddlePannel>
        <BottomContent>{participantElements}</BottomContent>
      </MainContent>
    </>
  );
}
