import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

function StartScreen({ history, location }) {
  useEffect(() => {
    sessionStorage.setItem("fadePicture", "true");
    let timeout = setTimeout(() => {
      if (sessionStorage.getItem("new") === "true") {
        history.push("/GradeChoice");
      } else {
        history.push("/Picture");
      }
    }, 1000);
    return () => {
      window.clearTimeout(timeout);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="full lateFade400">
      <img className="start-screen-image" src={require("pictures/logo512.png")} alt="logo" />
    </div>
  );
}

export default withRouter(StartScreen);
