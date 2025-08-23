import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import "./uno.css";

function Display(start: string[]) {
  return (
    <div>
      {start.map((item: any) => {
        if (item[0] === "R") {
          if (item[1] == "S") {
            return (
              <div className="card skip red">
                <span className="inner">
                  <span className="mark">S</span>
                </span>
              </div>
            );
          } else if (item[1] == "R") {
            return (
              <div className="card reverse red">
                <span className="inner">
                  <span className="mark">R</span>
                </span>
              </div>
            );
          } else if (item[1] == "D") {
            return (
              <div className="card draw-two red">
                <span className="inner">
                  <span className="mark">D</span>
                </span>
              </div>
            );
          } else {
            return (
              <div className={`card num-${item[1]} red`}>
                <span className="inner">
                  <span className="mark">{item[1]}</span>
                </span>
              </div>
            );
          }
        } else if (item[0] === "B") {
          if (item[1] == "S") {
            return (
              <div className="card skip blue">
                <span className="inner">
                  <span className="mark">S</span>
                </span>
              </div>
            );
          } else if (item[1] == "R") {
            return (
              <div className="card reverse blue">
                <span className="inner">
                  <span className="mark">R</span>
                </span>
              </div>
            );
          } else if (item[1] == "D") {
            return (
              <div className="card draw-two blue">
                <span className="inner">
                  <span className="mark">D</span>
                </span>
              </div>
            );
          } else {
            return (
              <div className={`card num-${item[1]} blue`}>
                <span className="inner">
                  <span className="mark">{item[1]}</span>
                </span>
              </div>
            );
          }
        } else if (item[0] === "Y") {
          if (item[1] == "S") {
            return (
              <div className="card skip yellow">
                <span className="inner">
                  <span className="mark">S</span>
                </span>
              </div>
            );
          } else if (item[1] == "R") {
            return (
              <div className="card reverse yellow">
                <span className="inner">
                  <span className="mark">R</span>
                </span>
              </div>
            );
          } else if (item[1] == "D") {
            return (
              <div className="card draw-two yellow">
                <span className="inner">
                  <span className="mark">D</span>
                </span>
              </div>
            );
          } else {
            return (
              <div className={`card num-${item[1]} yellow`}>
                <span className="inner">
                  <span className="mark">{item[1]}</span>
                </span>
              </div>
            );
          }
        } else if (item[0] === "G") {
          if (item[1] == "S") {
            return (
              <div className="card skip green">
                <span className="inner">
                  <span className="mark">S</span>
                </span>
              </div>
            );
          } else if (item[1] == "R") {
            return (
              <div className="card reverse green">
                <span className="inner">
                  <span className="mark">R</span>
                </span>
              </div>
            );
          } else if (item[1] == "D") {
            return (
              <div className="card draw-two green">
                <span className="inner">
                  <span className="mark">D</span>
                </span>
              </div>
            );
          } else {
            return (
              <div className={`card num-${item[1]} green`}>
                <span className="inner">
                  <span className="mark">{item[1]}</span>
                </span>
              </div>
            );
          }
        } else if (item === "W4") {
          return (
            <div className="card draw-4 black">
              <span className="inner">
                <span className="mark">+4</span>
              </span>
            </div>
          );
        } else if (item[0] === "W") {
          return (
            <div className="card black">
              <span className="inner">
                <span className="mark">W</span>
              </span>
            </div>
          );
        }
      })}
    </div>
  );
}

export default Display;
