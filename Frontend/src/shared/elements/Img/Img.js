import React, { useState, useEffect } from "react";

import styles from "style/style";

const { imgStyle } = styles;

function Img({ src }) {
    let [fixHeight, setFixHeight] = useState(true);

    useEffect(() => {
        let img = new Image();
        img.src = src;
        let bool = img.naturalHeight / img.naturalWidth > window.innerHeight / window.innerWidth;
        setFixHeight(bool);
    }, [src]);

    return (
        <img
            src={src}
            alt="pic"
            style={{
                ...imgStyle,
                height: fixHeight ? (9 * window.innerHeight) / 10 : "auto",
                width: fixHeight ? "auto" : window.innerWidth
            }}
            id="image"
        />
    );
}

export default Img;
