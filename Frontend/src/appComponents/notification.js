import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function notification(content){
    if (typeof content === "string"){
        content = [content]
    }
    ReactDOM.render(<Notify content={content} />, document.getElementById('notification-root'))
}


function Notify({ content }){

    const closeNotification = () => {
        setWrapperStyle({
            transform: `translateY(${-height - 20}px)`
        });
        setTimeout(() => {
            let notify = document.getElementById('notification-root');
            // notify.remove();
            ReactDOM.unmountComponentAtNode(notify);
        }, 300)
    }

    useEffect(() => {
        let notifyRect = document.getElementById('notify').getBoundingClientRect();
        setHeight(notifyRect.height);
        setWrapperStyle({ transform: 'translateY(0)' })
    }, [])

    const [height, setHeight] = useState()
    const [wrapperStyle, setWrapperStyle] = useState({ transform: 'translateY(-200px)' })

    return (
        <div className="notification" id="notify" style={wrapperStyle}>
            <div style={{width: 8*window.innerWidth/10}}>
                {content.map((text, i) => (
                    <p key={`notification-p-${i}`}>{text}</p>
                ))}
            </div>
            <div className="close-x" onClick={closeNotification}>
                <button>&#215;</button>
            </div>
        </div>
    )
}