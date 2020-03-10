import React from "react";

function Chrome() {
  let style = {
    height: window.innerHeight * 3,
    position: "absolute"
  };
  return (
    <div style={{ ...style, borderTop: "2px solid rgb(18, 218, 0)" }} className="tut tutOthers" id="chromeTuts">
      <div className="img1">
        <img className="tutImg" src={require("pictures/chrome1.jpg")} alt="tutorial 1" />
      </div>
      <div className="p1">
        <p id="font100">Click on the the circled button</p>
      </div>
      <div className="img2">
        <img className="tutImg" src={require("pictures/chrome2.jpg")} alt="tutorial 2" />
      </div>
      <div className="p2">
        <p id="font100">Click on "Add to Home screen".</p>
      </div>
      <div className="img3">
        <img className="tutImg" src={require("pictures/chrome3.jpg")} alt="tutorial 3" />
      </div>
      <div className="p3">
        <p id="font100">Click on "Add" to install to your home screen.</p>
      </div>
    </div>
  );
}

export default Chrome;
