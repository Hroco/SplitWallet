import styled from 'styled-components';

export const ReimbursementItemDiv = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.backgroundColorWhite};
  border-radius: 5px;
  margin-bottom: 20px;

  button {
    border: none;
    background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};
    color: ${({ theme }) => theme.colors.fontColorOrange};
    font-size: 1em;
    padding: 10px 10px;
    border-top: 1px solid ${({ theme }) => theme.colors.backgroundColorWhite};
  }
`;

export const ReimbursementDataDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;

  h2 {
    color: ${({ theme }) => theme.colors.fontColorOrange};
  }
`;

export const MainItemHR = styled.hr`
  border: 1px solid ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  margin: 0;
`;
