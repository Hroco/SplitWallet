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
  height: ${({ theme }) => theme.balanceBarHeight}px;
  align-items: center;
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
  background-color: ${({ theme }) => theme.colors.bilanceGreenColor};
  width: calc(${(props) => (props.width ? `${props.width}vw` : 'vw')} - 5px);
  height: ${({ theme }) => theme.balanceBarHeight - 10}px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  top: calc(0px - ${({ theme }) => theme.balanceBarHeight / 2 - 5}px);
  z-index: 5;
`;

export const NegativeBalanceBar = styled.div<BalanceBarProps>`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.bilanceRedColor};
  width: calc(${(props) => (props.width ? `${props.width}vw` : 'vw')} - 5px);
  height: ${({ theme }) => theme.balanceBarHeight - 10}px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  top: calc(0px - ${({ theme }) => theme.balanceBarHeight / 2 - 5}px);
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
