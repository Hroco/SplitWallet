import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MainItemPage() {
  const router = useRouter();
  // console.log("router.query", router.query);
  const { id } = router.query;

  useEffect(() => {
    // console.log("MainItemPage", id);
  }, [id]);

  if (!router.isReady) {
    return null;
  }

  return (
    <>
      <h1>Open Wallet Item</h1>
    </>
  );
}
