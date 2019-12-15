import React from "react";
import PropTypes from "prop-types";
import "./FourColGrid.css";

const FourColGrid = props => {
  const renderElements = () => {
    const gridElement = props.children.map((current, i) => {
      return (
        <div key={i} className="rmdb-grid-element">
          {current}
        </div>
      );
    });

    return gridElement;
  };
  return (
    <div className="rmdb-grid">
      {props.header && !props.loading ? <h1>{props.header}</h1> : null}
      <div className="rmdb-grid-content">{renderElements()}</div>
    </div>
  );
};

FourColGrid.propTypes = {
  header: PropTypes.string,
  loading: PropTypes.bool.isRequired
};
export default FourColGrid;
