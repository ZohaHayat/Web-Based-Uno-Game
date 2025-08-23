import React from "react";
import logo from "./logo.svg";

import HomePage from "./components/Home/Home";
import Waiting from "./components/Home/waiting";
import Game from "./components/Game/Game";

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001", { transports: ["websocket"] });
socket.connect();

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

function App() {
  const [userId, setUserId] = useState("");
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    let id = localStorage.getItem("userId");
    console.log(id);
    if (!id) {
      id = generateUniqueId();
      console.log(id);
      localStorage.setItem("userId", id);
    }
    console.log(id);
    setUserId(id);

    socket.emit("userId", id);
    socket.on("userCount", (count) => {
      setUserCount(count);
      console.log(count);
    });
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage socket={socket} />} />
          <Route
            path="/waiting"
            element={<Waiting count={userCount} socket={socket} />}
          />
          <Route
            path="/game"
            element={<Game socket={socket} userCount={userCount} id={userId} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
