import React, { useState } from "react";

function Subject() {
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
        height: open ? 150 : 30,
        transition: "all 400ms cubic-bezier(0.215, 0.610, 0.355, 1)"
      }}
      onClick={() => setOpen(!open)}
    >
      <button style={{ opacity, fontFamily: "Raleway" }}>
        <div className={`hamburger hamburger--collapse ${open ? "is-active" : ""}`}>
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </div>
        <p style={{ display: "inline", margin: 0, fontWeight: 400 }}>{subjects[0]}</p>
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

export default Subject;

function createSubjectArray(subject) {
  switch (subject) {
    case "Physics":
      return ["Physics", "Chemistry", "Maths", "Notes", "General"];
    case "Chemistry":
      return ["Chemistry", "Physics", "Maths", "Notes", "General"];
    case "Maths":
      return ["Maths", "Physics", "Chemistry", "Notes", "General"];
    case "Notes":
      return ["Notes", "Physics", "Chemistry", "Maths", "General"];
    default:
      return ["General", "Physics", "Chemistry", "Maths", "Notes"];
  }
}
