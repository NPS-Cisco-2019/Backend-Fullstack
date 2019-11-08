import React from 'react';
import { Link } from 'react-router-dom';
import browser from 'functions/browserDetection';

export default function(){

    let isMobile = typeof window.orientation !== "undefined";

    let margin = isMobile ? "60px 0px" : null;
    let fontSize = isMobile ? "150%" : "250%";
    let width = isMobile ? window.innerWidth/2 : window.innerWidth/6;
    let marginTop = isMobile ? window.innerHeight / 8 + 60 : window.innerHeight / 13

    let home = '/' + (isMobile ? 'Picture' : browser[0].toUpperCase() + browser.slice(1));

    return (
        <div style={{backgroundColor: 'rgb(40, 40, 40)', minHeight: window.innerHeight, position: "absolute"}} className="fadein">
            <img style={{maxHeight: 8 * window.innerHeight / 10, maxWidth: window.innerWidth, margin: margin}} className="center" src={require("pictures/404.png")} alt="404" />
            <p style={{fontSize: fontSize, margin: margin}}>Sorry nothing could be found here</p>
            <Link to={home} className="button404 center" style={{ width: width, height: window.innerHeight/20, borderRadius: window.innerHeight/75, marginTop: marginTop}}>
                Back To Home
            </Link>
        </div>
    )
}