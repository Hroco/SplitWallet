import styled, { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
  }

  body {
    background: ${({ theme }) => theme.colors.backgroundColorDarkGrey};
    font-family: 'Poppins', sans-serif;
    font-size: 1.15em;
    color: ${({ theme }) => theme.colors.mainFontColor};
    margin: 0;
  }

  p {
    line-height: 1.5;
  }

  img {
    max-width: 100%;
}
`;

export const AppWrapper = styled.div`
  height: 100vh;
  width: 100vw;
`;

export default GlobalStyles;
