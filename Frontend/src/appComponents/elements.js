import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// SECTION inline styles
let maxLength = (10/100) * (69/100) * window.innerHeight;

const navObj = {
    boxSizing: 'border-box',
    alignContent: 'center',
    justifyContent: 'center',
    padding: maxLength/5,
    height: maxLength,
    borderRadius: '50%',
    width: maxLength,
    cursor: 'pointer',
    objectFit: 'cover'
}

const infoStyle = {
    boxSizing: 'border-box',
    borderRadius: window.innerWidth/50,
    width: 9 * window.innerWidth/10,
    padding: 15,
    margin: '3% 0'
}

const answer = {
    overflowY: 'scroll',
    objectFit: 'cover',
    display: 'inline-block',
    minWidth: 9 * window.innerWidth / 10,
    margin: '10px 10%',
    marginLeft: 0,
    flex: 1
}
// !SECTION


// SECTION Mobile Components

export class Flash extends React.Component {
    constructor(props){
        super(props);
        this.state = {selected: true};
        this.handleClick = this.handleClick.bind(this);
    }

    // changes whether flashlight is enabled or disabled
    // TODO add flashlight fucntionality
    handleClick(){
        this.setState({ selected: !this.state.selected });
    }

    render(){
        return (
            <div id={this.state.selected ? 'selected' : '' } className="selectable" style={navObj} onClick={this.handleClick}>
                <img id={this.state.selected ? 'selectedImg' : '' } src={require("./pictures/flash.png")} alt="flash" className="nav-img" />
            </div>
        );
    }
};

export class SettingsButton extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            style: {zIndex: 69},
            imgClass: ''
        }

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        let left = document.getElementById('settingsDiv').getBoundingClientRect().left;
        let top = document.getElementsByClassName('settings-transitions')[0].getBoundingClientRect().top;
        this.setState({style: { zIndex: 69, left: left, top: top }})
    }

    handleClick(){
        this.setState({
            style: {
                borderRadius: 0,
                height: window.innerHeight,
                width: window.innerWidth,
                backgroundColor: 'var(--backCol)',
                top: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                zIndex: '1000',
                left: 0
            },
            imgClass: "lateFade"
        })
        this.props.showSettings();
    }

    // TODO make settings menu
    render(){
        return (
            <div style={{...navObj, ...this.state.style}} className="settings-transitions">
                <img src={require("./pictures/settings.png")} 
                alt="settings" 
                className={`nav-img ${this.state.imgClass}`}
                style={{maxHeight: 3*maxLength/5}}
                onClick={this.handleClick} />
            </div>
        );
    }
};

export class Gallery extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedFile: null
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        // if image is clicked triggers input component
        this.refs.gallery.click();
    }

    render(){
        return (
            <div style={navObj}>
                <img src={require("./pictures/gallery.png")} alt="Gallery" className="nav-img" onClick={this.handleClick} />
                <input type="file" accept="image/*" ref="gallery" onChange={this.props.selectFileHandle} style={{display: "none"}} />
            </div>
        );
    }
};

export function Back(props){
    return (
        <div style={{...navObj, textAlign: 'center'}} onClick={props.handleClick}>
            <img src={require("./pictures/back.png")} alt="back" className="nav-img" />
        </div>
    )
};

export function Answer(props){

    
    let [height, setHeight] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            // eslint-disable-next-line
            let pRect = document.getElementById(props.id).getBoundingClientRect();
            let container = document.getElementById('ansContainer').getBoundingClientRect();

            setHeight(Math.min((container.height - 20), (pRect.height + (2 * infoStyle.padding))));
        }, 100);
        
        // eslint-disable-next-line
    }, []);
    return (
        <div className="info" style={{...infoStyle, ...answer, height: height}}>
            <p style={{margin: 0}} id={props.id}>{props.answer}</p>
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
        <p id={props.id} name="reset-value-selector" prefix={props.prefix} suffix={props.suffix} defaultValue={props.defaultValue}>
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

export function Setting({ type, name, id, handleClick, Children, props, childProps, compValue }){

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
        //eslint-disable-next-line
    }, [])

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
        </div>
    )
}

// !SECTION


// SECTION Desktop Components

// Firefox tutroial
export function Firefox() {
    let style = {
        height: window.innerHeight * 2,
        position: 'absolute'
    }
    return (
        <div style={{...style, borderTop: '2px solid rgb(200, 0 ,0)'}} className="tut tutFirefox" id="firefoxTut">
            <div className="img1">
                <img className="tutImg" src={require("./pictures/firefox1.jpg")} alt="tutorial 1" />
            </div>
            <div className="p1">
                <p id="font100">Click on the the circled button</p>
            </div>
            <div className="img2">
                <img className="tutImg" src={require("./pictures/firefox2.jpg")} alt="tutorial 2" />
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
                <img className="tutImg" src={require("./pictures/chrome1.jpg")} alt="tutorial 1" />
            </div>
            <div className="p1">
                <p id="font100">Click on the the circled button</p>
            </div>
            <div className="img2">
                <img className="tutImg" src={require("./pictures/chrome2.jpg")} alt="tutorial 2" />
            </div>
            <div className="p2">
                <p id="font100">Click on "Add to Home screen".</p>
            </div>
            <div className="img3">
                <img className="tutImg" src={require("./pictures/chrome3.jpg")} alt="tutorial 3" />
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
                <img className="tutImg" src={require("./pictures/safari1.jpg")} alt="tutorial 1" />
            </div>
            <div className="p1">
                <p id="font100">Click on the the circled button</p>
            </div>
            <div className="img2">
                <img className="tutImg" src={require("./pictures/safari2.jpg")} alt="tutorial 2" />
            </div>
            <div className="p2">
                <p id="font100">After scrolling down, click on "Add to Home Screen".</p>
            </div>
            <div className="img3">
                <img className="tutImg" src={require("./pictures/safari3.jpg")} alt="tutorial 3" />
            </div>
            <div className="p3">
                <p id="font100">Click on "Add" to install to your home screen.</p>
            </div>
        </div>
    );
}

// !SECTION


// NOTE Currently unused
// TODO Add Error boundries and make Error page
export class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.log(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong.</h1>;
      }
  
      return this.props.children; 
    }
}




function strToRgb(rgbStr){
    return rgbStr.slice(4, rgbStr.length - 1).split(',')
}

SettingsButton.propTypes = {
    showSettings: PropTypes.func.isRequired
}

Gallery.propTypes = {
    selectFileHandle: PropTypes.func.isRequired
}

Back.propTypes = {
    handleClick: PropTypes.func.isRequired
}

Answer.propTypes = {
    id: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired
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