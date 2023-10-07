import styled from 'styled-components';

export const Dialog = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const Menu = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundColorLightGrey};
  position: absolute;
  right: 0;
  top: 0;
  width: 250px;
  height: fit-content;
  padding-bottom: 10px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.backgroundColorDarkGrey};
`;

export const ButtonBase = styled.button`
  color: ${({ theme }) => theme.colors.mainFontColor};
  background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.mainBrownHover};
  }
`;

export const Button = styled(ButtonBase)`
  margin: auto;
  gap: 15px;
  color: ${({ theme }) => theme.colors.mainFontLightColor};
  width: 90%;
  margin-top: 10px;
  padding: 10px 20px;
  font-size: large;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-align: center;

  &:hover {
    color: ${({ theme }) => theme.colors.mainRed};
  }
`;
