import React, { useRef } from "react";

import styles from "style/style";
let { navObj } = styles;

function GalleryNav({ selectFileHandle }) {
    const ref = useRef(null);

    return (
        <div style={navObj}>
            <img
                src={require("pictures/gallery.png")}
                alt="Gallery"
                className="nav-img"
                onClick={() => ref.current.click()}
            />
            <input
                type="file"
                accept="image/*"
                ref={ref}
                onChange={selectFileHandle}
                style={{ display: "none" }}
            />
        </div>
    );
}

export default GalleryNav;
