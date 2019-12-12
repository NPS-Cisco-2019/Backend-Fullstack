export default function base64(imgPath, { x, y, width, height, rotation }) {
  let img = new Image();
  img.src = imgPath;
  let htmlImg = document.getElementById("image").getBoundingClientRect();

  let angle = (rotation * Math.PI) / 2;

  if (x < 0) {
    x = 0;
    y = 0;
    width = htmlImg.width;
    height = htmlImg.height;
  } else {
    x -= htmlImg.left;
    y -= htmlImg.top;
  }

  let imgW = img.naturalWidth;
  let imgH = img.naturalHeight;

  let imgCanvas = document.createElement("canvas");
  let imgCtx = imgCanvas.getContext("2d");
  imgCanvas.height = imgH;
  imgCanvas.width = imgW;
  imgCtx.save();
  imgCtx.translate(imgW / 2, imgH / 2);
  imgCtx.rotate(angle);
  imgCtx.drawImage(img, -imgW / 2, -imgH / 2);

  let scaleX = imgW / htmlImg.width;
  let scaleY = imgH / htmlImg.height;

  x *= scaleX;
  y *= scaleY;
  width *= scaleX;
  height *= scaleY;

  console.log({ x, y, width, height, iw: img.width / 2, ih: img.height / 2 });

  let base64Img;
  img.crossOrigin = "Anonymous";
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.height = height;
  canvas.width = width;
  ctx.drawImage(imgCanvas, -x, -y);
  base64Img = canvas.toDataURL();

  return base64Img;
}
