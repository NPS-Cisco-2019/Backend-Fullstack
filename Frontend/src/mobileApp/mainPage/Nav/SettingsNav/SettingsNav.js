import React, { useState, useEffect } from "react";

import styles from "style/style";

const { navObj, maxLength } = styles;

function SettingsNav({ showSettings }) {
    const [style, setStyle] = useState({ zIndex: 69 });
    const [imgClass, setImgClass] = useState("");

    useEffect(() => {
        let left = document.getElementById("settingsDiv").getBoundingClientRect().left;
        let top = document.getElementById("settings-container").getBoundingClientRect().top;
        setStyle({ zIndex: 69, left: left, top: top });
    }, []);

    const handleClick = () => {
        setStyle({
            borderRadius: 0,
            height: window.innerHeight,
            width: window.innerWidth,
            backgroundColor: "var(--backCol)",
            top: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            zIndex: "1000",
            left: 0
        });
        setImgClass("lateFade");
        showSettings();
    };

    return (
        <div
            style={{ ...navObj, ...style }}
            id="settings-container"
            className="settings-transitions"
        >
            <img
                src={require("pictures/settings.png")}
                alt="settings"
                className={`nav-img ${imgClass}`}
                style={{ maxHeight: (3 * maxLength) / 5 }}
                onClick={handleClick}
            />
        </div>
    );
}

export default SettingsNav;
