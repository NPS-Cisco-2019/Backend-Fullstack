import React, { useState, useEffect } from 'react';

import { Back } from "shared/elements";

export default function SavedAnswersPage(props) {

    const delAnswer = i => {
        let newAnswers = answers.slice(0, i).concat(answers.slice(i + 1, answers.length))
        setAnswers(newAnswers);
        localStorage.setItem('savedAnswers', JSON.stringify(newAnswers));
    }

    const backClick = () => {
        setBackToCam(true);
        props.backClick();
    }

    const [answers, setAnswers] = useState(JSON.parse(localStorage.getItem('savedAnswers')));
    const [translate, setTranslate] = useState(10000000);
    const [backToCam, setBackToCam] = useState(false);

    return (
        <div className={backToCam ? "slideout" : "fadein"} style={{ position: "absolute" }}>
            <header className="top" style={{height: Math.round(window.innerHeight/11)}} id="head">
                <Back handleClick={backClick} />
                <p style={{fontSize: '1.2em', margin: 0}}>Saved Answers</p>
            </header>
            <main style={{ position: 'relative', top: Math.round(window.innerHeight/11) }}>
                {
                    answers.length > 0 ?
                        answers.map((answer, i) => (
                            <div key={`${i}-${answer.answer}`} style={{ transform: `translateY(${i > translate ? -10 : 0}px)`, transition: "transform 150ms cubic-bezier(0.215, 0.610, 0.355, 1)" }}>
                                <SavedAnswer setTranslate={setTranslate} obj={answer} delSelf={delAnswer} i={i} id={`saved-answer-${i}`} />
                            </div>
                        ) ) :
                        <div style={{display: "flex", flexDirection: "column", alignContent: "center", width: window.innerWidth}}>
                            <hr/>
                            <p>Looks like you haven't saved any answers yet</p>
                            <p>You can save answers by pressing the
                                <img className="inline-img" src={require("pictures/bookmark.png")} alt="bookmark" />
                            </p>
                            <p>when viewing an answer.</p>
                        </div>
                }
            </main>
        </div>
    )
}




function SavedAnswer({ obj, delSelf, i, id, setTranslate }) {

    const [open, setOpen] = useState(false);
    const [ansOpen, setAnsOpen] = useState(true);
    const [maxHeight, setMaxHeight] = useState('100%');
    const [transition, setTransition] = useState(false);
    const [height, setHeight] = useState('100%');

    const unmount = () => {
        setTranslate(i);
        setHeight(0);
        setTimeout(() => {
            setTranslate(10000000);
        }, 260);
        setTimeout(() => {
            delSelf(i);
        }, 310);
    }

    useEffect(() => {
        let totHeight = document.getElementById(`${id}-wrapper`).getBoundingClientRect().height;
        let quesHeight = document.getElementById(`${id}-question`).getBoundingClientRect().height;
        setHeight(quesHeight + 20)
        setMaxHeight(totHeight);
        setOpen(false);
        setAnsOpen(false);
        setTimeout(() => setTransition(true), 50);
        //eslint-disable-next-line
    }, [])

    const openClick = () => {
        if (open){
            setTimeout(() => setAnsOpen(false), 300);
        } else {
            setAnsOpen(true);
        }
        setOpen(!open);
    }

    let answer = obj.answer;
    let ansLength = answer.length;
    return (
        <div className="savedAnswerWrapper">
            <div
                className={`savedAnswer ${transition ? 'height-trans' : ''}`}
                id={`${id}-wrapper`}
                onClick={openClick}
                style={{ height: open ? maxHeight : height }}
            >
                <p id={`${id}-question`} className="info" style={{margin: 10}}>{ obj.question }</p>
                {
                    !ansOpen ? null :
                        <>
                            <div className="info" style={{marginTop: 0, marginBottom: 10, flexDirection: "column", alignItems: "center"}}>
                                {
                                    answer.slice(0, ansLength - 1).map((item, i) => (
                                        <p style={{marginBottom: 15}} key={obj.question + '-' + i}>{item}</p>
                                    ))
                                }
                            </div>
                            <button className="deleteSavedAnswer" onClick={unmount}>
                                <img src={require("pictures/delete.png")} alt="trash"/>
                            </button>
                        </>
                }
            </div>
        </div>
    )
}