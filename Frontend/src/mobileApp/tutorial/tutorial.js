import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Back } from 'shared/elements';
import { Chrome, Firefox, Safari } from 'shared/tutorialElements';
import browser from 'functions/browserDetection';

let Tutorial;
let minHeight;

if (browser === 'firefox'){
    Tutorial = Firefox;
    minHeight = window.innerHeight * 2;
} else if (browser === 'safari'){
    Tutorial = Safari;
    minHeight = window.innerHeight * 3;
} else {
    Tutorial = Chrome;
    minHeight = window.innerHeight * 3;
}

function Tut(props){

    const backClick = () => {
        props.backClick();
        setBackToCam(true);
    }


    const [backToCam, setBackToCam] = useState(false);

    let rootStyle = document.documentElement.style;

    rootStyle.setProperty('--tutAreas', '"img1" "text1" "img2" "text2" "img3" "text3"');
    rootStyle.setProperty('--otherRows', 'repeat(3, 27% 6%');
    rootStyle.setProperty('--firefoxRows', 'repeat(2, 40% 10%)');
    rootStyle.setProperty('--fontSize', '130%');
    rootStyle.setProperty('--marginTop', 'none');
    rootStyle.setProperty('--rowGap', '0');

    return (
        <div style={{minHeight: minHeight, position: "absolute", width: window.innerWidth, backgroundColor: 'var(--backCol)', overflow: 'hidden'}} className={backToCam ? "slideout" : "fadein"}>
            <header className="top fadein" style={{height: Math.round(window.innerHeight/11)}} id="head">
                <Back handleClick={backClick} />
                <p style={{fontSize: '1.2em', margin: 0}} id="websitePosition">Tutorial</p>
            </header>
            <div style={{position: 'relative', top: Math.round(window.innerHeight/10)}}>
                <Tutorial />
            </div>
        </div>
    )
}


export default Tut;


Tut.propTypes = {
    backClick: PropTypes.func.isRequired
}