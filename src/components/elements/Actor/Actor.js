import React from "react";
import { IMAGE_BASE_URL } from "../../../config";
import "./Actor.css";

const Actor = props => {
  // console.log("actor", props);
  const POSTER_SIZE = "w154"; // resizing poster size for actor div
  return (
    <div className="rmdb-actor">
      <img
        src={
          props.actor.profile_path
            ? `${IMAGE_BASE_URL}${POSTER_SIZE}${props.actor.profile_path}`
            : "./images/no_image.jpg"
        }
        alt="actorthumb"
      />
      <div className="rmdb-actor-details">
        <span className="rmdb-actor-name">{props.actor.name}</span>
        <span className="rmdb-actor-character">{props.actor.character}</span>
      </div>
    </div>
  );
};

export default Actor;
