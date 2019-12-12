import React, { useState } from "react";

function HelpOverlay({ show, handleExitClick }) {
  const [pos, setPos] = useState(0);

  let screenHt =
    window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
  let screenWd =
    window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;

  return (
    <div style={show ? {} : { display: "none" }}>
      <div className="help" style={{ transform: `translateX(-${pos * screenWd}px)` }}>
        <div>
          <div style={{ top: screenHt / 10, width: screenWd / 3 }}>
            <p className="arrow">&#8593;</p>
            <p className="main-p">Bookmarks</p>
            <p>All saved answers will be available here.</p>
          </div>
          <div style={{ top: screenHt / 10, left: screenWd / 3, width: screenWd / 3 }}>
            <p className="arrow">&#8593;</p>
            <p className="main-p">Settings</p>
          </div>
          <div
            style={{ top: screenHt / 10, left: (2 * screenWd) / 3, width: screenWd / 3 }}
          >
            <p className="arrow">&#8593;</p>
            <p className="main-p">Gallery</p>
            <p>Pictures can be uploaded from here.</p>
          </div>
          <div
            style={{
              top: 0.62 * screenHt,
              width: screenWd
            }}
          >
            <p>
              If it is plain red, it will take a picture.
              <br />
              If it has a search symbol, it will process the image/question.
              <br />
              Otherwise, it's a loading indicator
            </p>
            <p className="arrow">&#8595;</p>
          </div>
        </div>
        <div style={{ left: screenWd }}>
          <div style={{ top: screenHt / 8, width: screenWd / 2.1 }}>
            <p className="main-p">&emsp; &emsp; &emsp; Rotate &emsp; &emsp; &#8594;</p>
            <p>Rotates the image clockwise by 90 degrees.</p>
          </div>
          <div style={{ top: 10, width: screenWd / 4, left: screenWd * 0.6 }}>
            <p>Clears the crop box.</p>
            <p className="arrow">&#8595;</p>
          </div>
          <div
            style={{
              top: screenHt / 10 + 50,
              left: screenWd * 0.52,
              width: screenWd / 2.1
            }}
          >
            <p className="main-p">&emsp; &emsp; Crop &emsp; &#8593;</p>
            <p>
              Enables cropping.
              <br />
              Drag from one corner of where you want to crop, to the opposite corner.
            </p>
          </div>
          <div
            style={{
              top: screenHt * 0.78,
              width: screenWd
            }}
          >
            <p>
              Once an question is gotten, it will automatically open showing the question.
              <br />
              It can also be manually pulled up and you can type in a question.
            </p>
            <p className="arrow">&#8595;</p>
          </div>
        </div>
      </div>
      <button className="exit-button" onClick={handleExitClick}>
        x
      </button>
      <button className="next-button" onClick={() => setPos((pos + 1) % 2)}>
        Next
      </button>
    </div>
  );
}

export default HelpOverlay;
