import React from "react";

function Safari() {
  let style = {
    height: window.innerHeight * 3,
    position: "absolute"
  };
  return (
    <div style={{ ...style, borderTop: "2px solid rgb(0, 0, 255)" }} className="tut tutOthers" id="safariTut">
      <div className="img1">
        <img className="tutImg" src={require("pictures/safari1.jpg")} alt="tutorial 1" />
      </div>
      <div className="p1">
        <p id="font100">Click on the the circled button</p>
      </div>
      <div className="img2">
        <img className="tutImg" src={require("pictures/safari2.jpg")} alt="tutorial 2" />
      </div>
      <div className="p2">
        <p id="font100">After scrolling down, click on "Add to Home Screen".</p>
      </div>
      <div className="img3">
        <img className="tutImg" src={require("pictures/safari3.jpg")} alt="tutorial 3" />
      </div>
      <div className="p3">
        <p id="font100">Click on "Add" to install to your home screen.</p>
      </div>
    </div>
  );
}

export default Safari;
