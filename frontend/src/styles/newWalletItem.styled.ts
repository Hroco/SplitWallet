import styled from 'styled-components';

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
