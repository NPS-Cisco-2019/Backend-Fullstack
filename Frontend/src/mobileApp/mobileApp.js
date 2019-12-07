import React from "react";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";

import { init } from "functions/localStorageHandleing";

import MainPage from "./mainPage";
import AnswerPage from "./answerPage";
import Unknown from "shared/404";
import SettingsPage from "./settings";
import GradeChoice from "./gradeChoice";
import Tutorial from "./tutorial";
import SavedAnswerPage from "./savedAnswersPage";
import StartScreen from "./startScreen";

import "style/animations.css";
import "style/mobileApp.css";
import "style/hamburger.css";

// ANCHOR Main Mobile App that renders various mobile pages

init();

let newPerson = sessionStorage.getItem("new") === "true";

class MobileApp extends React.Component {
    constructor(props) {
        super(props);

        const details = JSON.parse(localStorage.getItem("lastAns"));

        this.state = {
            question: details.question,
            answers: details.answers,
            websites: details.websites,
            backToCam: false
        };

        setTimeout(() => {
            this.started = true;
        }, 100);
        this.changeState = this.changeState.bind(this);
        this.backToCamera = this.backToCamera.bind(this);

        if (newPerson) {
            this.props.history.push("/?new=true");
        }
    }

    // Passed to child <MainPage /> to allow it to change the Parent state to show answer
    changeState(question, answers, websites) {
        localStorage.setItem("lastAns", JSON.stringify({ question, answers, websites }));
        this.setState({ question, answers, websites });
    }

    // Passed to child <AnswerPage /> to allow it to change the Parent state to show picture mode
    backToCamera() {
        this.setState({ backToCam: true });
        setTimeout(() => {
            this.setState({ backToCam: false });
            this.props.history.push("/Picture");
        }, 500);
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route
                        path="/Answer"
                        render={() => (
                            <AnswerPage
                                question={this.state.question}
                                answers={this.state.answers}
                                websites={this.state.websites}
                                backClick={this.backToCamera}
                            />
                        )}
                    />

                    <Route
                        path="/Picture"
                        render={() => <MainPage changeState={this.changeState} />}
                    />

                    <Route
                        path="/Settings"
                        render={() => <SettingsPage backClick={this.backToCamera} />}
                    />

                    <Route
                        path="/Saved Answers"
                        render={() => <SavedAnswerPage backClick={this.backToCamera} />}
                    />

                    <Route path="/GradeChoice" component={GradeChoice} />

                    <Route
                        path="/Tutorial"
                        render={() => <Tutorial backClick={this.backToCamera} />}
                    />

                    <Route path="/BlackScreen" render={() => <div></div>} />

                    <Route path="/Unknown" component={Unknown} />

                    <Route exact path="/" component={StartScreen} />

                    {this.started ? (
                        <Route path="*" render={() => <Redirect to="/Unknown" />} />
                    ) : null}
                </Switch>
                {!this.state.backToCam ? null : (
                    <MainPage changeState={this.changeState} backToCam={true} />
                )}
            </div>
        );
    }
}

export default withRouter(MobileApp);
