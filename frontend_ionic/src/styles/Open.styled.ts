import styled from 'styled-components';

export const SecondaryItemMenu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};

  h1 {
    font-size: 1.5em;
    margin-left: 15px;
    text-align: center;
  }

  p {
    line-height: 1.25em;
    text-align: center;
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
