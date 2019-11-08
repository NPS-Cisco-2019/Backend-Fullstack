import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export function Setting({ type, name, id, handleClick, Children, props, childProps, compValue, children }){

    let [open, setOpen] = useState(true)
    let [childOpen, setChildOpen] = useState(true);
    let [maxHeight, setMaxHeight] = useState('100%');
    let [transition, setTransition] = useState(false);
    let [value, setValue] = useState(compValue);

    useEffect(() => {
        let totHeight = document.getElementById(`${id}-wrapper`).getBoundingClientRect().height;
        setMaxHeight(totHeight);
        setOpen(false);
        setChildOpen(false);
        setTimeout(() => setTransition(true), 50);
    }, [id])

    const openClick = () => {
        if (open){
            setTimeout(() => setChildOpen(false), 300);
        } else {
            setChildOpen(true);
        }
        setOpen(!open);
    }


    let Component;
    let height = window.innerHeight/13 + window.innerHeight/40;

    let openable = true;

    if (type === 'switch'){
        Component = Switch;
        openable = false;
    } else if (type === 'value'){
        Component = Value;
    } else if (type === 'colorPicker'){
        Component = Color;
    }

    return (
        <div className={`setting-wrapper ${transition ? 'height-trans' : null}`} id={`${id}-wrapper`} style={{height: open ? maxHeight : height}}>
            <div className="setting" id={id} style={{flexBasis: window.innerHeight/12 }} onClick={openable ? openClick : null}>
                <p>{name}</p>
                <Component id={id} handleClick={handleClick} {...props} value={value} />
            </div>
            {childOpen ? <Children id={`${id}-child`} updateOpen={setOpen} updateValue={setValue} {...childProps} /> : null}
            { children }
        </div>
    )
}

export function ColorPicker({ updateOpen, localStorageItem, id }){

    const submit = () => {
        localStorage.setItem(localStorageItem, `rgb(${valueR},${valueG},${valueB})`);
        updateOpen(false);
        document.documentElement.style.setProperty('--highlightCol', `rgb(${valueR},${valueG},${valueB})`)
    }

    useEffect(() => {
        let rSlider = document.getElementById(`${id}-sliderR`).style;
        rSlider.setProperty('--thumbCol', 'rgb(255, 0, 0)');

        let gSlider = document.getElementById(`${id}-sliderG`).style;
        gSlider.setProperty('--thumbCol', 'rgb(0, 255, 0)');

        let bSlider = document.getElementById(`${id}-sliderB`).style;
        bSlider.setProperty('--thumbCol', 'rgb(0, 0, 255)');

        let parentHeight = document.getElementById(id).getBoundingClientRect().height;
        setHeight(7*parentHeight/10);
        // eslint-disable-next-line
    }, [])

    let rgbVal = localStorage.getItem(localStorageItem);
    let rgbArr = strToRgb(rgbVal);
    

    let [valueR, setValueR] = useState(rgbArr[0]);
    let [valueG, setValueG] = useState(rgbArr[1]);
    let [valueB, setValueB] = useState(rgbArr[2]);
    let [height, setHeight] = useState('70%');

    return (
        <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <div id={id} style={{display: 'flex', alignItems: 'center', margin: '0px 17.5px'}}>
                <div style={{
                    height: height,
                    width: window.innerWidth/12,
                    borderRadius: window.innerWidth/24 ,
                    border: '1px solid var(--highlightCol)',
                    marginRight: 15,
                    backgroundColor: `rgb(${valueR},${valueG},${valueB})`}}></div>
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', width: 7*window.innerWidth/10}}>
                    <Range id={`${id}-sliderR`} min={0} max={255} value={valueR} setValue={setValueR} highlightCol="rgb(255,0,0)" />
                    <Range id={`${id}-sliderG`} min={0} max={255} value={valueG} setValue={setValueG} highlightCol="rgb(0,255,0)" />
                    <Range id={`${id}-sliderB`} min={0} max={255} value={valueB} setValue={setValueB} highlightCol="rgb(0,0,255)" />
                </div>
            </div>
            <button style={{width: 50, height: 30, backgroundColor: 'var(--midGray)', borderRadius: 5}} onClick={submit}>ok</button>
        </div>
    )
}

export function Null(){return <div></div>}

export function Slider({ updateOpen, updateValue, min, max, localStorageItem }){
    let [value, setValue] = useState(localStorage.getItem(localStorageItem));

    const submit = () => {
        localStorage.setItem(localStorageItem, value)
        updateOpen(false);
        updateValue(value);
    }

    return (
        <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <Range min={min} max={max} value={value} setValue={setValue} />
            <button style={{width: 50, height: 30, backgroundColor: 'var(--midGray)', borderRadius: 5}} onClick={submit}>ok</button>
        </div>
    )
}

export function Choice({ localStorageItem, arr, updateOpen, updateValue }) {

    const changeSelection = e => {
        setSelected(e.target.innerText);
    }

    const submit = () => {
        localStorage.setItem(localStorageItem, selected);
        updateOpen(false);
        updateValue(selected);
    }

    const [selected, setSelected] = useState(localStorage.getItem(localStorageItem));


    return (
        <div className="setting-choices">
            {
                arr.map((choice) => (
                    <div
                        key={choice}
                        onClick={changeSelection}
                        className="setting-choice"
                        style={{
                            backgroundColor: choice === selected ? 'rgba(50, 90, 245, 0.2)' : 'var(--midGray)',
                            border: choice === selected ? '3px solid rgb(50, 90, 245)' : '3px solid transparent',
                        }}
                    >
                        <p>{choice}</p>
                    </div>
                ))
            }
            <button style={{width: 50, height: 30, backgroundColor: 'var(--midGray)', borderRadius: 5, marginTop: 10}} onClick={submit}>ok</button>
        </div>
    )
}

function Switch(props){

    let [enabled, setEnabled] = useState(Boolean(props.enabled));

    let [style, setStyle] = useState({borderRadius: '50%', height: 15});

    useEffect(() => {
        let height = document.getElementById(props.id).getBoundingClientRect().height;
        setStyle({ borderRadius: height/7, height: height/3.5, width: height/1.5 });
    }, [props.id])

    const handleClick = () => {
        setEnabled(!enabled);
        props.handleClick();
    }

    return (
        <button className="switch" onClick={handleClick}
            style={{...style,
                    justifyContent: enabled ? 'flex-end' : 'flex-start',
                    backgroundColor: enabled ? 'var(--highlightCol)' : null}}
        >
            <div className="switch-selector" style={{
                width: 1.3*style.height,
                height: 1.3*style.height,
                top: -0.2*style.height,
                right: enabled ? -0.2*style.height : null,
                left: enabled ? null : -0.2*style.height
            }}></div>
        </button>
    )
}

function Range({ min, max, value, setValue, id, highlightCol = "var(--highlightCol)" }){
    return (
        <div style={{display: 'flex', width: window.innerWidth * 0.8, marginBottom: 5, maxWidth: '100%' }}>
            <input id={id} style={{highlightCol}} type="range" min={min} max={max} value={value} onChange={e => setValue(e.target.value)} className="slider" />
            <p style={{margin: '0'}}>{value}</p>
        </div>
    )
}

function Value(props){
    return (
        <p id={props.id} name="reset-value-selector" prefix={props.prefix} suffix={props.suffix} defaultValue={props.defaultValue} style={{maxWidth: "30vw"}}>
            {props.prefix}{props.value}{props.suffix}
        </p>
    )    
}

function Color({ colour, localStorageItem = null }){
    let backCol;

    if (localStorageItem !== null) {
        backCol = `var(--${localStorageItem})`;
    } else {
        backCol = colour;
    }
    return (
        <div className="colourShower" style={{backgroundColor: backCol}}></div>
    )
}

function strToRgb(rgbStr){
    return rgbStr.slice(4, rgbStr.length - 1).split(',')
}



Switch.propTypes = {
    enabled: PropTypes.bool,
    handleClick: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
}

Setting.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    handleClick: PropTypes.func,
    id: PropTypes.string.isRequired,
    props: PropTypes.object
}