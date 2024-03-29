"use client";
import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

type Player = "X" | "O" | null;

const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [nextPlayer, setNextPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);

  const [level, setLevel] = useState<string>("");
  const router = useRouter()

  const handleChange = (event: SelectChangeEvent<string>) => {
    setLevel(event.target.value);
  };

  const handleClick = (index: number) => {
    if (board[index] === null && !winner) {
      const newBoard = [...board];
      newBoard[index] = nextPlayer;
      setBoard(newBoard);
      setNextPlayer(nextPlayer === "X" ? "O" : "X");
      checkWinner(newBoard);
    }
  };

  const checkWinner = (board: Player[]) => {
    const winningCombos: number[][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }

    if (board.every((cell) => cell !== null)) {
      setWinner("Draw");
    }
  };

  const renderCell = (index: number) => {
    return (
      <button className="cell" onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
      });
  
      if (response.ok) {
        router.push("/Login"); 
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-96 mt-2">
          <FormControl sx={{ m: 1, minWidth: 300 }} className="">
            <InputLabel id="demo-simple-select-standard-label">
              Level
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={level}
              onChange={handleChange}
              label="Age"
            >
              <MenuItem value={10}>Easy</MenuItem>
              <MenuItem value={20}>Medium</MenuItem>
              <MenuItem value={30}>Difficulty</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="game mt-20">
          <div className="board">
            {board.map((_, index) => (
              <div key={index} className="cell-container">
                {renderCell(index)}
              </div>
            ))}
          </div>
          <div className="status">
            {winner
              ? winner === "Draw"
                ? "Lose The Game"
                : `Winner: ${winner}`
              : `Next player: ${nextPlayer}`}
          </div>
        </div>
        <Button
          variant="outlined"
          className="ml-5 text-white bg-black hover:bg-gray-800"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </>
  );
};

export default TicTacToeGame;
