import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import "./uno.css";
import Display from "./display_start";

interface GamePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  userCount: number;
  id: string;
}

function Game(props: GamePageProps) {
  const [names, setNames] = useState([]);
  let [myDeck, setmyDeck] = useState([]);
  let [start, setStart] = useState<string[]>([]);

  let [msgarr, setMsgarr] = useState<string[]>([]);
  const [isitturn, setIsitturn] = useState(false);
  const [st_played, setst_played] = useState(false);

  useEffect(() => {
    let temp_3 = sessionStorage.getItem("myDeck");
    if (temp_3) {
      myDeck = JSON.parse(temp_3);
      console.log("deck this: ", myDeck);
      setmyDeck(JSON.parse(temp_3));
    } else {
      console.log(props.id);
      props.socket.emit("getIndex", props.id);
      props.socket.on("returningIndex", (temp) => {
        console.log(temp);
        console.log(props.socket);
        props.socket.emit("getDeck", temp);
      });
    }

    let temp = sessionStorage.getItem("msgs");
    if (temp) {
      setMsgarr(JSON.parse(temp));
    } else {
      sessionStorage.setItem("msgs", JSON.stringify(msgarr));
    }

    let temp_2 = sessionStorage.getItem("curr_card");
    if (temp_2) {
      if (temp_2[0] == "[") {
        setStart(JSON.parse(temp_2));
      } else {
        setStart([temp_2]);
      }
    }

    let temp_4 = sessionStorage.getItem("names");
    if (temp_4) {
      setNames(JSON.parse(temp_4));
    }
  }, []);

  props.socket.on("myDeck", async (deck) => {
    console.log(deck);
    await setmyDeck(deck);
    myDeck = deck;
    sessionStorage.setItem("myDeck", JSON.stringify(deck));
    console.log(myDeck);
    console.log(props.userCount);
  });

  props.socket.on("gamestart", async (start_card) => {
    await setStart(start_card);
    sessionStorage.setItem("start_card", start_card);
    sessionStorage.setItem("curr_card", start_card);
    sessionStorage.setItem("skip_played", "false");
    sessionStorage.setItem("rev_played", "false");
    sessionStorage.setItem("st_played", "false");
    sessionStorage.setItem("isitturn", "false");
    sessionStorage.setItem("wild", "false");
    sessionStorage.setItem("pick", "false");
    sessionStorage.setItem("d2_played", "false");
    sessionStorage.setItem("name", "");
    console.log(start);
  });

  props.socket.on("nameslist", async (namelist) => {
    await setNames(namelist);
    sessionStorage.setItem("names", JSON.stringify(namelist));
    console.log(names);
  });

  props.socket.on("starthasplayed", async () => {
    await setst_played(true);
    sessionStorage.setItem("st_played", "true");
  });

  props.socket.on("skiphasplayed", async () => {
    sessionStorage.setItem("skip_played", "true");
  });

  props.socket.on("revhasplayed", async () => {
    sessionStorage.setItem("rev_played", "true");
  });

  props.socket.on("wildhasplayed", async () => {
    sessionStorage.setItem("wild", "true");
  });

  props.socket.on("d2hasplayed", async () => {
    sessionStorage.setItem("d2_played", "true");
  });

  props.socket.on("newskipishere", async () => {
    sessionStorage.setItem("skip_played", "false");
  });

  props.socket.on("newrevishere", async () => {
    sessionStorage.setItem("rev_played", "false");
  });

  props.socket.on("wildishere", async () => {
    sessionStorage.setItem("wild", "false");
  });

  props.socket.on("newdrawishere", async () => {
    sessionStorage.setItem("d2_played", "false");
  });

  props.socket.on("newmsghere", (msg) => {
    console.log(msg);

    let temp_msg = sessionStorage.getItem("msgs");
    let new_msg = [];
    console.log(msgarr);
    if (temp_msg) {
      new_msg = JSON.parse(temp_msg);
      console.log(new_msg[0], msg);
      if (new_msg[0] == null) {
        new_msg[0] = msgarr[0];
      }
      if (new_msg.length === 0 || new_msg[0] !== msg) {
        new_msg.unshift(msg);
        msgarr = new_msg;
        sessionStorage.setItem("msgs", JSON.stringify(msgarr));
      }
      msgarr = new_msg;
    }
    console.log(msgarr);
  });

  props.socket.on("newmsghere2", (msg) => {
    console.log(msg);

    let temp_msg = sessionStorage.getItem("msgs");
    let new_msg = [];
    console.log(msgarr);
    if (temp_msg) {
      new_msg = JSON.parse(temp_msg);
      console.log(new_msg[0], msg);
      if (new_msg[0] == null) {
        new_msg[0] = msgarr[0];
      }
      if (new_msg.length === 0 || new_msg[0] !== msg) {
        new_msg.unshift(msg);
        msgarr = new_msg;
        sessionStorage.setItem("msgs", JSON.stringify(msgarr));
      }
      msgarr = new_msg;
    }
    console.log(msgarr);
  });

  props.socket.on("playerTurn", async (playerName) => {
    console.log(playerName["player_name"] + "'s turn");

    await setMsgarr([playerName["player_name"] + "'s turn", ...msgarr]);
    let temp_msg = sessionStorage.getItem("msgs");
    let new_msg = [];
    console.log("temp and msg", temp_msg, msgarr);
    if (temp_msg) {
      new_msg = JSON.parse(temp_msg);
      if (
        new_msg.length === 0 ||
        new_msg[0] !== playerName["player_name"] + "'s turn"
      ) {
        new_msg.unshift(playerName["player_name"] + "'s turn");
        msgarr = new_msg;
        console.log("for last client", msgarr);
        sessionStorage.setItem("msgs", JSON.stringify(msgarr));
      }
    } else {
      console.log(msgarr);
      msgarr = [playerName["player_name"] + "'s turn"];
      sessionStorage.setItem(
        "msgs",
        JSON.stringify([playerName["player_name"] + "'s turn"])
      );
    }

    sessionStorage.setItem("name", playerName["player_name"]);

    let card = sessionStorage.getItem("start_card");
    let curr_card = sessionStorage.getItem("curr_card");
    let skip = sessionStorage.getItem("skip_played");
    let rev = sessionStorage.getItem("rev_played");
    let st = sessionStorage.getItem("st_played");
    let turn = sessionStorage.getItem("isitturn");
    let wild = sessionStorage.getItem("wild");
    let d2_played = sessionStorage.getItem("d2_played");

    start[0] = String(curr_card);
    if (!card) {
      sessionStorage.setItem("start_card", "false");
    }
    if (!curr_card) {
      sessionStorage.setItem("curr_card", "false");
    }
    if (!skip) {
      sessionStorage.setItem("skip_played", "false");
    }
    if (!rev) {
      sessionStorage.setItem("rev_played", "false");
    }
    if (!st) {
      sessionStorage.setItem("st_played", "false");
    }
    if (!turn) {
      sessionStorage.setItem("isitturn", "false");
    }
    if (!wild) {
      sessionStorage.setItem("wild", "false");
    }
    if (!d2_played) {
      sessionStorage.setItem("d2_played", "false");
    }

    console.log("This is skip ", skip);
    console.log(playerName["id"], props.id);

    if (playerName["id"] == props.id && st == "false" && curr_card == card) {
      console.log("inside start");
      await setIsitturn(true);
      sessionStorage.setItem("isitturn", "true");

      if (start[0][1] == "S") {
        props.socket.emit(
          "newmsg",
          playerName["player_name"] + "'s turn has been skipped"
        );
        await setMsgarr([
          playerName["player_name"] + "'s turn has been skipped",
          ...msgarr,
        ]);
        console.log("skip");
        await setIsitturn(false);
        sessionStorage.setItem("isitturn", "false");
        sessionStorage.setItem("skip_played", "true");
        sessionStorage.setItem("st_played", "true");
        props.socket.emit("startplayed");
        props.socket.emit("skip_played");
        props.socket.emit("startskip");
        await setst_played(true);
      } else if (start[0][1] == "R") {
        console.log("rev");
        await setIsitturn(false);
        sessionStorage.setItem("isitturn", "false");
        sessionStorage.setItem("rev_played", "true");
        sessionStorage.setItem("st_played", "true");
        props.socket.emit("startplayed");
        props.socket.emit("revplayed");
        props.socket.emit("startreverse");
        await setst_played(true);
      } else if (start[0][1] == "D") {
        props.socket.emit(
          "newmsg",
          playerName["player_name"] +
            " drew 2 cards due to the Draw 2 card on the table"
        );
        await setMsgarr([
          playerName["player_name"] +
            " drew 2 cards due to the Draw 2 card on the table",
          ...msgarr,
        ]);
        console.log("draw");
        sessionStorage.setItem("d2_played", "true");
        await setst_played(true);
        sessionStorage.setItem("st_played", "true");
        props.socket.emit("startplayed");
        props.socket.emit("d2played");
        props.socket.emit("draw2", { propid: props.id, deck: myDeck });
      }
    } else if (playerName["id"] == props.id && st == "true") {
      console.log("inside true coniditon");
      await setIsitturn(true);
      sessionStorage.setItem("isitturn", "true");
      console.log(start[0][1], skip);
      if (start[0][1] == "S" && skip == "false") {
        props.socket.emit(
          "newmsg",
          playerName["player_name"] + "'s turn has been skipped"
        );
        await setMsgarr([
          playerName["player_name"] + "'s turn has been skipped",
          ...msgarr,
        ]);
        console.log("I AM DOING SKIP FROM SECOND PLAYER HAHAHAHA");
        setIsitturn(false);
        sessionStorage.setItem("isitturn", "false");
        setst_played(true);
        sessionStorage.setItem("st_played", "true");
        sessionStorage.setItem("skip_played", "true");
        props.socket.emit("skip_played");
        props.socket.emit("startskip");
      } else if (start[0][1] == "D" && d2_played == "false") {
        props.socket.emit(
          "newmsg",
          playerName["player_name"] +
            " drew 2 cards due to the Draw 2 card on the table"
        );
        await setMsgarr([
          playerName["player_name"] +
            " drew 2 cards due to the Draw 2 card on the table",
          ...msgarr,
        ]);
        console.log("I AM DOING DRAW FROM SECOND PLAYER HAHAHAHA");
        sessionStorage.setItem("d2_played", "true");
        setst_played(true);
        sessionStorage.setItem("st_played", "true");
        props.socket.emit("d2played");
        props.socket.emit("draw2", { propid: props.id, deck: myDeck });
      } else if (start[0] == "W4" && wild == "false") {
        props.socket.emit(
          "newmsg",
          playerName["player_name"] +
            "'s turn but it is being skipped after drawing 4 cards"
        );
        await setMsgarr([
          playerName["player_name"] +
            "'s turn but it is being skipped after drawing 4 cards",
          ...msgarr,
        ]);
        sessionStorage.setItem("isitturn", "false");
        sessionStorage.setItem("wild", "true");
        props.socket.emit("wildplayed");
        props.socket.emit("draw4", { propid: props.id, deck: myDeck });
      }
      sessionStorage.setItem("skip_played", "false");
      sessionStorage.setItem("rev_played", "false");
    }
    props.socket.off("playerTurn");
  });

  const handleClick = async (item: any) => {
    console.log(start);
    console.log(item);
    console.log(isitturn);
    console.log(st_played);

    let name = sessionStorage.getItem("name");
    let bools = sessionStorage.getItem("disable");

    if (!name) {
      sessionStorage.setItem("name", "true");
    }
    if (!bools) {
      sessionStorage.setItem("disable", "false");
    }

    let st = sessionStorage.getItem("st_played");
    let turn = sessionStorage.getItem("isitturn");

    if (!st) {
      sessionStorage.setItem("st_played", "No");
    }
    if (!turn) {
      sessionStorage.setItem("isitturn", "No");
    }

    if (turn == "true") {
      if (item == "W4") {
        for (let x in myDeck) {
          if (myDeck[x][0] == start[0][0]) {
            props.socket.emit(
              "newmsg2",
              "You can only place a wild draw 4 card when you have no other card that can be placed on the card on deck."
            );
            await setMsgarr([
              "You can only place a wild draw 4 card when you have no other card that can be placed on the card on deck.",
              ...msgarr,
            ]);
            return;
          }
        }
      }
      if (item == "W" && (start[0][1] == "D" || start[0] == "W4")) {
        props.socket.emit(
          "newmsg2",
          "You cannot place a wild card on a draw 2 or wild draw 4 card"
        );
        await setMsgarr([
          "You cannot place a wild card on a draw 2 or wild draw 4 card",
          ...msgarr,
        ]);
        return;
      }
      if (
        item == "W4" ||
        (item == "W" && start[0][1] != "D" && start[0] != "W4") ||
        item[0] == start[0][0] ||
        item[1] == start[0][1] ||
        start[0] == "W4" ||
        start[0] == "W"
      ) {
        console.log(item);
        setStart([item]);
        setst_played(true);
        sessionStorage.setItem("st_played", "true");
        props.socket.emit("startplayed");
        console.log(start);
        for (let x = 0; x < myDeck.length; x++) {
          if (myDeck[x] == item) {
            myDeck.splice(x, 1);
            sessionStorage.setItem("myDeck", JSON.stringify(myDeck));
          }
        }

        props.socket.emit("newstart", [item]);

        var color = " ";
        var action = " ";
        if (item[0] == "R") {
          color = "Red";
        } else if (item[0] == "B") {
          color = "Blue";
        } else if (item[0] == "G") {
          color = "Green";
        } else if (item[0] == "Y") {
          color = "Yellow";
        } else if (item == "W4") {
          color = "Wild Draw 4";
        } else {
          color = "Wild";
        }

        if (item[1] == "R") {
          action = "Reverse";
        } else if (item[1] == "S") {
          action = "Skip";
        } else if (item[1] == "D") {
          action = "Draw 2";
        } else if (item == "W") {
          action = " ";
        } else if (item == "W4") {
          action = " ";
        } else {
          action = item[1];
        }

        props.socket.emit(
          "newmsg",
          name + " played a " + color + " " + action + " Card"
        );
        await setMsgarr([
          name + " played a " + color + " " + action + " Card",
          ...msgarr,
        ]);

        if (item == "W") {
          props.socket.emit("newmsg2", "Please play another card now");
          await setMsgarr(["Please play another card now", ...msgarr]);
          if (myDeck.length == 0) {
            props.socket.emit("gameEnd", props.id);
          }
        } else {
          if (item == "W4") {
            props.socket.emit("wildnow");
          }
          if (item[1] == "S") {
            props.socket.emit("newskip");
          }
          if (item[1] == "D") {
            props.socket.emit("newdraw");
          }
          console.log(item[0]);
          if (item[1] == "R") {
            props.socket.emit("newrev");
            console.log("I AM DOING REVERSE FROM SECOND PLAYER HAHAHAHA");
            setIsitturn(false);
            sessionStorage.setItem("isitturn", "false");
            sessionStorage.setItem("pick", "false");
            setst_played(true);
            sessionStorage.setItem("st_played", "true");
            sessionStorage.setItem("rev_played", "true");
            props.socket.emit("revplayed");
            props.socket.emit("startreverse");
            if (myDeck.length == 0) {
              props.socket.emit("gameEnd", props.id);
            }
            return;
          }

          if (myDeck.length == 0) {
            props.socket.emit("gameEnd", props.id);
          } else {
            await setIsitturn(false);
            sessionStorage.setItem("pick", "false");
            sessionStorage.setItem("isitturn", "false");
            props.socket.emit("nextturn");
          }
        }
      } else {
        props.socket.emit(
          "newmsg2",
          "Please place a card that matches the game criteria"
        );
        await setMsgarr([
          "Please place a card that matches the game criteria",
          ...msgarr,
        ]);
      }
    } else if (bools == "false") {
      props.socket.emit("newmsg2", "It is not your turn");
      await setMsgarr(["It is not your turn", ...msgarr]);
    }
  };

  props.socket.on("changestart", async (st) => {
    console.log(st);
    await setStart(st);
    sessionStorage.setItem("curr_card", st);
  });

  const onPick = () => {
    let pic = sessionStorage.getItem("pick");
    let name = sessionStorage.getItem("name");
    let bools = sessionStorage.getItem("disable");

    if (!pic) {
      sessionStorage.setItem("pick", "false");
    }
    if (!name) {
      sessionStorage.setItem("name", "");
    }

    if (!bools) {
      sessionStorage.setItem("disable", "false");
    }
    let turn = sessionStorage.getItem("isitturn");

    if (!turn) {
      sessionStorage.setItem("isitturn", "No");
    }
    if (turn == "true" && pic == "false") {
      sessionStorage.setItem("pick", "true");
      console.log(myDeck);
      props.socket.emit("newmsg", name + " picked a new card from deck");
      setMsgarr([name + " picked a new card from deck", ...msgarr]);
      props.socket.emit("pick", { propid: props.id, deck: myDeck });
    } else {
      if (turn == "true" && pic == "true") {
        props.socket.emit("newmsg2", "You can only pick one card");
        setMsgarr(["You can only pick one card", ...msgarr]);
      } else if (bools == "false") {
        props.socket.emit("newmsg2", "It is not your turn");
        setMsgarr(["It is not your turn", ...msgarr]);
      }
    }
  };

  const onPass = () => {
    let pic = sessionStorage.getItem("pick");
    let name = sessionStorage.getItem("name");
    let bools = sessionStorage.getItem("disable");

    if (!pic) {
      sessionStorage.setItem("pick", "true");
    }
    if (!name) {
      sessionStorage.setItem("name", "");
    }
    let turn = sessionStorage.getItem("isitturn");

    if (!turn) {
      sessionStorage.setItem("isitturn", "No");
    }

    if (!bools) {
      sessionStorage.setItem("disable", "false");
    }
    if (turn == "true" && pic == "true") {
      sessionStorage.setItem("isitturn", "false");
      sessionStorage.setItem("pick", "false");
      props.socket.emit("newmsg", name + " passed their turn");
      setMsgarr([name + " passed their turn", ...msgarr]);
      props.socket.emit("pass");
    } else {
      if (turn == "true" && pic == "false") {
        props.socket.emit(
          "newmsg2",
          "You can only pass after picking a card from deck"
        );
        setMsgarr([
          "You can only pass after picking a card from deck",
          ...msgarr,
        ]);
      } else if (bools == "false") {
        props.socket.emit("newmsg2", "It is not your turn");
        setMsgarr(["It is not your turn", ...msgarr]);
      }
    }
  };

  props.socket.on("newDeck", async (tempDeck) => {
    await setmyDeck(tempDeck);
    myDeck = tempDeck;
    sessionStorage.setItem("myDeck", JSON.stringify(tempDeck));
    console.log(tempDeck);
  });

  props.socket.on("winner", async (winner) => {
    sessionStorage.setItem("isitturn", "false");
    sessionStorage.setItem("disable", "true");
    await setMsgarr(["The winner is " + winner, ...msgarr]);
    props.socket.disconnect();
  });

  props.socket.on("draw", async () => {
    sessionStorage.setItem("isitturn", "false");
    sessionStorage.setItem("disable", "true");
    await setMsgarr(["The game has ended in a draw", ...msgarr]);
    props.socket.disconnect();
  });

  return (
    <div>
      <div className="main-container">
        <div className="game-container">
          <div className="heading-container">
            <h1>UNO</h1>
          </div>
          <div className="game-table-container">
            <div className="game-table">
              <div className="card-area">
                <div className="card discard-pile black">
                  <span className="inner">
                    <span className="mark">U</span>
                  </span>
                </div>
                {Display(start)}
              </div>

              <div className="game-players-container">
                <div className="player-tag player-one">{names[0]}</div>
              </div>

              <div className="game-players-container">
                <div className="player-tag player-two">{names[1]}</div>
              </div>

              <div className="game-players-container">
                <div className="player-tag player-three">{names[2]}</div>
              </div>

              <div className="game-players-container">
                <div className="player-tag player-four">{names[3]}</div>
              </div>
            </div>
          </div>
          <div className="select-rang-container">
            <button
              className="button-select-rang"
              onClick={(event) => onPick()}
            >
              Pick from deck
            </button>
            <button
              className="button-select-rang"
              onClick={(event) => onPass()}
            >
              Pass
            </button>
          </div>
        </div>
        <div className="messages-and-cards-container">
          <div className="right-side-container messages-container">
            <h1>Messages</h1>
            <div className="message-box">
              {msgarr.map((value) => (
                <div className="message-content-container">{value}</div>
              ))}
              <div className="message-content-container">
                Goodluck for the assignment!
              </div>
            </div>
          </div>
          <div className="right-side-container my-cards-container">
            <h1>My Cards</h1>
            <div className="my-cards-inner-container">
              {myDeck.map((item) => {
                if (item[0] === "R") {
                  if (item[1] == "S") {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className="card skip red">
                          <span className="inner">
                            <span className="mark">S</span>
                          </span>
                        </div>
                      </button>
                    );
                  } else if (item[1] == "R") {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className="card reverse red">
                          <span className="inner">
                            <span className="mark">R</span>
                          </span>
                        </div>
                      </button>
                    );
                  } else if (item[1] == "D") {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className="card draw-two red">
                          <span className="inner">
                            <span className="mark">D</span>
                          </span>
                        </div>
                      </button>
                    );
                  } else {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className={`card num-${item[1]} red`}>
                          <span className="inner">
                            <span className="mark">{item[1]}</span>
                          </span>
                        </div>
                      </button>
                    );
                  }
                } else if (item[0] === "B") {
                  if (item[1] == "S") {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className="card skip blue">
                          <span className="inner">
                            <span className="mark">S</span>
                          </span>
                        </div>
                      </button>
                    );
                  } else if (item[1] == "R") {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className="card reverse blue">
                          <span className="inner">
                            <span className="mark">R</span>
                          </span>
                        </div>
                      </button>
                    );
                  } else if (item[1] == "D") {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className="card draw-two blue">
                          <span className="inner">
                            <span className="mark">D</span>
                          </span>
                        </div>
                      </button>
                    );
                  } else {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className={`card num-${item[1]} blue`}>
                          <span className="inner">
                            <span className="mark">{item[1]}</span>
                          </span>
                        </div>
                      </button>
                    );
                  }
                } else if (item[0] === "Y") {
                  if (item[1] == "S") {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className="card skip yellow">
                          <span className="inner">
                            <span className="mark">S</span>
                          </span>
                        </div>
                      </button>
                    );
                  } else if (item[1] == "R") {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className="card reverse yellow">
                          <span className="inner">
                            <span className="mark">R</span>
                          </span>
                        </div>
                      </button>
                    );
                  } else if (item[1] == "D") {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className="card draw-two yellow">
                          <span className="inner">
                            <span className="mark">D</span>
                          </span>
                        </div>
                      </button>
                    );
                  } else {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className={`card num-${item[1]} yellow`}>
                          <span className="inner">
                            <span className="mark">{item[1]}</span>
                          </span>
                        </div>
                      </button>
                    );
                  }
                } else if (item[0] === "G") {
                  if (item[1] == "S") {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className="card skip green">
                          <span className="inner">
                            <span className="mark">S</span>
                          </span>
                        </div>
                      </button>
                    );
                  } else if (item[1] == "R") {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className="card reverse green">
                          <span className="inner">
                            <span className="mark">R</span>
                          </span>
                        </div>
                      </button>
                    );
                  } else if (item[1] == "D") {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className="card draw-two green">
                          <span className="inner">
                            <span className="mark">D</span>
                          </span>
                        </div>
                      </button>
                    );
                  } else {
                    return (
                      <button
                        className="button-select-rang"
                        onClick={(event) => {
                          handleClick(item);
                        }}
                      >
                        <div className={`card num-${item[1]} green`}>
                          <span className="inner">
                            <span className="mark">{item[1]}</span>
                          </span>
                        </div>
                      </button>
                    );
                  }
                } else if (item === "W4") {
                  return (
                    <button
                      className="button-select-rang"
                      onClick={(event) => {
                        handleClick(item);
                      }}
                    >
                      <div className="card draw-4 black">
                        <span className="inner">
                          <span className="mark">+4</span>
                        </span>
                      </div>
                    </button>
                  );
                } else if (item[0] === "W") {
                  return (
                    <button
                      className="button-select-rang"
                      onClick={(event) => {
                        handleClick(item);
                      }}
                    >
                      <div className="card black">
                        <span className="inner">
                          <span className="mark">W</span>
                        </span>
                      </div>
                    </button>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
