let style = document.documentElement.style;

export function init(){
    let highlightColor = localStorage.getItem('highlightCol');
    if (highlightColor === null){
        localStorage.setItem('highlightCol', 'rgb(50, 90, 245)');
        highlightColor = 'rgb(50, 90, 245)';
    }

    let pressDelay = localStorage.getItem('pressDelay');
    if (pressDelay === null){
        localStorage.setItem('pressDelay', '300')
    }

    let mode = localStorage.getItem('mode');
    if (mode === null){
        localStorage.setItem('mode', 'dark');
        mode = 'dark'
    }
    
    let savedAnswers = localStorage.getItem('savedAnswers');
    if (savedAnswers === null){
        localStorage.setItem('savedAnswers', JSON.stringify([]));
    }

    changeMode(mode);

    let subject = localStorage.getItem('subject');
    if (subject === null){
        localStorage.setItem('subject', 'General');
    }

    let subjectSelector = localStorage.getItem('subjectSelector');
    if (subjectSelector === null){
        localStorage.setItem('subjectSelector', 'Drop down on screen');
    }
    
    style.setProperty('--highlightCol', highlightColor)

    document.getElementById('root').style.backgroundColor = 'var(--backCol)';

    let grade = localStorage.getItem('grade');

    sessionStorage.setItem('new', grade === null)
}

export function reset(){
    localStorage.setItem('highlightCol', 'rgb(50, 90, 245)');
    localStorage.setItem('pressDelay', '300')
    localStorage.setItem('mode', 'dark');
    localStorage.setItem('subject', 'General');
    localStorage.setItem('subjectSelector', 'Drop down on screen');
    
    changeMode('dark');
    style.setProperty('--highlightCol', 'rgb(50, 90, 245)')
}

export function changeMode(mode){
    if (mode === 'dark'){
        style.setProperty('--backCol', 'rgb(25, 25, 25)');
        style.setProperty('--backCol2', 'rgb(30, 30, 30)');  
        style.setProperty('--textCol', 'white');
        style.setProperty('--midGray', 'rgb(75, 75, 75)');
        style.setProperty('--midGray2', 'rgb(50, 50, 50)');
        style.setProperty('--filter', 'none')
    } else {
        style.setProperty('--backCol', 'white');
        style.setProperty('--backCol2', 'rgb(230, 230, 230)');  
        style.setProperty('--textCol', 'black');
        style.setProperty('--midGray', 'rgb(200, 200, 200)');
        style.setProperty('--midGray2', 'rgb(220, 220, 220)');
        style.setProperty('--filter', 'invert(1)')
    }
}