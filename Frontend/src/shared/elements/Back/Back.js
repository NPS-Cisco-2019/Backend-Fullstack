import React from "react";
import styles from "style/style";

const { navObj } = styles;

function Back({ handleClick }) {
    return (
        <div style={{ ...navObj, textAlign: "center" }} onClick={handleClick}>
            <img src={require("pictures/back.png")} alt="back" className="nav-img" />
        </div>
    );
}

export default Back;
