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
