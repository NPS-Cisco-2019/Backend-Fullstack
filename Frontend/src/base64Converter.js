export default function base64(imgPath, cropJSON){
    let x = cropJSON.x;
    let y = cropJSON.y;
    let width = cropJSON.width;
    let height = cropJSON.height;

    let img = new Image();
    img.src = imgPath;
    let htmlImg = document.getElementById('image').getBoundingClientRect();

    if (x < 0){
        x = 0;
        y = 0;
        width = htmlImg.width;
        height = htmlImg.height;
    }

    let imgH = img.naturalHeight;
    let imgW = img.naturalWidth;

    let scaleX = imgW / htmlImg.width;
    let scaleY = imgH / htmlImg.height;

    x *= scaleX;
    y *= scaleY;
    width *= scaleX;
    height *= scaleY;
    img.src = imgPath;

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