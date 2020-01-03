const maxLength = (10 / 100) * (69 / 100) * window.innerHeight;

const styles = {
  maxLength,
  imgStyle: {
    zIndex: "0",
    margin: "auto",
    width: window.innerWidth
  },
  imgContainerStyle: {
    backgroundColor: "var(--backCol)",
    display: "flex",
    position: "relative"
  },
  captureButtonStyle: {
    position: "fixed",
    borderRadius: "50%",
    width: maxLength,
    height: maxLength,
    zIndex: 42,
    backgroundColor: "rgb(224, 0, 0)",
    border: "0.15em solid white",
    transition: "bottom 500ms cubic-bezier(0.215, 0.61, 0.355, 1)",
    justifyContent: "center",
    alignItems: "center",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex"
  },
  videoConstraints: {
    // facingMode: 'user',
    facingMode: { exact: "environment" },
    width: (9 * window.innerHeight) / 10,
    height: window.innerWidth
  },
  botNavStyle: {
    width: window.innerWidth / 3,
    margin: 0,
    fontWeight: 200,
    display: "flex",
    justifyContent: "center"
  },
  webStyle: {
    fontSize: "1.2em",
    margin: 0,
    zIndex: 69,
    transition: "opacity 500ms linear",
    textAlign: "center"
  },
  container: {
    position: "absolute",
    margin: 0,
    top: window.innerHeight / 11,
    width: window.innerWidth,
    padding: window.innerWidth / 20,
    justifyItems: "center",
    alignItems: "center",
    boxSizing: "border-box",
    paddingTop: 0,
    paddingBottom: (7 * window.innerHeight) / 100,
    overflow: "hidden",
    backgroundColor: "var(--backCol)"
  },
  infoStyle: {
    boxSizing: "border-box",
    borderRadius: window.innerWidth / 50,
    width: (9 * window.innerWidth) / 10,
    padding: 10,
    margin: "1.4% 0"
  },
  navObj: {
    boxSizing: "border-box",
    alignContent: "center",
    justifyContent: "center",
    padding: maxLength / 5,
    height: maxLength,
    borderRadius: "50%",
    width: maxLength,
    cursor: "pointer",
    objectFit: "cover"
  },
  answerStyle: {
    overflowY: "scroll",
    objectFit: "cover",
    display: "inline-block",
    minWidth: (9 * window.innerWidth) / 10,
    margin: "10px 10%",
    marginLeft: 0,
    flex: 1
  }
};

export default styles;
