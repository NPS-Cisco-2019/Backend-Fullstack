import base64 from './base64Converter';

// NOTE functions which will handle all backend calls

export function OCR(imgPath, cropJSON){

    let img = base64(imgPath, cropJSON);
    
    return fetch("/OCR", {
        method: 'POST',
        body: JSON.stringify({img}),
        headers: { 'Content-Type': 'application/json' }
    });
}
export function scrape(question){
    return fetch("/scrapy", {
        method: 'POST',
        body: JSON.stringify({
            question: question,
            subject: localStorage.getItem('subject'),
            grade: localStorage.getItem('grade')
        }),
        headers: { 'Content-Type': 'application/json' }
    });
}