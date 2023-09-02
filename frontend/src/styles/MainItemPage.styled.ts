import styled from "styled-components";

export const TopPannel = styled.div`
  position: sticky;
  width: 100%;
  height: 100px;
  top: 0;
  z-index: 10;

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

export const BottomPannel = styled.div`
  position: sticky;
  width: 100%;
  height: 100px;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  padding: 5px;

  h2 {
    font-size: 1em;
  }

  p {
    opacity: 0.8;
  }
`;

export const MainContent = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundColorLightGrey};
  height: 100%;
  overflow: scroll;
`;

export const AddButton = styled.button`
  position: absolute;
  bottom: calc(100px - 40px);
  left: calc(50% - 40px);

  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.backgroundColorOrange};
  height: 80px;
  width: 80px;
  outline: none;
  border: none;
`;

export const ExpenseButton = styled.button`
  display: flex;
  align-items: center;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  height: 50px;
  width: 50%;
  outline: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.mainFontColor};
  text-align: center;
  margin: auto;
  justify-content: center;
`;

interface BurgerButtonProps {
  rotate?: string;
}

export const BurgerButton = styled.button<BurgerButtonProps>`
  display: flex;
  align-items: center;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  height: 50px;
  width: 50px;
  outline: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.mainFontColor};
  text-align: center;

  img {
    transform: rotate(
      ${(props) => (props.rotate ? `${props.rotate}deg` : "0deg")}
    );
  }
`;