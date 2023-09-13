import styled from 'styled-components';
import { IonFabButton } from '@ionic/react';

interface CategoryButtonProps {
  clicked?: boolean;
}

export const CategoryButton = styled.button<CategoryButtonProps>`
  background-color: ${(props) =>
    props.clicked
      ? `${props.theme.colors.backgroundColorOrange}`
      : `${props.theme.colors.backgroundColorDarkGrey}`};

  color: ${(props) =>
    props.clicked
      ? `${props.theme.colors.backgroundColorDarkGrey}`
      : `${props.theme.colors.backgroundColorOrange}`};

  border: 1px solid
    ${(props) =>
      props.clicked
        ? `${props.theme.colors.backgroundColorDarkGrey}`
        : `${props.theme.colors.backgroundColorOrange}`};
  border-radius: 5px;
  padding: 10px 20px;
  margin: 5px 10px;
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
      ${(props) => (props.rotate ? `${props.rotate}deg` : '0deg')}
    );
  }
`;

export const IonFabButtonOrange = styled(IonFabButton)`
  --background: ${({ theme }) => theme.colors.backgroundColorOrange};
`;

export const NavigationNextItemButton = styled(BurgerButton)`
  justify-content: flex-end;
  gap: 10px;
  text-align: right;
  width: 100px;
`;

export const NavigationPrevItemButton = styled(BurgerButton)`
  justify-content: flex-start;
  gap: 10px;
  text-align: left;
  width: 100px;
`;

export const WalletAddButton = styled.button`
  --add-button-size: 80px;

  position: absolute;
  bottom: calc(var(--add-button-size) / 4);
  right: calc(var(--add-button-size) / 4);

  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.backgroundColorOrange};
  height: var(--add-button-size);
  width: var(--add-button-size);
  outline: none;
  border: none;
`;

export const WalletItemAddButton = styled.button`
  --add-button-size: 60px;

  position: absolute;
  bottom: calc(
    ${({ theme }) => theme.expenseFooterHeight} - var(--add-button-size) / 2
  );
  left: calc(50% - var(--add-button-size) / 2);

  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.backgroundColorOrange};
  height: var(--add-button-size);
  width: var(--add-button-size);
  outline: none;
  border: none;
`;
