import styled from 'styled-components';

export const Input = styled.input`
  outline: none;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.mainFontColor};
  color: ${({ theme }) => theme.colors.mainFontColor};
  background-color: ${({ theme }) => theme.colors.backgroundColorLightGrey};
`;

export const Select = styled.select`
  outline: none;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.mainFontColor};
  color: ${({ theme }) => theme.colors.mainFontColor};
  background-color: ${({ theme }) => theme.colors.backgroundColorLightGrey};
`;

export const Label = styled.label``;
