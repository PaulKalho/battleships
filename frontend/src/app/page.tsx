"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useGlobalContext } from "./context/store";

export default function Home() {
  return (
    <div>
      <h1>Battleships - Game</h1>
    </div>
  );
}
