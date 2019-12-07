import React, { useState, useEffect } from "react";
import isImage from "is-image-url";
import MathJax from "react-mathjax2";

function SavedAnswer({ obj, delSelf, i, id, setTranslate }) {
    const [open, setOpen] = useState(true);
    const [ansOpen, setAnsOpen] = useState(true);
    const [maxHeight, setMaxHeight] = useState("100%");
    const [transition, setTransition] = useState(false);
    const [height, setHeight] = useState("100%");
    const [mathLoaded, setMathLoaded] = useState(false);
    const [imageLoaded, setImgLoaded] = useState(0);
    const [numImages, setNumImages] = useState(0);

    const unmount = () => {
        setTranslate(i);
        setHeight(0);
        setTimeout(() => {
            setTranslate(10000000);
        }, 260);
        setTimeout(() => {
            delSelf(i);
        }, 310);
    };

    useEffect(() => {
        if (mathLoaded && imageLoaded === numImages) {
            setTimeout(() => {
                let totHeight = document.getElementById(`${id}-wrapper`).getBoundingClientRect()
                    .height;
                console.log({ totHeight });
                setMaxHeight(totHeight);
                setOpen(false);
                setAnsOpen(false);
                setTimeout(() => setTransition(true), 50);
            }, 0);
        } else {
            let quesHeight = document.getElementById(`${id}-question`).getBoundingClientRect()
                .height;
            setHeight(quesHeight + 20);
        }
        //eslint-disable-next-line
    }, [mathLoaded, imageLoaded]);

    useEffect(() => {
        let totalImages = 0;
        for (let i = 0; i < obj.answer.length; i++) {
            if (obj.answer[i].slice(0, 4) === "link") {
                if (isImage(obj.answer[i].slice(4, obj.answer[i].length))) {
                    totalImages++;
                }
            }
        }
        setNumImages(totalImages);
    }, []);

    const openClick = () => {
        if (open) {
            setTimeout(() => setAnsOpen(false), 300);
        } else {
            setAnsOpen(true);
        }
        setOpen(!open);
    };

    let answer = obj.answer;
    return (
        <div className="savedAnswerWrapper">
            <div
                className={`savedAnswer ${transition ? "height-trans" : ""}`}
                id={`${id}-wrapper`}
                onClick={openClick}
                style={{ height: open ? maxHeight : height }}
            >
                <p id={`${id}-question`} className="info" style={{ margin: 10, fontWeight: 400 }}>
                    {obj.question}
                </p>
                {!ansOpen ? null : (
                    <>
                        <div
                            className="info"
                            style={{
                                marginTop: 0,
                                marginBottom: 10,
                                flexDirection: "column",
                                alignItems: "center"
                            }}
                        >
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
                                                onLoad={() => setImgLoaded(imageLoaded + 1)}
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
                        <button className="deleteSavedAnswer" onClick={unmount}>
                            <img src={require("pictures/delete.png")} alt="trash" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default SavedAnswer;
