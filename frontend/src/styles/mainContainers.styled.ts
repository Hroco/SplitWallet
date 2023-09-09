import styled from 'styled-components';

export const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  height: ${({ theme }) => theme.navbarHeight};
  padding: 5px;

  h1 {
    font-size: 1.5em;
    margin-left: 15px;
  }
`;
Navbar.displayName = 'Navbar';

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.backgroundColorLightGrey};
  height: calc(100% - ${({ theme }) => theme.navbarHeight});
  overflow: auto;
  p {
    font-size: 0.9em;
  }
`;

export const BalancesMainContent = styled(MainContent)`
  height: calc(100% - 2 * ${({ theme }) => theme.navbarHeight});
`;

export const ExpenseMainContent = styled(MainContent)`
  height: calc(
    100% - 2 * ${({ theme }) => theme.navbarHeight} -
      ${({ theme }) => theme.expenseFooterHeight}
  );
`;

export const OpenMainContent = styled(MainContent)`
  height: calc(
    100% - ${({ theme }) => theme.navbarHeight} -
      ${({ theme }) => theme.openFooterHeight}
  );
`;

export const TopPannel = styled.div`
  padding: 20px 20px;
`;

export const MiddlePannel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  padding: 20px 20px;

  h1 {
    font-size: 1.5em;
    margin-left: 15px;
  }
`;

export const BottomContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.backgroundColorLightGrey};
  padding: 20px 20px;
  height: max-content;
`;

export const ExpenseFooter = styled.div`
  position: absolute;
  width: 100%;
  height: ${({ theme }) => theme.expenseFooterHeight};
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  padding: 20px 20px;

  h2 {
    font-size: 1em;
  }

  p {
    opacity: 0.8;
  }
`;

export const FeedFooter = styled.div`
  position: absolute;
  width: 100%;
  height: ${({ theme }) => theme.feedFooterHeight};
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  padding: 5px;

  h2 {
    font-size: 1em;
  }

  p {
    opacity: 0.8;
  }
`;

export const OpenFooter = styled.div`
  position: absolute;
  width: 100%;
  height: ${({ theme }) => theme.openFooterHeight};
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundColorDarkGrey};
  padding: 5px;

  h2 {
    font-size: 1em;
  }

  p {
    opacity: 0.8;
  }
`;
