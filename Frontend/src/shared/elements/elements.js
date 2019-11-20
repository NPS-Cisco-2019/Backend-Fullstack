import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "style/style";
import MathJax from "react-mathjax2";

const maxLength = (10 / 100) * (69 / 100) * window.innerHeight;
let { infoStyle, navObj, imgStyle, answerStyle } = styles;

export function BookmarkNav({ showSavedAns }) {
  const [style, setStyle] = useState({ zIndex: 69 });
  const [imgClass, setImgClass] = useState("");

  useEffect(() => {
    let left = document
      .getElementById("bookmark-holder")
      .getBoundingClientRect().left;
    let top = document
      .getElementById("bookmark-container")
      .getBoundingClientRect().top;
    setStyle({ zIndex: 69, left: left, top: top });
  }, []);

  const handleClick = () => {
    setStyle({
      borderRadius: 0,
      height: window.innerHeight,
      width: window.innerWidth,
      backgroundColor: "var(--backCol)",
      top: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      zIndex: "1000",
      left: 0
    });
    setImgClass("lateFade");
    showSavedAns();
  };

  return (
    <div
      onClick={handleClick}
      style={{ ...navObj, ...style }}
      className="settings-transitions"
      id="bookmark-container"
    >
      <img
        className={`nav-img ${imgClass}`}
        style={{ maxHeight: (3 * maxLength) / 5 }}
        src={require("pictures/bookmark.png")}
        alt="bookmark"
      />
    </div>
  );
}

export class SettingsButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      style: { zIndex: 69 },
      imgClass: ""
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    let left = document.getElementById("settingsDiv").getBoundingClientRect()
      .left;
    let top = document
      .getElementById("settings-container")
      .getBoundingClientRect().top;
    this.setState({ style: { zIndex: 69, left: left, top: top } });
  }

  handleClick() {
    this.setState({
      style: {
        borderRadius: 0,
        height: window.innerHeight,
        width: window.innerWidth,
        backgroundColor: "var(--backCol)",
        top: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        zIndex: "1000",
        left: 0
      },
      imgClass: "lateFade"
    });
    this.props.showSettings();
  }

  render() {
    return (
      <div
        style={{ ...navObj, ...this.state.style }}
        id="settings-container"
        className="settings-transitions"
      >
        <img
          src={require("pictures/settings.png")}
          alt="settings"
          className={`nav-img ${this.state.imgClass}`}
          style={{ maxHeight: (3 * maxLength) / 5 }}
          onClick={this.handleClick}
        />
      </div>
    );
  }
}

export class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // if image is clicked triggers input component
    this.refs.gallery.click();
  }

  render() {
    return (
      <div style={navObj}>
        <img
          src={require("pictures/gallery.png")}
          alt="Gallery"
          className="nav-img"
          onClick={this.handleClick}
        />
        <input
          type="file"
          accept="image/*"
          ref="gallery"
          onChange={this.props.selectFileHandle}
          style={{ display: "none" }}
        />
      </div>
    );
  }
}

export function Back(props) {
  return (
    <div style={{ ...navObj, textAlign: "center" }} onClick={props.handleClick}>
      <img src={require("pictures/back.png")} alt="back" className="nav-img" />
    </div>
  );
}

export function Img({ src }) {
  let [fixHeight, setFixHeight] = useState(true);

  useEffect(() => {
    let img = new Image();
    img.src = src;
    let bool =
      img.naturalHeight / img.naturalWidth >
      window.innerHeight / window.innerWidth;
    setFixHeight(bool);
  }, [src]);

  return (
    <img
      src={src}
      alt="pic"
      style={{
        ...imgStyle,
        height: fixHeight ? (9 * window.innerHeight) / 10 : "auto",
        width: fixHeight ? "auto" : window.innerWidth
      }}
      id="image"
    />
  );
}

export function Answer({ id, answer, width = (9 * window.innerWidth) / 10 }) {
  let ansLength = answer.length;
  let [height, setHeight] = useState(0);
  let [imgLoaded, setImgLoaded] = useState(false);
  let [mathLoaded, setMathLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      let pRect = document.getElementById(id).getBoundingClientRect();
      let container = document
        .getElementById("ansContainer")
        .getBoundingClientRect();

      setHeight(
        Math.min(container.height - 20, pRect.height + 2 * infoStyle.padding)
      );

      if (imgLoaded) {
        let div = document.getElementById(id).getBoundingClientRect();
        let img = document.getElementById(`${id}img`).getBoundingClientRect();
        setHeight(
          Math.min(Math.max(img.height, div.height), container.height - 20)
        );
      }
    }, 100);

    // eslint-disable-next-line
  }, [imgLoaded, mathLoaded]);

  return (
    <div
      className="info"
      style={{ ...infoStyle, ...answerStyle, height, width }}
    >
      <div id={id}>
        <div>
          {answer.slice(0, ansLength - 1).map((item, i) => (
            <div key={id + "-" + i}>
              {item.slice(0, 4) === "link" ? (
                <a className="link" href={item.slice(4, item.length)}>
                  {item.slice(4, item.length)}
                </a>
              ) : (
                <MathJax.Context
                  input="ascii"
                  onLoad={() => setMathLoaded(true)}
                  onError={(MathJax, error) => {
                    console.warn(error);
                    console.log(
                      "Encountered a MathJax error, re-attempting a typeset!"
                    );
                    MathJax.Hub.Queue(MathJax.Hub.Typeset());
                  }}
                  script="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=AM_HTMLorMML"
                  options={{
                    asciimath2jax: {
                      useMathMLspacing: true,
                      delimiters: [
                        ["$", "$"],
                        ["`", "`"]
                      ],
                      preview: "none"
                    }
                  }}
                >
                  <MathJax.Text text={item} />
                </MathJax.Context>
              )}
              <p />
            </div>
          ))}
        </div>
        {answer[ansLength - 1] ? (
          <React.Fragment>
            <img
              src={answer[ansLength - 1]}
              alt={`answer-${id}`}
              style={{ width: "100%", marginBottom: 15 }}
              id={`${id}img`}
              onLoad={() => setImgLoaded(true)}
            />
            {imgLoaded ? null : <p>Loading...</p>}
          </React.Fragment>
        ) : null}
      </div>
    </div>
  );
}

export function Subject() {
  const changeSubject = e => {
    let subject = e.target.innerText;
    localStorage.setItem("subject", subject);
    setOpacity(0);
    setTimeout(() => {
      setOpacity(1);
      setSubjects(createSubjectArray(subject));
    }, 400);
  };

  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState(
    createSubjectArray(localStorage.getItem("subject"))
  );
  const [opacity, setOpacity] = useState(1);
  return (
    <div
      className="subject-button"
      style={{
        height: open ? 125 : 30,
        transition: "all 400ms cubic-bezier(0.215, 0.610, 0.355, 1)"
      }}
      onClick={() => setOpen(!open)}
    >
      <button style={{ opacity, fontFamily: "Raleway" }}>
        <div
          className={`hamburger hamburger--collapse ${open ? "is-active" : ""}`}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </div>
        <p style={{ display: "inline", margin: 0, fontWeight: 400 }}>
          {subjects[0]}
        </p>
      </button>
      <section>
        {subjects.slice(1).map(subject => (
          <button
            onClick={changeSubject}
            key={subject}
            style={{
              fontWeight: 400,
              fontFamily: "Raleway"
            }}
          >
            {subject}
          </button>
        ))}
      </section>
    </div>
  );
}

function createSubjectArray(subject) {
  switch (subject) {
    case "Physics":
      return ["Physics", "Chemistry", "Maths", "General"];
    case "Chemistry":
      return ["Chemistry", "Physics", "Maths", "General"];
    case "Maths":
      return ["Maths", "Physics", "Chemistry", "General"];
    default:
      return ["General", "Physics", "Chemistry", "Maths"];
  }
}

SettingsButton.propTypes = {
  showSettings: PropTypes.func.isRequired
};

Gallery.propTypes = {
  selectFileHandle: PropTypes.func.isRequired
};

Back.propTypes = {
  handleClick: PropTypes.func.isRequired
};

Answer.propTypes = {
  id: PropTypes.string.isRequired,
  answer: PropTypes.array.isRequired
};
