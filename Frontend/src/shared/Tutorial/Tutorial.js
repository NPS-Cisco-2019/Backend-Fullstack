import React, { useEffect, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Route, Switch, Redirect, Link } from "react-router-dom";

import { Firefox, Chrome, Safari } from "./tutorialElements";
import browser from "functions/browserDetection";
import Unknown from "shared/404";

const highlightStyle = {
    position: "absolute",
    borderBottomStyle: "solid",
    borderBottomWidth: 2,
    transition:
        "all 1500ms cubic-bezier(0.075, 0.82, 0.165, 1), border-bottom-color 1500ms cubic-bezier(0.645, 0.045, 0.355, 1), width 1500ms linear"
};

function Tutorial({ headHeight = 0 }) {
    const [mounted, setMounted] = useState(false);
    const [highlightTop, setHighlightTop] = useState(0);
    const [curBrowser, setCurBrowser] = useState(browser);
    const [browsers, setBrowsers] = useState({
        firefox: {
            top: 0,
            height: 0,
            left: 0,
            width: 0,
            borderBottomColor: "rgb(200, 0, 0)"
        },
        chrome: {
            top: 0,
            height: 0,
            left: 0,
            width: 0,
            borderBottomColor: "rgb(18, 218, 0)"
        },
        safari: {
            top: 0,
            height: 0,
            left: 0,
            width: 0,
            borderBottomColor: "rgb(0, 0, 255)"
        }
    });

    useEffect(() => {
        setMounted(false);
        calcBrowserPos();

        setTimeout(() => setMounted(true), 100);

        window.addEventListener("resize", calcBrowserPos);

        return () => {
            window.removeEventListener("resize", calcBrowserPos);
        };
    }, []);

    /* SECTION FUNCTIONS */

    const calcHighlightTop = () => {
        const obj = document.getElementById("firefox").getBoundingClientRect();
        console.log(obj.top, window.scrollY);
        return Math.round(obj.top - headHeight);
    };

    // calculates position of selected highlighter
    const calcHighlight = (newBrowsers, browser, highlightTop) => {
        const obj = document.getElementById(browser).getBoundingClientRect();
        newBrowsers[browser] = {
            top: highlightTop,
            height: Math.round(obj.height),
            left: obj.left,
            width: Math.round(obj.width),
            borderBottomColor: browsers[browser].borderBottomColor
        };
        return newBrowsers;
    };

    // handles changing of tutorial
    const handleClick = e => {
        const newBrowser = e.currentTarget.className;

        setCurBrowser(newBrowser);
    };

    // calculate the highlight for all browsers
    const calcBrowserPos = () => {
        let newHighlightTop = calcHighlightTop();
        let newBrowsers = { ...browsers };

        let l = ["firefox", "chrome", "safari"];
        for (let i = 0; i < 3; i++) {
            newBrowsers = calcHighlight(newBrowsers, l[i], newHighlightTop);
        }
        setHighlightTop(newHighlightTop);
        setBrowsers(newBrowsers);
    };

    /* !SECTION */

    const defaultLink = `/${browser[0].toUpperCase()}${browser.slice(1)}`;

    if (mounted && highlightTop !== calcHighlightTop()) {
        calcBrowserPos();
    }

    return (
        <>
            <div
                style={{
                    ...highlightStyle,
                    ...browsers[curBrowser]
                }}
            />
            <div className="logos">
                <Link to="/Firefox">
                    <button className="firefox" onClick={handleClick}>
                        <img
                            className="desk img"
                            id="Firefox"
                            src={require("pictures/firefox.png")}
                            alt="firefox"
                        />
                        <label htmlFor="Firefox" id="firefox">
                            Firefox
                        </label>
                    </button>
                </Link>
                <Link to="/Chrome">
                    <button className="chrome" onClick={handleClick}>
                        <img
                            className="desk img"
                            id="Chrome"
                            src={require("pictures/chrome.png")}
                            alt="chrome"
                        />
                        <label htmlFor="Chrome" id="chrome">
                            Chrome
                        </label>
                    </button>
                </Link>
                <Link to="/Safari">
                    <button className="safari" onClick={handleClick}>
                        <img
                            className="desk img"
                            id="Safari"
                            src={require("pictures/safari.png")}
                            alt="safari"
                        />
                        <label htmlFor="Safari" id="safari">
                            Safari
                        </label>
                    </button>
                </Link>
            </div>

            <Route
                render={({ location }) => {
                    return (
                        <TransitionGroup style={{ overflow: "hidden", marginTop: 30 }}>
                            <CSSTransition
                                timeout={1500}
                                classNames="dipReplace"
                                key={location.key}
                            >
                                <Switch location={location}>
                                    <Route exact path="/Firefox" component={Firefox} />
                                    <Route exact path="/Chrome" component={Chrome} />
                                    <Route exact path="/Safari" component={Safari} />
                                    <Route
                                        path="/"
                                        render={() => {
                                            return <Redirect to={defaultLink} />;
                                        }}
                                    />
                                    <Route path="/Unknown" component={Unknown} />
                                    <Route render={() => <Redirect to="/Unknown" />} />
                                </Switch>
                            </CSSTransition>
                        </TransitionGroup>
                    );
                }}
            />
        </>
    );
}

export default Tutorial;
