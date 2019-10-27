import base64 from './base64Converter';
import testDetails from "./test";

let deploy = true;

// NOTE functions which will handle all backend calls

export function OCR(imgPath, cropJSON){

    let img = base64(imgPath, cropJSON);

    if (deploy) {
        return fetch("/OCR", {
            method: 'POST',
            body: JSON.stringify({img}),
            headers: { 'Content-Type': 'application/json' }
        });
    } else {
        // TODO Remove Temporary non linked server promises which serve test details
        return new Promise((resolve, reject) => {
            resolve({
                status: "200",
                json: () => new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({ question: testDetails.question, img: img });
                    }, 1000);
                })
            })
        })
    }
}
export function scrape(question){
    if (deploy) {
        return fetch("/scrapy", {
            method: 'POST',
            body: JSON.stringify({
                question: question,
                subject: localStorage.getItem('subject'),
                grade: localStorage.getItem('grade')
            }),
            headers: { 'Content-Type': 'application/json' }
        });
    } else {
        // TODO Remove Temporary non linked server promises which serve test details
        return new Promise((resolve, reject) => {
            resolve({
                status: "200",
                json: () => new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({
                            answers: testDetails.answers,
                            websites: testDetails.websites
                        });
                    }, 1000)
                })
            })
        })
    }
}