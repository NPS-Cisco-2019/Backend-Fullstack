// SECTION imports
import React from "react";
import Swipe from "react-easy-swipe";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Loader from "react-spinners/CircleLoader";
import { css } from "@emotion/core";

import { BookmarkNav, SettingsNav, GalleryNav } from "./Nav";
import { Back, Img } from "shared/elements";
import Subject from "./Subject";
import notification from "shared/notification";
import { OCR, scrape } from "functions/backendHandling";
// import Camera from "./camera";
import Webcam from "react-webcam";

import style from "style/style";
import HelpOverlay from "./HelpOverlay";
import toShowHelp from "functions/showHelp";
// !SECTION

const width = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;

const maxLength = (10 / 100) * (69 / 100) * width;
let { imgContainerStyle, captureButtonStyle, imgStyle, videoConstraints } = style;

let pressDelay = localStorage.getItem("pressDelay");
const vibratable = "vibrate" in navigator;

const overide = css`
  postion: relative;
  top: -1px;
  left: -1px;
`;

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      output: "vid",
      picture: require("pictures/default.png"),
      selectedFile: null,
      footStyle: { backgroundColor: "var(--midGray2)" },
      ansClicked: false,
      quesStyle: {},
      gotQuestion: false,
      question: "",
      navButton: BookmarkNav,
      isLoading: false,
      imageSelector: false,
      startCoords: [-1, -1],
      endCoords: [-1, -1],
      rotation: 0,
      showHelp: toShowHelp(1)
    };

    this.screenWd = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
    this.screenHt = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;

    document.body.style.overflowX = "auto";

    // SECTION function binding
    this.OCR = this.OCR.bind(this);
    this.submit = this.submit.bind(this);
    this.capture = this.capture.bind(this);
    this.swipeUp = this.swipeUp.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.swipeDown = this.swipeDown.bind(this);
    this.backClick = this.backClick.bind(this);
    this.inputText = this.inputText.bind(this);
    this.rotateImg = this.rotateImg.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.showAnswer = this.showAnswer.bind(this);
    this.flipOutMode = this.flipOutMode.bind(this);
    this.showSettings = this.showSettings.bind(this);
    this.backendError = this.backendError.bind(this);
    this.showSavedAns = this.showSavedAns.bind(this);
    this.changeTextBox = this.changeTextBox.bind(this);
    this.canvasTouchMove = this.canvasTouchMove.bind(this);
    this.selectFileHandle = this.selectFileHandle.bind(this);
    this.canvasTouchStart = this.canvasTouchStart.bind(this);
    this.cameraErrorHandler = this.cameraErrorHandler.bind(this);
    // !SECTION
  }

  /* SECTION FUNCTIONS */

  // handles error recieved by Webcam component
  cameraErrorHandler(error) {
    console.log(error);
    this.setState({ picture: require("pictures/error.png"), output: "img" });
  }

  // changes whether picture or video is displayed
  flipOutMode(mode) {
    this.setState({ output: mode });
  }

  // sets state to include img seleced from gallery
  selectFileHandle(e) {
    const url = URL.createObjectURL(e.target.files[0]);
    this.setState({ picture: url, output: "img" });
  }

  // takes a picure and sets output mode
  capture() {
    const imageSrc = this.refs.webcam.getScreenshot();
    this.setState({
      picture: imageSrc,
      output: "img",
      navButtonAnimation: true
    });
    setTimeout(() => {
      this.setState({ navButton: Back });
    }, 150);
    setTimeout(() => {
      this.setState({ navButtonAnimation: false });
    }, 300);
  }

  // SECTION Handles orientation change
  componentDidMount() {
    setTimeout(() => {
      sessionStorage.setItem("fadePicture", false);
    }, 500);
    sessionStorage.setItem("helpSeen", 1);

    let canvas = document.getElementById("canvas");
    let c = canvas.getContext("2d");

    canvas.width = this.screenWd;
    canvas.height = this.screenHt;
    this.setState({ mounted: true, context: c });
  }

  // !SECTION

  rotateImg() {
    this.setState({ rotation: this.state.rotation + 1 });
  }

  // handles change from image mode back to video
  backClick() {
    this.setState(() => ({
      output: "vid",
      gotQuestion: false,
      swipedUp: false,
      navButtonAnimation: true,
      loading: false
    }));
    setTimeout(() => {
      this.setState({ navButton: BookmarkNav });
    }, 150);
    setTimeout(() => {
      this.setState({ navButtonAnimation: false });
    }, 300);
  }

  showSavedAns() {
    this.setState({
      footStyle: {
        backgroundColor: "var(--midGray2)",
        zIndex: 42
      }
    });
    setTimeout(() => {
      this.props.history.push("/Saved Answers");
    }, 800);
  }

  showSettings() {
    this.setState({
      footStyle: {
        backgroundColor: "var(--midGray2)",
        zIndex: 42
      }
    });
    setTimeout(() => {
      this.props.history.push("/Settings");
    }, 800);
  }

  // Utilizes parent function to change Parent state
  showAnswer() {
    if (this.state.isLoading) {
      notification("Please wait, the answer is loading");
      return;
    }

    if (!this.state.gotAnswer) {
      this.submit({ key: "Enter" });
      return;
    }
    this.props.changeState(this.state.question, this.state.answers, this.state.websites);

    let questionHeight = document.getElementById("question").getBoundingClientRect().height;
    let top = this.screenHt / 11 + (1.4 * questionHeight) / 100 + 4;

    this.setState({
      footStyle: {
        width: this.screenWd,
        backgroundColor: "var(--backCol)",
        margin: 0,
        borderRadius: 0
      },
      quesStyle: {
        top: top,
        margin: 0,
        borderRadius: this.screenWd / 50,
        padding: 10,
        position: "absolute"
      },
      ansClicked: true
    });
    setTimeout(() => {
      this.props.history.push("Answer");
    }, 600);
  }

  calculateBottom() {
    if (!this.state.gotQuestion || !this.state.mounted) {
      return (3 * this.screenHt) / 20;
    }

    let foot = document.getElementById("foot").getBoundingClientRect();

    let bottomHeight = this.state.ansClicked ? foot.height : this.calculateHeight();

    return Math.max(bottomHeight + 60, (3 * this.screenHt) / 20);
  }

  calculateHeight() {
    if (this.state.ansClicked) {
      return this.screenHt + 3;
    }

    if (!(this.state.gotQuestion && this.mounted)) {
      return 20;
    }

    let cont = document.getElementById("quesCont").getBoundingClientRect();
    return 50 + cont.height;
  }

  // SECTION  handles backend calling

  backendError(response) {
    notification(["An internal error occured", "Please try again. If this error comes multiple times, then try again later."], true);
    console.log({ response });
    this.setState({ isLoading: false, gotQuestion: false });
  }

  /* if image is taken for proccesing */
  async OCR() {
    this.setState({
      isTextBox: false,
      isLoading: true,
      gotAnswer: false,
      gotQuestion: false
    });

    let [startX, startY] = this.state.startCoords;
    let [endX, endY] = this.state.endCoords;

    // let imgRect = document.getElementById("image").getBoundingClientRect();

    startX += window.scrollX;
    startY += window.scrollY - this.screenHt / 10;
    endX += window.scrollX;
    endY += window.scrollY;

    let ocrJSON = {
      x: Math.min(endX, startX),
      y: Math.min(endY, startY),
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY),
      rotation: this.state.rotation % 4
    };

    let responseOCR = await OCR(this.state.picture, ocrJSON);
    // eslint-disable-next-line eqeqeq
    if (responseOCR.status != 200) {
      this.backendError(responseOCR);
      return;
    }
    let questionJSON = await responseOCR.json();
    let question = questionJSON.question;

    if (question === "TEXT NOT FOUND") {
      notification("Text was not found in the image.", true);
      this.setState({ isLoading: false });
      return;
    }

    this.setState({ question: question, gotQuestion: true });

    setTimeout(() => this.forceUpdate(), 3);

    console.log("question gotten");

    let responseScrapy = await scrape(this.state.question);

    // eslint-disable-next-line eqeqeq
    if (responseScrapy.status != 200) {
      this.backendError(responseScrapy);
      return;
    }
    let obj = await responseScrapy.json();
    if (obj.answers === "ERROR") {
      notification("No answers were found.", true);
      this.setState({ isLoading: false, gotQuestion: false });
      return;
    }

    this.setState({
      answers: obj.answers,
      websites: obj.websites,
      isLoading: false,
      gotAnswer: true
    });
    console.log("answers gotten");

    this.showAnswer();
  }

  /* Scraping function */
  async submit(e) {
    if (e.key === "Enter") {
      this.setState({ isTextBox: false, isLoading: true, gotAnswer: false });
      let response = await scrape(this.state.question);
      // eslint-disable-next-line eqeqeq
      if (response.status != 200) {
        this.backendError(response);
        return;
      }
      let obj = await response.json();
      if (obj.answers === "ERROR") {
        notification("No answers were found.", true);
        this.setState({ isLoading: false, gotQuestion: false });
        return;
      }

      this.setState({
        answers: obj.answers,
        websites: obj.websites,
        isLoading: false,
        gotAnswer: true
      });
      console.log("answers gotten");
      setTimeout(() => this.showAnswer(), 75);
    }
  }

  // !SECTION

  // SECTION handles manually pulling up bottom section
  swipeUp() {
    if (this.state.gotQuestion) {
      return;
    }
    this.setState({ gotQuestion: true, isTextBox: true, output: "img" });
  }

  swipeDown() {
    if (!this.state.gotQuestion) {
      return;
    }
    this.setState({ gotQuestion: false, isTextBox: false });
  }
  // !SECTION

  inputText(e) {
    this.setState({ question: e.target.value });
  }

  changeTextBox() {
    this.setState({ isTextBox: !this.state.isTextBox });
  }

  // SECTION Handles pressing of the question when it is shown
  touchStart() {
    setTimeout(() => {
      if (!this.state.prevent) {
        this.setState({ longpress: true });
        if (vibratable) {
          navigator.vibrate(50);
        }
      } else {
        this.setState({ prevent: false });
      }
    }, pressDelay);
  }

  touchEnd() {
    if (!!this.state.longpress) {
      this.changeTextBox();
    } else if (!this.state.isTextBox) {
      this.showAnswer();
    }
    this.setState({ longpress: false, prevent: true });
  }

  canvasTouchStart(e) {
    this.setState({
      startCoords: [e.touches[0].pageX, e.touches[0].pageY]
    });
  }

  canvasTouchMove(e) {
    let endCoords = [e.touches[0].clientX, e.touches[0].clientY];

    let [startX, startY] = this.state.startCoords;
    let ctx = this.state.context;

    ctx.clearRect(0, 0, this.screenWd, this.screenHt);
    ctx.beginPath();
    ctx.strokeStyle = localStorage.getItem("highlightCol");
    ctx.lineWidth = 3;
    ctx.rect(startX, startY, endCoords[0] - startX, endCoords[1] - startY);
    ctx.stroke();

    this.setState({ endCoords });
  }

  //!SECTION

  /* !SECTION */

  render() {
    let func = this.state.output === "vid" ? this.capture : this.OCR;
    func = this.state.isTextBox ? () => this.submit({ key: "Enter" }) : func;
    const footerBottom = -(this.state.gotQuestion ? 3 : this.screenHt / 25);
    let bot = this.calculateBottom();
    let fadePicture = sessionStorage.getItem("fadePicture") === "true";

    return (
      <div
        className={`App ${this.props.backToCam ? "slidein" : fadePicture ? "fadein-short" : null}`}
        style={{
          minHeight: this.screenHt,
          position: "absolute",
          width: this.screenWd
        }}
      >
        {/* SECTION  NAV */}
        <header className="nav" style={{ height: Math.round(this.screenHt / 10) }}>
          <div id="bookmark-holder" className={this.state.navButtonAnimation ? "nav-button-animation" : null}>
            <this.state.navButton handleClick={this.backClick} showSavedAns={this.showSavedAns} />
          </div>
          <div id="settingsDiv">
            <SettingsNav showSettings={this.showSettings} />
          </div>
          <GalleryNav selectFileHandle={this.selectFileHandle} />
        </header>
        {/* !SECTION */}
        <canvas
          id="canvas"
          onTouchStart={this.state.imageSelector ? this.canvasTouchStart : null}
          onTouchMove={this.state.imageSelector ? this.canvasTouchMove : null}
          style={this.state.imageSelector ? {} : { pointerEvents: "none" }}
        />
        <HelpOverlay show={this.state.showHelp} handleExitClick={() => this.setState({ showHelp: false })} />
        <Swipe onSwipeUp={this.state.imageSelector ? null : this.swipeUp} onSwipeDown={this.state.imageSelector ? null : this.swipeDown}>
          <div>
            {/* SECTION Image/Video displayer */}
            <div
              style={{
                ...imgContainerStyle,
                height: Math.round((9 * this.screenHt) / 10),
                top: Math.round(this.screenHt / 10)
              }}
            >
              {this.state.output === "img" ? (
                <Img src={this.state.picture} rotation={this.state.rotation} />
              ) : (
                <Webcam
                  audio={false}
                  videoConstraints={videoConstraints}
                  onUserMediaError={this.cameraErrorHandler}
                  style={imgStyle}
                  screenshotFormat="image/jpeg"
                  id="camera"
                  ref="webcam"
                />
              )}
            </div>
            {/* !SECTION */}
            {/* SECTION Capture/Process buttom\n */}
            <div className="buttonHolder" style={{ top: this.screenHt / 10 + 10 }}>
              <div className="cropDiv">
                <button
                  className="imageSelector"
                  style={{
                    backgroundColor: this.state.imageSelector ? "var(--highlightCol)" : "var(--backCol2)"
                  }}
                  onClick={() =>
                    this.setState({
                      imageSelector: !this.state.imageSelector
                    })
                  }
                >
                  crop
                </button>
                <button className="clearButton" onClick={() => this.state.context.clearRect(0, 0, this.screenWd, this.screenHt)}>
                  clear
                </button>
              </div>
              <div className="rotateImgButton">
                <button onClick={this.rotateImg}>↻</button>
              </div>
              {localStorage.getItem("subjectSelector") === "Drop down on screen" ? <Subject /> : null}
            </div>
            <button
              style={{
                ...captureButtonStyle,
                bottom: bot
              }}
              onClick={func}
            >
              {this.state.output === "img" ? (
                this.state.isLoading ? (
                  <Loader css={overide} sizeUnit={"px"} size={maxLength} color={"#FFF"} loading={true} />
                ) : (
                  <img className="searchImg" src={require("pictures/search.png")} alt="search icon" />
                )
              ) : null}
            </button>
            {/* !SECTION */}
            {/* SECTION Bottom bar */}
            <footer
              style={{
                minHeight: Math.round(this.screenHt / 10),
                bottom: footerBottom,
                boxSizing: "border-box",
                ...this.state.footStyle,
                height: this.calculateHeight()
              }}
              id="foot"
            >
              {this.state.ansClicked ? null : <div className="bar"></div>}
              {/* Checks whether bar is up */}
              {this.state.gotQuestion ? (
                <div
                  className="info"
                  id="quesCont"
                  style={{
                    borderRadius: this.screenWd / 50,
                    width: (9 * this.screenWd) / 10,
                    boxSizing: "border-box",
                    ...this.state.quesStyle
                  }}
                  onTouchStart={this.touchStart}
                  onTouchEnd={this.touchEnd}
                >
                  {this.state.isTextBox ? (
                    <input
                      value={this.state.question}
                      type="text"
                      onChange={this.inputText}
                      onKeyDown={this.submit}
                      style={{
                        marginRight: this.screenHt / 40
                      }}
                    />
                  ) : (
                    <p id="question" style={{ margin: 0, fontSize: 16 }}>
                      {this.state.question}
                    </p>
                  )}
                  {(this.mounted = true)}
                  {this.state.ansClicked ? null : (
                    <div
                      style={{
                        position: "absolute",
                        right: this.screenWd / 19
                      }}
                    >
                      <div
                        onClick={this.changeTextBox}
                        style={{
                          height: this.screenHt / 20,
                          width: this.screenHt / 20,
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "relative",
                          top: -this.screenWd / 36,
                          left: this.screenWd / 36
                        }}
                      >
                        {this.state.isTextBox ? (
                          <div
                            style={{
                              height: "50%",
                              width: "50%",
                              backgroundColor: "var(--midGray)",
                              borderRadius: "50%",
                              right: 0,
                              position: "relative"
                            }}
                          >
                            &#215;
                          </div>
                        ) : null
                        // <img className="invert" src={require('pictures/edit.png')} alt="edit" style={{ height: '50%' }} />
                        }
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                (this.mounted = false)
              )}
            </footer>
            {/* !SECTION */}
          </div>
        </Swipe>
      </div>
    );
  }
}

export default withRouter(MainPage);

MainPage.propTypes = {
  changeState: PropTypes.func.isRequired
};
