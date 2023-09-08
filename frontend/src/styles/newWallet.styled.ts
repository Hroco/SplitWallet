import styled from 'styled-components';

export const MainContentItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

export const ParticipantInputDiv = styled.div`
  display: flex;

  div {
    display: flex;
    flex-direction: column;
    width: 75%;
  }

  button {
    width: 25%;
    margin: 10px 10px 0px 10px;
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
