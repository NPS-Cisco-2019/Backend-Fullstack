import React from "react";

function Firefox() {
  let style = {
    height: window.innerHeight * 2,
    position: "absolute"
  };
  return (
    <div style={{ ...style, borderTop: "2px solid rgb(200, 0 ,0)" }} className="tut tutFirefox" id="firefoxTut">
      <div className="img1">
        <img className="tutImg" src={require("pictures/firefox1.jpg")} alt="tutorial 1" />
      </div>
      <div className="p1">
        <p id="font100">Click on the the circled button</p>
      </div>
      <div className="img2">
        <img className="tutImg" src={require("pictures/firefox2.jpg")} alt="tutorial 2" />
      </div>
      <div className="p2">
        <p id="font100">Click on "+ADD TO HOME SCREEN" to install to your home screen.</p>
      </div>
    </div>
  );
}

export default Firefox;
