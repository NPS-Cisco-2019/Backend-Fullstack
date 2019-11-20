// SECTION imports
import React from 'react';
import Swipe from 'react-easy-swipe';
import { Route, Link, Switch, withRouter } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';

import styles from 'style/style';
import { Back, Answer } from 'shared/elements';
// !SECTION

let { botNavStyle, webStyle, container, infoStyle, navObj } = styles;


class AnswerPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            num: 0,
            lastNum: (this.props.answers).length,
            showMenu: false,
            backToAns: false,
            selectedArr: createArr(this.props.answers.length)
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
        this.saveAnswer = this.saveAnswer.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.returnToAnswer = this.returnToAnswer.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        // !SECTION
    }

    /* SECTION FUNCTIONS */

    saveAnswer() {
        let savedAnswers = JSON.parse(localStorage.getItem('savedAnswers'));
        savedAnswers.push({
            question: `${this.props.question} -${this.props.websites[this.state.num]}`,
            answer: this.props.answers[this.state.num]
        });
        localStorage.setItem('savedAnswers', JSON.stringify(savedAnswers));

        let arr = this.state.selectedArr;
        arr[this.state.num] = true;
        this.setState({ selectedArr: arr });
        setTimeout(() => {
            this.forceUpdate();
        }, 50);
    }

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
        this.setState({ showMenu: !this.state.showMenu });
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
        let selected = this.state.selectedArr[this.state.num]
        return (
            <div style={{ minHeight: window.innerHeight, position: "absolute", width: window.innerWidth }} className={this.state.backToCam ? "slideout" : ""}>
                {/* SECTION Back Button */}
                <header className="top fadein" style={{ height: Math.round(window.innerHeight/11), gridTemplateColumns: "2fr 7fr 3fr" }} id="head">
                    <Back handleClick={this.handleClick} />
                    <p style={{fontSize: '1.2em', margin: 0, visibility: 'hidden'}} id="websitePosition">{this.props.websites[this.state.num]}</p>
                    <div style={navObj}>
                        <div className="bookmark-holder" style={{
                            padding: (10/100) * (69/100) * window.innerHeight / 7,
                            backgroundColor: selected ? "var(--highlightCol)" : "transparent"
                        }} onClick={this.saveAnswer}>
                            <img className="nav-img" src={require("pictures/bookmark.png")} alt="bookmark" />
                        </div>
                    </div>
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
                        <p style={{margin: 0, fontWeight: 400}}>{this.props.question}</p>
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
                                <li
                                    key={website}
                                    value={i}
                                    style={{
                                        height: window.innerHeight/15,
                                        bottom: i*window.innerHeight/14,
                                        animation: `fadein 400ms linear ${i * 200 / len}ms`
                                    }}
                                    className="menu-li"
                                    onClick={this.jumpto}
                                >{website}</li>
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

                    <button className="botItem" style={botNavStyle} onClick={this.handleMenuClick}>
                        <div className={`hamburger hamburger--collapse ${this.state.showMenu ? 'is-active' : ''}`}>
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span>
                            </span>
                        </div>
                        <p style={{margin: 0}}>
                            Answer {this.state.num + 1}
                        </p>
                    </button>

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

export default withRouter(AnswerPage);

function createArr(len){
    let arr = []
    for (let i = 0; i < len; i++){
        arr.push(false);
    }
    return arr;
}

AnswerPage.protoTypes = {
    question: PropTypes.string.isRequired,
    answers: PropTypes.array.isRequired,
    websites: PropTypes.array.isRequired,
    backClick: PropTypes.func.isRequired
}