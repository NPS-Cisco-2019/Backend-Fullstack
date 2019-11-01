import React, { useEffect } from 'react';
import styles from "./style";

let { imgStyle, videoConstraints } = styles;

export default function Camera({ error }) {

    useEffect(() => {

        let constraints = {
            audio: false,
            video: { ...videoConstraints }
        }

        if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia(constraints)
                .then(stream => {

                    let video = document.getElementById('camera');

                    let track = stream.getVideoTracks()[0];

                    video.srcObject = stream;

                    let btn = document.getElementById('flash');
                    btn.addEventListener('click', () => {
                        setTimeout(() => {
                            let flashBtn = document.getElementById('flash');
                            let selected = flashBtn.classList[flashBtn.classList.length - 1] === 'selected';
                            track.applyConstraints({
                                advanced: [{ torch: selected }]
                            });
                        }, 10);
                    });
                })
                .catch(err => {
                    error(err);
                })
        }
        //eslint-disable-next-line
    }, [])

    return (
        <video id="camera" autoPlay style={imgStyle} />
    )
}
