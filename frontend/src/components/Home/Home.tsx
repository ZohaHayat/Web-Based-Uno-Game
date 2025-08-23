import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import "./Home.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//create an interface for the props that you want to pass to this component
interface HomePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}

function HomePage({ socket }: HomePageProps) {
  const [name, setName] = useState("");

  let navigate = useNavigate();

  //click handler
  const handleClick = () => {
    // Do something with the socket object, such as emit an event
    socket.emit("myName", name);
    navigate("/waiting");
  };

  return (
    <>
      <div className="sampleHomePage">
        <h1 className="sampleTitle">My Uno Game</h1>
        <div className="sampleMessage">
          <input
            placeholder="Enter your name"
            onChange={(event) => {
              setName(event.target.value);
            }}
          ></input>
          <button onClick={() => handleClick()}>Confirm</button>
        </div>
      </div>
    </>
  );
}
export default HomePage;
