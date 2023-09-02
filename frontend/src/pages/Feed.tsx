import React from 'react';
import { useParams } from 'react-router-dom';

export default function Feed() {
  const { id } = useParams();

  console.log('MainItemPage', id);

  return (
    <>
      <h1>Feed</h1>
    </>
  );
}
