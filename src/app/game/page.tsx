"use client";
import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useRouter } from "next/navigation";

const TicTacToeGame = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [nextPlayer, setNextPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [level, setLevel] = useState("");

  useEffect(() => {
    const sessionStatus = localStorage.getItem("sessionStatus");
    if (sessionStatus == "true") {
      router.push("/game");
      startNewGame();
    } else {
      router.push("/");
    }
  }, []);

  const getGame = () => {
    const token = localStorage.getItem("token");
    try {
      axios.get("http://localhost:3000/user/game", {
        headers: {
          authorization: token,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const startNewGame = async () => {
    try {
      await axios.post("http://localhost:3000/user/start-game");
      setBoard(Array(9).fill(null));
      setNextPlayer("X");
      setWinner(null);
    } catch (error) {
      console.error("Error");
    }
  };

  const makeMove = async (index) => {
    try {
      if (winner || board[index] !== null) return;

      await axios.post("http://localhost:3000/user/make-move", { index });

      const newBoard = [...board];
      newBoard[index] = nextPlayer;
      setBoard(newBoard);
      setNextPlayer(nextPlayer === "X" ? "O" : "X");
      const winningPlayer = checkWinner(newBoard);
      if (winningPlayer) {
        setWinner(winningPlayer);
      }
    } catch (error) {
      console.error("Error");
    }
  };

  const checkWinner = (board) => {
    const winningCombos = [
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
        return board[a];
      }
    }

    if (board.every((cell) => cell !== null)) {
      return "Draw";
    }

    return null;
  };

  const handleLevelChange = (event) => {
    setLevel(event.target.value);
  };

  const handleCellClick = (index) => {
    makeMove(index);
  };

  const renderCell = (index) => {
    return (
      <button className="cell" onClick={() => handleCellClick(index)}>
        {board[index]}
      </button>
    );
  };

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/logout", {
        method: "POST",
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.setItem("sessionStatus", "false");
        router.push("/Login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen border-white-300">
      <div className="w mt-2">
        <FormControl sx={{ m: 1, minWidth: 300, border: "1px solid white" }}>
          <InputLabel id="level-label" className="text-white">
            Level
          </InputLabel>
          <Select
            labelId="level-label"
            id="level-select"
            value={level}
            className="text-white"
            onChange={handleLevelChange}
          >
            <MenuItem value={"Easy"}>Easy</MenuItem>
            <MenuItem value={"Medium"}>Medium</MenuItem>
            <MenuItem value={"Difficulty"}>Difficulty</MenuItem>
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
        <div className="status text-white">
          {winner
            ? winner === "Draw"
              ? "Lose The Game"
              : `Winner: ${winner}`
            : `Next player: ${nextPlayer}`}
        </div>
      </div>
      <Button
        variant="outlined"
        className="mt-5 bg-white hover:bg-gray-800 text-black hover:text-white"
        onClick={startNewGame}
      >
        New Game
      </Button>
      <Button
        variant="outlined"
        className="mt-5 bg-white hover:bg-gray-800 text-black hover:text-white"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};

export default TicTacToeGame;
