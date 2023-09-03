import styled from 'styled-components';

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

export const BalanceItemDiv = styled.div`
  display: flex;
  justify-content: space-between;

  p {
    width: 50%;
    z-index: 7;
  }
  & > div {
    width: 0%;
    position: relative;
    z-index: 6;
  }
`;

interface BalanceBarProps {
  width?: number;
}

export const PositiveBalanceBar = styled.div<BalanceBarProps>`
  position: absolute;
  background-color: green;
  width: ${(props) => (props.width ? `${props.width}vw` : 'vw')};
  height: 100%;
  top: 0;
  z-index: 5;
`;

export const NegativeBalanceBar = styled.div<BalanceBarProps>`
  position: absolute;
  background-color: red;
  width: ${(props) => (props.width ? `${props.width}vw` : 'vw')};
  height: 100%;
  top: 0;
  right: 0;
  z-index: 5;
`;

export const MainItemHR = styled.hr`
  border: 1px solid ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  margin: 0;
`;

export const BalanceItemPLeft = styled.p`
  text-align: right;
  margin-right: 10px;
`;

export const BalanceItemPRight = styled.p`
  text-align: left;
  margin-left: 10px;
`;
