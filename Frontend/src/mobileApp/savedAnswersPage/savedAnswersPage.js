import React, { useState } from "react";
import SavedAnswer from "./SavedAnswer";

import { Back } from "shared/elements";

export default function SavedAnswersPage(props) {
    const delAnswer = i => {
        let newAnswers = answers.slice(0, i).concat(answers.slice(i + 1, answers.length));
        setAnswers(newAnswers);
        localStorage.setItem("savedAnswers", JSON.stringify(newAnswers));
    };

    const backClick = () => {
        setBackToCam(true);
        props.backClick();
    };

    const [answers, setAnswers] = useState(JSON.parse(localStorage.getItem("savedAnswers")));
    const [translate, setTranslate] = useState(10000000);
    const [backToCam, setBackToCam] = useState(false);

    return (
        <div className={backToCam ? "slideout" : "fadein"} style={{ position: "absolute" }}>
            <header
                className="top"
                style={{ height: Math.round(window.innerHeight / 11) }}
                id="head"
            >
                <Back handleClick={backClick} />
                <p style={{ fontSize: "1.2em", margin: 0 }}>Saved Answers</p>
            </header>
            <main
                style={{
                    position: "relative",
                    top: Math.round(window.innerHeight / 11)
                }}
            >
                {answers.length > 0 ? (
                    answers.map((answer, i) => (
                        <div
                            key={`${i}-${answer.answer}`}
                            style={{
                                transform: `translateY(${i > translate ? -10 : 0}px)`,
                                transition: "transform 150ms cubic-bezier(0.215, 0.610, 0.355, 1)"
                            }}
                        >
                            <SavedAnswer
                                setTranslate={setTranslate}
                                obj={answer}
                                delSelf={delAnswer}
                                i={i}
                                id={`saved-answer-${i}`}
                            />
                        </div>
                    ))
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignContent: "center",
                            width: window.innerWidth
                        }}
                    >
                        <hr />
                        <p>Looks like you haven't saved any answers yet</p>
                        <p>
                            You can save answers by pressing the
                            <img
                                className="inline-img"
                                src={require("pictures/bookmark.png")}
                                alt="bookmark"
                            />
                        </p>
                        <p>when viewing an answer.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
