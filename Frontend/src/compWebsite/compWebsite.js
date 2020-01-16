// SECTION imports
import React from "react";

import Tutorial from "shared/Tutorial";
import "style/desktopApp.css";
import "style/animations.css";
// !SECTION

export default class CompApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headHeight: 0
        };
    }

    changeHeadHeight = () => {
        const head = document.getElementById("head");
        this.setState({ headHeight: head.clientHeight });
    };

    // SECTION Life Cycle Components
    componentDidMount() {
        this.changeHeadHeight();
        window.addEventListener("resize", this.changeHeadHeight);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.changeHeadHeight);
    }
    // !SECTION

    render() {
        // opacity for header
        let opacity = Math.max(Math.min(50 / window.scrollY, 1), 0.7);
        return (
            <div className="App deskApp">
                <header className="deskHead" style={{ opacity }} id="head">
                    <h1>This app is not supported on Computers.</h1>
                </header>
                <div
                    className="body"
                    style={{ top: this.state.headHeight }}
                    id="main"
                >
                    {/* SECTION Main section, contains about and navlinks to tutorials */}
                    <div className="description">
                        <p
                            style={{
                                fontSize: "1.15rem",
                                marginBottom: 30
                            }}
                        >
                            SnapSearch is a problem solving app, just take a
                            picture and the app automatically scans the web to
                            find the best answers for you.
                            <br />
                            <br />
                            <br />
                            This app aims to provide instant solutions to
                            problems in science subjects at the high school
                            level. The user can provide an image of the question
                            or simply enter it in a prompt.
                            <br />
                            <br />
                            SnapSearch sources answers from the internet,
                            subject to a unique ranking system.
                            <br />
                            <br />
                            Features of SnapSearch:
                            <br />
                            <ol>
                                <li>
                                    Gives access to quality quality answers from
                                    the best of websites.
                                </li>

                                <li>
                                    Converts images to text by using and hence
                                    saves effort of typing.
                                </li>

                                <li>
                                    Allows users to navigate between answers
                                    seamlessly through a simple swipe.
                                </li>

                                <li>
                                    Enables users to save answers for later.
                                </li>
                            </ol>
                        </p>
                        <h2>
                            Go to your mobile phone in one of the following
                            browsers and follow these tutorials to install it.
                        </h2>
                    </div>
                    {/* !SECTION */}
                    <Tutorial headHeight={this.state.headHeight} />
                </div>
            </div>
        );
    }
}
