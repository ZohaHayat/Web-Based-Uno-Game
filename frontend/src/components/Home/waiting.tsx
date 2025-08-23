import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useNavigate } from "react-router-dom";

interface WaitPageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
  count: number;
}

function Waiting(props: WaitPageProps) {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(0);

  let navigate = useNavigate();

  useEffect(() => {
    props.socket.on("updateCount", (counter) => {
      console.log(counter);
      setCount(counter);
    });
  }, []);

  if (count >= 4 || props.count === 4) {
    return <Navigate to="/game" />;
  } else {
    console.log(count);
    // return <div>Waiting for users to join...</div>;
  }

  return (
    <>
      <div className="sampleHomePage">
        <h1 className="sampleTitle">My Uno Game</h1>
        <h1 className="sampleMessage2">Waiting for players to join...</h1>
      </div>
    </>
  );
}

export default Waiting;
