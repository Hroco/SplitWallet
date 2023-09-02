import styled from "styled-components";

export const MainItemDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 20px;

  h2 {
    font-size: 1em;
  }

  p {
    opacity: 0.8;
  }
`;

export const MainItemHR = styled.hr`
  border: 1px solid ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  margin: 0;
`;