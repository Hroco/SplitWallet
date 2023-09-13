import styled from 'styled-components';

export const SecondaryItemMenu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};

  h1 {
    font-size: 2em;
    text-align: center;
    font-family: sans-serif;
  }

  h3{
    font-size: 1.25em;
  }

  div {
    text-align: center;
    width: 100%;
  }
  h3 {
    margin-bottom: 10px;
  }
`;

export const ThirdItemMenu = styled.div`
  display: flex;
  justify-content: space-between;
  p {
    line-height: 1.25em;
    text-align: left;
  }
`;

export const ImageIconMenu = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundColorLightGrey};
  padding: 10px 0px;
`;
