import React, { useState, useEffect } from "react";

import styles from "style/style";

function Img({ src, rotation }) {
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
        ...styles.imgStyle,
        height: fixHeight ? (9 * window.innerHeight) / 10 : "auto",
        width: fixHeight ? "auto" : window.innerWidth,
        transform: `rotate(${rotation * 90}deg)`,
        transition: "transform 300ms cubic-bezier(0.215, 0.61, 0.355, 1)"
      }}
      id="image"
    />
  );
}

export default Img;
