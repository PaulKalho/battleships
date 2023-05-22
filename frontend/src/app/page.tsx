"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useGlobalContext } from "./context/store";

export default function Home() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const test = searchParams.get("id");
  const [gameId, setGameId] = useState<any>();
  const [name, setName] = useState<string>();
  const { socket } = useGlobalContext();

  useEffect(() => {
    var val = Math.floor(1000 + Math.random() * 9000);

    if (searchParams.get("id") === null) setGameId(val);
    else setGameId(searchParams.get("id"));
  }, []);

  function initGame() {
    //Emit something to the socket-server
    //Joins the player to a game
    // network.init("http://localhost:3001", name, gameId);
    socket.emit("join_game", { name: name, gameId: gameId });
    router.push("/game");
  }

  function handleNameChange(event): void {
    setName(event.target.value);
  }

  return (
    <div>
      <h1>Battleships - Game</h1>
      <p>ID: {gameId}</p>
      <input type="text" placeholder="Name" onChange={handleNameChange}></input>
      <button onClick={initGame}>Play</button>
    </div>
  );
}
