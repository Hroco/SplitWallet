import styled from 'styled-components';

export const TopPannel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  padding: 5px;

  h1 {
    font-size: 1.5em;
    margin-left: 15px;
  }
`;

export const MiddlePannel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  padding: 5px;

  h1 {
    font-size: 1.5em;
    margin-left: 15px;
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.backgroundColorLightGrey};

  p {
    font-size: 0.9em;
  }
`;

export const BottomContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.backgroundColorLightGrey};
`;

export const ParticipantInputDiv = styled.div`
  display: flex;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 75%;
  }

  input {
    /*width: 25%;*/
    margin: 10px 10px 10px 10px;
    border: 0;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.colors.backgroundColorOrange};
    outline: none;
  }
`;

export const BurgerButton = styled.button`
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  height: 50px;
  width: 50px;
  outline: none;
  border: none;
  cursor: pointer;
`;
