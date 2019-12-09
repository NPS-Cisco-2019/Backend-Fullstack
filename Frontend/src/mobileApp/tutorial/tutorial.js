import React, { useState } from "react";

import { Back } from "shared/elements";
import Tutorial from "shared/Tutorial";

let minHeight = window.innerHeight * 3.3;

function MobileTutorial(props) {
    const backClick = () => {
        props.backClick();
        setBackToCam(true);
    };

    const [backToCam, setBackToCam] = useState(false);

    let rootStyle = document.documentElement.style;

    rootStyle.setProperty("--tutAreas", '"img1" "text1" "img2" "text2" "img3" "text3"');
    rootStyle.setProperty("--otherRows", "repeat(3, 27% 6%");
    rootStyle.setProperty("--firefoxRows", "repeat(2, 40% 10%)");
    rootStyle.setProperty("--fontSize", "130%");
    rootStyle.setProperty("--marginTop", "none");
    rootStyle.setProperty("--rowGap", "0");

    return (
        <div
            style={{
                height: minHeight,
                position: "absolute",
                width: window.innerWidth,
                backgroundColor: "var(--backCol)",
                overflow: "hidden"
            }}
            className={backToCam ? "slideout" : "fadein"}
        >
            <header
                className="top fadein"
                style={{ height: Math.round(window.innerWidth / 6) }}
                id="head"
            >
                <Back handleClick={backClick} />
                <p style={{ fontSize: "1.2em", margin: 0 }} id="websitePosition">
                    Tutorial
                </p>
            </header>
            <div style={{ position: "relative", top: Math.round(window.innerWidth / 5) }}>
                <Tutorial headHeight={Math.round(window.innerWidth / 5)} />
            </div>
        </div>
    );
}

export default MobileTutorial;
