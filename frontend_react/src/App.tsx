import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewWallet from './pages/NewWallet';
import Add from './pages/Add';
import Balances from './pages/Balances';
import Expenses from './pages/Expenses';
import Feed from './pages/Feed';
import Open from './pages/Open';
import Edit from './pages/Edit';
import EditWallet from './pages/EditWallet';
import MySettings from './pages/MySettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Routes>
        <Route path="/:walletId/add" element={<Add />} />
      </Routes>
      <Routes>
        <Route path="/:walletId/edit" element={<EditWallet />} />
      </Routes>
      <Routes>
        <Route path="/:walletId/:walletItemId/edit" element={<Edit />} />
      </Routes>
      <Routes>
        <Route path="/:walletId/balances" element={<Balances />} />
      </Routes>
      <Routes>
        <Route path="/:walletId/expenses" element={<Expenses />} />
      </Routes>
      <Routes>
        <Route path="/:walletId/feed" element={<Feed />} />
      </Routes>
      <Routes>
        <Route path="/:walletId/:walletItemId/open" element={<Open />} />
      </Routes>
      <Routes>
        <Route path="/newWallet" element={<NewWallet />} />
      </Routes>
      <Routes>
        <Route path="/mysettings" element={<MySettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
