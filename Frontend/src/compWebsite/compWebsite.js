// SECTION imports
import React from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { Firefox, Chrome, Safari } from 'shared/tutorialElements';
import Unknown from 'shared/404';
import  browser from 'functions/browserDetection';
import 'style/desktopApp.css';
import 'style/animations.css';
// !SECTION

const highlightStyle = {
  position: 'absolute',
  borderBottomStyle: 'solid',
  borderBottomWidth: 2,
  transition:  'all 1500ms cubic-bezier(0.075, 0.82, 0.165, 1), border-bottom-color 1500ms cubic-bezier(0.645, 0.045, 0.355, 1), width 1500ms linear'
}
  
export default class CompApp extends React.Component {
  constructor(props){
    super(props);
    this.defaultLink = `/${browser[0].toUpperCase()}${browser.slice(1)}`;
    this.state = {
      browser: browser,
      firefox: { top:0, height:0, left:0, width:0, borderBottomColor: 'rgb(200, 0, 0)' },
      chrome: { top:0, height:0, left:0, width:0, borderBottomColor: 'rgb(18, 218, 0)' },
      safari: { top:0, height:0, left:0, width:0, borderBottomColor: 'rgb(0, 0, 255)' },
      headHeight: 0,
      currentScrollHeight: 0
    }
    
    // SECTION function bindings
    this.handleClick = this.handleClick.bind(this);
    this.calcHighlight = this.calcHighlight.bind(this);
    this.calcBrowserPos = this.calcBrowserPos.bind(this);
    this.changeHeadHeight = this.changeHeadHeight.bind(this);
    this.calcHighlightTop = this.calcHighlightTop.bind(this);
    // !SECTION
  }

  /* SECTION FUNCTIONS */

  calcHighlightTop(){
    const obj = document.getElementById('firefox').getBoundingClientRect();
    return Math.round(obj.top - this.state.headHeight + this.state.currentScrollHeight);
  }

  // calculates position of selected highlighter
  calcHighlight(browser, highlightTop){
    const obj = document.getElementById(browser).getBoundingClientRect();
    // NOTE WARNING THROWN HERE, BE CAREFUL
    // eslint-disable-next-line
    this.state[browser] = {
          top: highlightTop,
          height: Math.round(obj.height),
          left: obj.left,
          width: Math.round(obj.width),
          borderBottomColor: this.state[browser].borderBottomColor
        }
  }

  // gets the height of the header
  // NOTE seems to return 0 every time but breaks if its removed :/
  changeHeadHeight(){
    const head = document.getElementById('head');
    this.setState({headHeight: head.clientHeight});
  }

  // handles changing of tutorial
  handleClick(e){
    const browser = e.currentTarget.className;
    
    this.setState({ browser: browser });
  }

  // calculate the highlight for all browsers
  calcBrowserPos(){
    let highlightTop = this.calcHighlightTop();

    let l = ['firefox', 'chrome', 'safari'];
    for (let i = 0; i<3; i++){
        this.calcHighlight(l[i], highlightTop);
    }
    this.setState({ highlightTop })
  }

  // SECTION Life Cycle Components
  componentDidMount() {
    // used to determine opacity of header
    window.onscroll =()=>{
      this.setState({currentScrollHeight: window.scrollY})
    }

    // calculates header height and highlight positions
    this.calcBrowserPos();
    this.changeHeadHeight();

    setTimeout(() => this.forceUpdate(), 100);

    // makes the browser recalculate the above if window dimensions change
    window.addEventListener('resize', this.calcBrowserPos);
    window.addEventListener('resize', this.changeHeadHeight);

    // makes the highlight render
    this.setState({mounted: true});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calcBrowserPos);
    window.removeEventListener('resize', this.changeHeadHeight);
  }
  // !SECTION

  /* !SECTION */

  render(){
    if (this.state.mounted && this.state.highlightTop !== this.calcHighlightTop()){
      this.calcBrowserPos();
    }
    // opacity for header
    let opacity = Math.max(Math.min(50 / this.state.currentScrollHeight  , 1), 0.7);
    return(
      <BrowserRouter basename="/Frontend">
        <div className="App deskApp">
          <header className="deskHead" style={{opacity: opacity}} id="head">
            <h1>This app is not supported on Computers.</h1>
          </header>
          <div className="body" style={{top: this.state.headHeight}} id="main">
            {/* SECTION Main section, contains about and navlinks to tutorials */}
            <div className="description">
              <div style={{...highlightStyle, ...this.state[this.state.browser]}}></div>
              <p style={{fontSize: "1.3em", marginBottom: 30, textAlign: "center"}}>Insert name here is a problem solving app, just take a picture and the app automatically scans the web to find the best answers for you.(this is temporary and not complete). Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <h2>Go to your mobile phone in one of the following browsers and follow these tutorials to install it.</h2>
              <div className="logos">
                <Link to="/Firefox">
                  <button className="firefox" onClick={this.handleClick}>
                    <img className="desk img" id="Firefox" src={require("pictures/firefox.png")} alt="firefox" />
                    <label htmlFor="Firefox" id="firefox">Firefox</label>
                  </button>
                </Link>
                <Link to="/Chrome">
                  <button className="chrome" onClick={this.handleClick}>
                    <img className="desk img" id="Chrome" src={require("pictures/chrome.png")} alt="chrome"/>
                    <label htmlFor="Chrome" id="chrome">Chrome</label>
                  </button>
                </Link>
                <Link to="/Safari">
                  <button className="safari" onClick={this.handleClick}>
                    <img className="desk img" id="Safari" src={require("pictures/safari.png")} alt="safari"/>
                    <label htmlFor="Safari" id="safari">Safari</label>
                  </button>
                </Link>
              </div>
            </div>
            {/* !SECTION */}
            {/* SECTION Tutorials */}
            <Route render={({location}) => {return (
              <TransitionGroup style={{overflow: 'hidden', marginTop: 30}}>
                <CSSTransition
                  timeout={1500}
                  classNames="dipReplace"
                  key={location.key}
                >
                  <Switch location={location}>
                    <Route exact path="/Firefox" component={Firefox} />
                    <Route exact path="/Chrome" component={Chrome} />
                    <Route exact path="/Safari" component={Safari} />
                    <Route path="/" render={() => {return (
                      <Redirect to={this.defaultLink} />
                    )}} />
                    <Route path="/Unknown" component={Unknown} />
                    <Route render={() => (<Redirect to="/Unknown" />)} />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            )}} />
            {/* !SECTION */}
          </div>
        </div>
      </BrowserRouter>
    )
  }
}