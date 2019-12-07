import React, { useState, useEffect } from "react";
import styles from "style/style";

const { navObj, maxLength } = styles;

function BookmarkNav({ showSavedAns }) {
    const [style, setStyle] = useState({ zIndex: 69 });
    const [imgClass, setImgClass] = useState("");

    useEffect(() => {
        let left = document.getElementById("bookmark-holder").getBoundingClientRect().left;
        let top = document.getElementById("bookmark-container").getBoundingClientRect().top;
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
        showSavedAns();
    };

    return (
        <div
            onClick={handleClick}
            style={{ ...navObj, ...style }}
            className="settings-transitions"
            id="bookmark-container"
        >
            <img
                className={`nav-img ${imgClass}`}
                style={{ maxHeight: (3 * maxLength) / 5 }}
                src={require("pictures/bookmark.png")}
                alt="bookmark"
            />
        </div>
    );
}

export default BookmarkNav;
