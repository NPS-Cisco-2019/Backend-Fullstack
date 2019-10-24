// SECTION imports
import React from 'react';
import { Back, Answer } from './elements';
import './mobileApp.css';
import './animations.css'
import Swipe from 'react-easy-swipe';
import { Route, Link, Switch, withRouter } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
// !SECTION

// SECTION Inline Styles
const botNavStyle = {
    width: window.innerWidth/3,
    margin: 0
}

const webStyle = {
    fontSize: '1.2em',
    margin: 0,
    position: 'fixed',
    zIndex: 69
}

const container = {
    position: 'absolute',
    margin: 0,
    top: window.innerHeight / 11,
    width: window.innerWidth,
    padding: window.innerWidth / 20,
    justifyItems: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    paddingTop: 0,
    paddingBottom: 7 * window.innerHeight / 100,
    overflow: 'hidden',
    backgroundColor: 'var(--backCol)'
}

const infoStyle = {
    boxSizing: 'border-box',
    borderRadius: window.innerWidth/50,
    width: 9 * window.innerWidth/10,
    padding: 10,
    margin: '1.4% 0'
}
// !SECTION

class MobileAppAnswer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            num: 0,
            lastNum: (this.props.answers).length,
            showMenu: false,
            backToAns: false
        }
        
        this.props.history.push('/Answer/answer0');

        this.maxHeight = 0;

        document.body.style.overflowX = 'hidden';
        document.documentElement.style.setProperty('--popupHeight', this.props.websites.length * window.innerHeight/13 + 'px');

        // SECTION function bindings
        this.jumpto = this.jumpto.bind(this);
        this.backClick = this.backClick.bind(this);
        this.nextClick = this.nextClick.bind(this);
        this.swipeNext = this.swipeNext.bind(this);
        this.swipeBack = this.swipeBack.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.returnToAnswer = this.returnToAnswer.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        // !SECTION
    }

    /* SECTION FUNCTIONS */

    jumpto(e){
        this.props.history.push(`/Answer/answer${e.target.value}`);
        this.setState({num: e.target.value});
        this.returnToAnswer();
        setTimeout(() => {
            let websitePosition = document.getElementById('websitePosition').getBoundingClientRect();
            this.setState({pos: {top: websitePosition.top, left: websitePosition.left}})
        }, 260)
    }

    handleMenuClick(){
        this.setState({ showMenu: true });
    }

    returnToAnswer(){
        this.setState({ backToAns: true })
        setTimeout(() => {
            this.setState({ showMenu: false, backToAns: false });
        }, 299);
    }

    // handles click of the Back button
    handleClick(){
        this.setState({backToCam: true});
        this.props.backClick('answer');
    }

    // goes to previous answer
    backClick(){
        this.setState({num: this.state.num - 1});
        setTimeout(() => {
            let websitePosition = document.getElementById('websitePosition').getBoundingClientRect();
            this.setState({pos: {top: websitePosition.top, left: websitePosition.left}})
        }, 260)
    }

    // goes to next answer
    nextClick(){
        this.setState({num: this.state.num + 1});
        setTimeout(() => {
            let websitePosition = document.getElementById('websitePosition').getBoundingClientRect();
            this.setState({pos: {top: websitePosition.top, left: websitePosition.left}})
        }, 260)
    }

    // SECTION swipe functions
    swipeNext(){
        if (this.state.num < this.state.lastNum - 1){
            this.nextClick();
            this.props.history.push(`/Answer/answer${this.state.num + 1}`)
        }
    }

    swipeBack(){
        if (this.state.num > 0){
            this.backClick();
            this.props.history.push(`/Answer/answer${this.state.num - 1}`)
        }
    }
    // !SECTION

    componentDidMount(){
        let websitePosition = document.getElementById('websitePosition').getBoundingClientRect();
        this.setState({pos: {top: websitePosition.top, left: websitePosition.left}});

        let ansContainer = document.getElementById('ansContainer').getBoundingClientRect();
        let bot = document.getElementById('bot').getBoundingClientRect();

        this.maxHeight = window.innerHeight - ansContainer.top - bot.height;
        this.forceUpdate();
    }
    /* !SECTION */

    render(){
        const back = this.state.num > 0;
        const next = this.state.num < this.state.lastNum - 1;
        let len = this.props.answers.length;
        return (
            <div style={{minHeight: window.innerHeight, position: "absolute", width: window.innerWidth}} className={this.state.backToCam ? "slideout" : ""}>
                {/* SECTION Back Button */}
                <header className="top fadein" style={{height: Math.round(window.innerHeight/11)}} id="head">
                    <Back handleClick={this.handleClick} />
                    <p style={{fontSize: '1.2em', margin: 0, visibility: 'hidden'}} id="websitePosition">{this.props.websites[this.state.num]}</p>
                </header>
                {/* !SECTION */}
                {/* SECTION Website displayer */}
                {/* NOTE Its in a seperate Route because of different */}
                <Route render={({location}) => (
                    <TransitionGroup>
                        <CSSTransition
                            timeout={700}
                            classNames="fade"
                            key={location.key}
                        >
                            <Switch location={location}>
                                <Route path="/Answer/answer0" render={() => (
                                    <p style={{...webStyle, ...this.state.pos}}>{this.props.websites[0]}</p>
                                )} />

                                <Route path="/Answer/answer1" render={() => (
                                    <p style={{...webStyle, ...this.state.pos}}>{this.props.websites[1]}</p>
                                )} />

                                <Route path="/Answer/answer2" render={() => (
                                    <p style={{...webStyle, ...this.state.pos}}>{this.props.websites[2]}</p>
                                )} />

                                <Route path="/Answer/answer3" render={() => (
                                    <p style={{...webStyle, ...this.state.pos}}>{this.props.websites[3]}</p>
                                )} />

                                <Route path="/Answer/answer4" render={() => (
                                    <p style={{...webStyle, ...this.state.pos}}>{this.props.websites[4]}</p>
                                )} />
                            </Switch>
                        </CSSTransition>
                    </TransitionGroup>
                )} />
                {/* !SECTION */}
                {/* SECTION Answer displayer */}
                <div style={container}>
                    <div className="info" style={infoStyle} id="question">
                        <p style={{margin: 0}}>{this.props.question}</p>
                    </div>
                    <Swipe
                        onSwipeLeft={this.swipeNext}
                        onSwipeRight={this.swipeBack}
                        tolerance={100}
                    >
                        <div className="answerContainer fadein" style={{transform: `translateX(-${this.state.num * 110}%)`, height: this.maxHeight}} id="ansContainer">
                            {
                                this.props.answers.map((item, i) => (
                                    <Answer question={this.props.question} answer={item} key={this.props.websites[i]} id={`p${i}`} />
                                ))
                            }
                        </div>
                    </Swipe>
                </div>
                {/* !SECTION */}
                {
                    !this.state.showMenu ? null :
                    (<div>
                        <div style={{position: 'absolute',
                                    width: window.innerHeight,
                                    height: window.innerHeight,
                                    top: 0,
                                    backgroundColor: 'black',
                                    opacity: 0.6,
                                    animation: '300ms fadeto06'}}
                            onClick={this.returnToAnswer} className={this.state.backToAns ? 'end06' : null}></div>
                        <ul style={{height: len * window.innerHeight/13, width: window.innerWidth/2, left: window.innerWidth/4,
                                    bottom: 7 * window.innerHeight / 100}} className={`menu-ul ${this.state.backToAns ? 'end' : null}`}>
                            {this.props.websites.map((website, i) => (
                                <li key={website} value={i} style={{height: window.innerHeight/15, bottom: i*window.innerHeight/14, animation: `fadein 400ms linear ${i * 200 / len}ms`}} className="menu-li" onClick={this.jumpto}>{website}</li>
                            ))}
                        </ul>
                    </div>)
                }
                {/* SECTION Bottom Navigation */}
                <div className="bot fadein" id="bot">
                    {back ?
                    <Link to={`/Answer/answer${this.state.num-1}`}>
                        <p className="botItem button" style={{...botNavStyle, opacity: 1}} onClick={this.backClick}>{'< Back'}</p>
                    </Link>:
                    <p className="botItem button" style={{...botNavStyle, opacity: 0.5}}>{'< Back'}</p>}
                    
                    <p className="botItem" style={botNavStyle} onClick={this.handleMenuClick}>Answer {this.state.num + 1}</p>

                    {next ?
                    <Link to={`/Answer/answer${this.state.num+1}`}>
                        <p className="botItem button" style={{...botNavStyle, opacity: 1}} onClick={this.nextClick}>{'Next >'}</p>
                    </Link> :
                    <p className="botItem button" style={{...botNavStyle, opacity: 0.5}}>{'Next >'}</p>}
                </div>
                {/* !SECTION */}
            </div>
        )
    }
}

export default withRouter(MobileAppAnswer);



MobileAppAnswer.protoTypes = {
    question: PropTypes.string.isRequired,
    answers: PropTypes.array.isRequired,
    websites: PropTypes.array.isRequired,
    backClick: PropTypes.func.isRequired
}