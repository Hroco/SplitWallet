import styled from "styled-components";

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

export const MainContent = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundColorLightGrey};
  height: 100%;
  overflow: scroll;
`;

export const AddButton = styled.button`
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.backgroundColorOrange};
  height: 80px;
  width: 80px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  outline: none;
  border: none;
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
