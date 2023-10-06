import React, { useEffect, useState } from 'react';
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
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { checkmarkOutline } from 'ionicons/icons';
import { useDBFunctions } from '../lib/FrontendDBContext';

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
  const { addWallet } = useDBFunctions();

  async function handleAddWallet() {
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

    /* const outputTemp = {
      name: 'Test 2',
      description: 'Test1 Des',
      currency: 'eur',
      category: 'couple',
      userList: [
        {
          name: 'Samo',
          email: 'samko1311@gmail.com',
        },
        {
          name: 'Isi',
        },
      ],
    };

    console.log('output', outputTemp);*/

    await addWallet(output);

    navigate('/');
  }

  /* useEffect(() => {
    console.log(
      'Component mounted or route changed',
      history.location.pathname
    );
    // Fetch and update data here
  }, [history.location.pathname]);*/

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
      <MainContentItem key={i}>
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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>New Wallet</IonTitle>
          <IonButtons slot="end">
            <IonButton size="large" onClick={() => handleAddWallet()}>
              <IonIcon icon={checkmarkOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonInput
              label="Title"
              labelPlacement="floating"
              counter={true}
              maxlength={50}
              value={title}
              onIonChange={(e) => setTitle(e.detail.value as string)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              label="Description"
              labelPlacement="floating"
              counter={true}
              maxlength={500}
              value={decription}
              onIonChange={(e) => setDecription(e.detail.value as string)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonSelect
              label="Currency"
              placeholder="eur"
              value={currency as string}
              onIonChange={(e) => setCurrency(e.detail.value as string)}
            >
              <IonSelectOption value="eur">Eur</IonSelectOption>
              <IonSelectOption value="usd">Usd</IonSelectOption>
              <IonSelectOption value="czk">Czech Koruna</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <p>
              Specify the curency that will be used to balance the splitwallet.
              Other curencies can be used for expenses.
            </p>
          </IonItem>
          <IonItem>
            <p>Category</p>
            <div>
              <CategoryButton
                data-clicked-state={category == 'trip'}
                onClick={() => setCategory('trip')}
              >
                Trip
              </CategoryButton>
              <CategoryButton
                data-clicked-state={category == 'sharedHouse'}
                onClick={() => setCategory('sharedHouse')}
              >
                Shared house
              </CategoryButton>
              <CategoryButton
                data-clicked-state={category == 'couple'}
                onClick={() => setCategory('couple')}
              >
                Couple
              </CategoryButton>
              <CategoryButton
                data-clicked-state={category == 'event'}
                onClick={() => setCategory('event')}
              >
                Event
              </CategoryButton>
              <CategoryButton
                data-clicked-state={category == 'project'}
                onClick={() => setCategory('project')}
              >
                Project
              </CategoryButton>
              <CategoryButton
                data-clicked-state={category == 'other'}
                onClick={() => setCategory('other')}
              >
                Other
              </CategoryButton>
            </div>
          </IonItem>
        </IonList>
        <MiddlePannel>
          <p>Participants ( x / 50 )</p>
        </MiddlePannel>
        <BottomContent>{participantElements}</BottomContent>
      </IonContent>
    </IonPage>
  );
}
