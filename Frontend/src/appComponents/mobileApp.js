import React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import MobileAppPicture from './mobileWebsiteCamera';
import MobileAppAnswer from './mobileWebsiteAnswer';
import testDetails from '../test';
import Unknown from './404';
import SettingsPage from './settings';
import GradeChoice from './gradeChoice';
import Tutorial from './mobileTutorial';
import { init } from '../localStorageHandleing';
import "./hamburger.css"

// ANCHOR Main Mobile App that renders various mobile pages
// NOTE gets called by <App />, does not render by itself

init();
// eslint-disable-next-line
let newPerson = sessionStorage.getItem('new') === "true";

class MobileApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      question: testDetails.question,
      answers: testDetails.answers,
      websites: testDetails.websites,
      backToCam: false
    }

    setTimeout(() => { this.started = true; },100);
    this.changeState = this.changeState.bind(this);
    this.changeDisplayAnswer = this.changeDisplayAnswer.bind(this);

    const query = new URLSearchParams(this.props.location.search);

    if (query.get("type") === "unknown"){
      console.log("YEET");
      this.props.history.push("/Unknown");
    } else {
      this.props.history.push(newPerson ? '/GradeChoice' : '/Picture')
      // TODO delete below history.pushes, the one above is correct
      // this.props.history.push(false ? '/Answer' : '/Picture' );
      // this.props.history.push('/Settings');
    }
  }

  // Passed to child <MobileAppPicture /> to allow it to change the Parent state to show answer
  changeState(question, answers, websites){
    this.setState({question: question, answers: answers, websites: websites});
  }

  // Passed to child <MobileAnswerApp /> to allow it to change the Parent state to show picture mode
  changeDisplayAnswer(){
    this.setState({ backToCam: true });
    setTimeout(() => {
      this.setState({backToCam: false});
      this.props.history.push('/Picture');
    }, 500);
  }

  render(){
    return (
      <div>
        <Switch>
          <Route path="/Answer" render={() => (
            <MobileAppAnswer question={this.state.question} answers={this.state.answers} websites={this.state.websites} backClick={this.changeDisplayAnswer} />
          )} />
          
          <Route path="/Picture" render={() => (
            <MobileAppPicture changeState={this.changeState} />
          )} />

          <Route path="/Settings" render={() => (
            <SettingsPage backClick={this.changeDisplayAnswer} />
            )} />

          <Route path="/GradeChoice" component={GradeChoice} />

          <Route path="/Tutorial" render={() => (
            <Tutorial backClick={this.changeDisplayAnswer} />
          )} />

          <Route path="/BlackScreen" render={() => (
            <div></div>
          )} />
            
          <Route path="/Unknown" component={Unknown} />

          {this.started ? <Route path="*" render={() => (<Redirect to="/Unknown" />)} /> : null}
        </Switch>
        {
          !this.state.backToCam ? null :
          <MobileAppPicture changeState={this.changeState} backToCam={true} />
        }
      </div>
    );
  }
}


export default withRouter(MobileApp);