import React from "react";

function HelpOverlay({ show, handleExitClick }) {
  let screenHt =
    window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
  let screenWd =
    window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;

  return (
    <div style={show ? {} : { display: "none" }}>
      <div className="help">
        <div>
          <div style={{ top: screenHt / 11, width: screenWd }}>
            <p className="arrow">&#8593;</p>
            <p className="arrow-extension">|</p>
            <p className="arrow-extension">|</p>
            <p className="arrow-extension">|</p>
            <p className="arrow-extension">|</p>
            <p className="arrow-extension">|</p>
            <p className="main-p">Website</p>
            <p>
              Shows where this answer was gotten from.
              <br />
              It is additionaly a link to the answer.
            </p>
          </div>
          <div style={{ top: screenHt / 10, width: screenWd / 2.5 }}>
            <p className="main-p">
              <span className="arrow">&nbsp; &#8593;</span> &ensp; Back &emsp;
            </p>
            <p>Go back to main page.</p>
          </div>
          <div
            style={{
              top: screenHt / 10,
              left: 0.6 * screenWd,
              right: 0,
              width: screenWd / 2.5
            }}
          >
            <p className="arrow">&ensp; &#8593;</p>
            <p className="main-p">Bookmark</p>
            <p>Clicking on this saves the answer, and can be seen in the Bookmark tab.</p>
          </div>
          <div
            style={{
              top: 0.69 * screenHt,
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
            <p className="arrow-extension">|</p>
            <p className="arrow-extension">|</p>
            <p className="arrow-extension">|</p>
            <p className="arrow">&#8595;</p>
          </div>
          <div style={{ width: 0.4 * screenWd, top: 0.82 * screenHt }}>
            <p>Go to previous answer.</p>
            <p className="arrow">&#8595;</p>
          </div>
          <div
            style={{ width: 0.4 * screenWd, top: 0.82 * screenHt, left: 0.6 * screenWd }}
          >
            <p>Go to previous answer.</p>
            <p className="arrow">&#8595;</p>
          </div>
        </div>
      </div>
      <button className="exit-button" onClick={handleExitClick}>
        x
      </button>
    </div>
  );
}

export default HelpOverlay;
