import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./MovieThumb.css";

const MovieThumb = ({ movieId, movieName, image, clickable }) => {
  return (
    <div className="rmdb-moviethumb">
      {clickable}
      <Link to={{ pathname: `${movieId}`, movieName: `${movieName}` }}>
        <img src={image} alt="Movie thumb" />
      </Link>
    </div>
  );
};

// checking the correct prop data type
MovieThumb.propTypes = {
  image: PropTypes.string,
  movieId: PropTypes.number,
  movieName: PropTypes.string
};

export default MovieThumb;
