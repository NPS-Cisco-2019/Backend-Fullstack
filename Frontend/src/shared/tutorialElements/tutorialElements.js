import React from 'react';

// Firefox tutroial
export function Firefox() {
    let style = {
        height: window.innerHeight * 2,
        position: 'absolute'
    }
    return (
        <div style={{...style, borderTop: '2px solid rgb(200, 0 ,0)'}} className="tut tutFirefox" id="firefoxTut">
            <div className="img1">
                <img className="tutImg" src={require("pictures/firefox1.jpg")} alt="tutorial 1" />
            </div>
            <div className="p1">
                <p id="font100">Click on the the circled button</p>
            </div>
            <div className="img2">
                <img className="tutImg" src={require("pictures/firefox2.jpg")} alt="tutorial 2" />
            </div>
            <div className="p2">
                <p id="font100">Click on "+ADD TO HOME SCREEN" to install to your home screen.</p>
            </div>
        </div>
    );
}

// Chrome tutroial
export function Chrome() {
    let style = {
        height: window.innerHeight * 3,
        position: 'absolute'
    }
    return (
        <div style={{...style, borderTop: '2px solid rgb(18, 218, 0)'}} className="tut tutOthers" id="chromeTuts">
            <div className="img1">
                <img className="tutImg" src={require("pictures/chrome1.jpg")} alt="tutorial 1" />
            </div>
            <div className="p1">
                <p id="font100">Click on the the circled button</p>
            </div>
            <div className="img2">
                <img className="tutImg" src={require("pictures/chrome2.jpg")} alt="tutorial 2" />
            </div>
            <div className="p2">
                <p id="font100">Click on "Add to Home screen".</p>
            </div>
            <div className="img3">
                <img className="tutImg" src={require("pictures/chrome3.jpg")} alt="tutorial 3" />
            </div>
            <div className="p3">
                <p id="font100">Click on "Add" to install to your home screen.</p>
            </div>
        </div>
    );
}

// Safari tutroial
export function Safari() {
    let style = {
        height: window.innerHeight * 3,
        position: 'absolute'
    }
    return (
        <div style={{...style, borderTop: '2px solid rgb(0, 0, 255)'}} className="tut tutOthers" id="safariTut">
            <div className="img1">
                <img className="tutImg" src={require("pictures/safari1.jpg")} alt="tutorial 1" />
            </div>
            <div className="p1">
                <p id="font100">Click on the the circled button</p>
            </div>
            <div className="img2">
                <img className="tutImg" src={require("pictures/safari2.jpg")} alt="tutorial 2" />
            </div>
            <div className="p2">
                <p id="font100">After scrolling down, click on "Add to Home Screen".</p>
            </div>
            <div className="img3">
                <img className="tutImg" src={require("pictures/safari3.jpg")} alt="tutorial 3" />
            </div>
            <div className="p3">
                <p id="font100">Click on "Add" to install to your home screen.</p>
            </div>
        </div>
    );
}