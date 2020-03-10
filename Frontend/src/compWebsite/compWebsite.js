// SECTION imports
import React, { useState, useEffect } from "react";

import Tutorial from "shared/Tutorial";
import "style/desktopApp.css";
import "style/animations.css";
// !SECTION

function CompApp() {
  const [headHeight, setHeadHeight] = useState(0);
  const [scroll, setScroll] = useState(0);

  const changeHeadHeight = () => {
    const head = document.getElementById("head");
    setHeadHeight(head.clientHeight);
  };

  useEffect(() => {
    changeHeadHeight();

    const changeScroll = () => {
      setScroll(() => window.scrollY);
    };
    window.addEventListener("resize", changeHeadHeight);
    window.addEventListener("scroll", changeScroll);
    return () => {
      window.removeEventListener("resize", changeHeadHeight);
      window.removeEventListener("scroll", changeScroll);
    };
  }, []);

  // opacity for header
  let opacity = Math.max(Math.min(50 / scroll, 1), 0.7);

  return (
    <div className="App deskApp">
      <header className="deskHead" style={{ opacity }} id="head">
        <h1>This app is not supported on Computers.</h1>
      </header>
      <div className="body" style={{ top: headHeight }} id="main">
        {/* SECTION Main section, contains about and navlinks to tutorials */}
        <div className="description">
          <div
            style={{
              fontSize: "1.15rem",
              marginBottom: 30
            }}
          >
            <p>
              SnapSearch is a problem solving app, just take a picture and the app automatically scans the web to find the best answers for
              you.
            </p>
            <br />
            <p>
              This app aims to provide instant solutions to problems in science subjects at the high school level. The user can provide an
              image of the question or simply enter it in a prompt.
            </p>
            <p>SnapSearch sources answers from the internet, subject to a unique ranking system.</p>
            <br />
            <br />
            <p>
              Features of SnapSearch:
              <br />
              <ol>
                <li>Gives access to quality quality answers from the best of websites.</li>

                <li>Converts images to text by using and hence saves effort of typing.</li>

                <li>Allows users to navigate between answers seamlessly through a simple swipe.</li>

                <li>Enables users to save answers for later.</li>
              </ol>
            </p>
          </div>
          <h2>Go to your mobile phone in one of the following browsers and follow these tutorials to install it.</h2>
        </div>
        {/* !SECTION */}
        <Tutorial headHeight={headHeight} />
      </div>
    </div>
  );
}

export default CompApp;
