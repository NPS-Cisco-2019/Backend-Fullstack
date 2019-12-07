import React, { useState, useEffect } from "react";
import MathJax from "react-mathjax2";
import isImage from "is-image-url";

import styles from "style/style";

let { infoStyle, answerStyle } = styles;

function Answer({ id, answer, width = (9 * window.innerWidth) / 10 }) {
    let [height, setHeight] = useState(0);
    let [imgLoaded, setImgLoaded] = useState(0);
    let [mathLoaded, setMathLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            let pRect = document.getElementById(id).getBoundingClientRect();
            let container = document.getElementById("ansContainer").getBoundingClientRect();

            setHeight(Math.min(container.height - 20, pRect.height + 2 * infoStyle.padding));

            if (imgLoaded) {
                let div = document.getElementById(id).getBoundingClientRect();
                let img = document.getElementById(`${id}img`).getBoundingClientRect();
                setHeight(Math.min(Math.max(img.height, div.height), container.height - 20));
            }
        }, 100);

        // eslint-disable-next-line
    }, [imgLoaded, mathLoaded]);

    return (
        <div className="info" style={{ ...infoStyle, ...answerStyle, height, width }}>
            <div id={id}>
                <div>
                    {answer.map((item, i) => (
                        <div key={id + "-" + i}>
                            {item.slice(0, 4) === "link" ? (
                                isImage(item.slice(4, item.length)) ? (
                                    <img
                                        src={item.slice(4, item.length)}
                                        alt={`answer-${id}-${i}`}
                                        style={{
                                            width: "100%",
                                            marginBottom: 15
                                        }}
                                        id={`${id}img`}
                                        onLoad={() => setImgLoaded(imgLoaded + 1)}
                                    />
                                ) : (
                                    <a className="link" href={item.slice(4, item.length)}>
                                        {item.slice(4, item.length)}
                                    </a>
                                )
                            ) : (
                                <MathJax.Context
                                    input="ascii"
                                    onLoad={() => setMathLoaded(true)}
                                    onError={(MathJax, error) => {
                                        console.warn(error);
                                        console.log(
                                            "Encountered a MathJax error, re-attempting a typeset!"
                                        );
                                        MathJax.Hub.Queue(MathJax.Hub.Typeset());
                                    }}
                                    script="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=AM_HTMLorMML"
                                    options={{
                                        asciimath2jax: {
                                            useMathMLspacing: true,
                                            delimiters: [
                                                ["$", "$"],
                                                ["`", "`"]
                                            ],
                                            preview: "none"
                                        }
                                    }}
                                >
                                    <MathJax.Text text={item} />
                                </MathJax.Context>
                            )}
                            <p />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Answer;
