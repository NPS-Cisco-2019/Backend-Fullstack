import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function notification(content, important = false){
    if (typeof content === "string"){
        content = [content]
    }
    ReactDOM.render(<Notify content={content} important={important} />, document.getElementById('notification-root'))
}


function Notify({ content, important }){

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
        if (!important) {
            setTimeout(() => {
                document.getElementById('notification-x').click();
            }, 5000);
        }
        // eslint-disable-next-line
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
            <div className="close-x" onClick={closeNotification} id="notification-x">
                <button>&#215;</button>
            </div>
        </div>
    )
}