import React from 'react';
import { useParams } from 'react-router-dom';

export default function Balances() {
  const { id } = useParams();

  console.log('Balances', id);

  return (
    <>
      <h1>Balances</h1>
    </>
  );
}
