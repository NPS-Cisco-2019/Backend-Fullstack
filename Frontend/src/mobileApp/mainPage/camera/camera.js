import React, { useEffect } from 'react';

import styles from "style/style";

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

                    video.srcObject = stream;
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
