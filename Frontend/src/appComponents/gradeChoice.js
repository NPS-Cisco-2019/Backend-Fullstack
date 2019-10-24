import React, { useState } from 'react';

function GradeChoice({ history }){
    sessionStorage.setItem('fromGradeChoice', 'true');

    const changeChoice = e => {
        setSelected(+e.target.title);
    }

    const submit = () => {
        localStorage.setItem('grade', '' + selected);
        setAnimation('fadeout');
        setTimeout(() => history.push('/Picture'), 500)
    }

    let [selected, setSelected] = useState(-1);
    let [animation, setAnimation] = useState('fadein');

    let grades = [
        9,
        10,
        11,
        12
    ] 

    return (
        <div className={animation}>
            <div className="info center ques" style={{
                borderRadius: 10, height: window.innerHeight/11,
                fontSize: 3 *window.innerHeight/100,
                marginBottom: 4 * window.innerHeight/100,
                marginTop: 3 * window.innerHeight / 100
            }}>Which grade are you in?</div>
              {/* border-radius: 2vh;
  font-size: 2.5vh;
  height: 14vh;
  margin: 3vh 5vw; */}

            {grades.map((grade) => (
                <div style={{
                    backgroundColor: grade === selected ? 'rgba(50, 90, 245, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                    border: grade === selected ? '3px solid rgb(50, 90, 245)' : '3px solid transparent',
                    borderRadius: window.innerHeight/50,
                    height: 14 * window.innerHeight / 100,
                    margin: `${3*window.innerHeight/100}px ${5*window.innerWidth/100}px` 
                }} key={grade} title={grade} className="choice" onClick={changeChoice}>
                    <p title={grade}>Class {grade}</p>
                </div>
            ))}
            <button className="submit-button center" onClick={selected === -1 ? null : submit}
                style={{opacity: selected === -1 ? 0.4 : 1}}
            > ok </button>
        </div>
    )
}

export default GradeChoice;