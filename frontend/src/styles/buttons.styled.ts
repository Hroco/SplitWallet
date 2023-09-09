import styled from 'styled-components';

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

export const WalletAddButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;

  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.backgroundColorOrange};
  height: 80px;
  width: 80px;
  outline: none;
  border: none;
`;

export const WalletItemAddButton = styled.button`
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
