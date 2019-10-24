export default function base64(imgPath, cropJSON){
    let x = cropJSON.x;
    let y = cropJSON.y;
    let width = cropJSON.width;
    let height = cropJSON.height;

    let img = new Image();
    img.src = imgPath;

    if (x < 0){
        x = 0;
        y = 0;
        width = img.naturalWidth;
        height = img.naturalHeight
    }

    // console.log({h: img.naturalHeight, img})
    let h = 9*window.innerHeight/10;
    let imgH = img.naturalHeight;
    let imgW = img.naturalWidth;

    let htmlImg = document.getElementById('image').getBoundingClientRect();
    // console.log({imgH})
    let scaleX = imgW / htmlImg.width;
    let scaleY = imgH/h;
    // scale = 1;
    x *= scaleX;
    y *= scaleY;
    width *= scaleX;
    height *= scaleY;
    img.src = imgPath;
    // console.log({x, y, width, height, scale, imgH})
    let base64Img;
    img.crossOrigin = 'Anonymous';
    let canvas = document.createElement('CANVAS');
    let ctx = canvas.getContext('2d');
    canvas.height = height;
    canvas.width = width;
    ctx.drawImage(img, -x, -y);
    base64Img = canvas.toDataURL();

    return base64Img;
}