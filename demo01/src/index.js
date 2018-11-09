import url from './style/style.css';
import image from './assets/02.png';


const elem = document.createElement('div');
elem.classList.add('head');

elem.innerHTML = 'Hello Webpack';

document.body.appendChild(elem);

const img = new Image(300, 300);
img.src = image;

console.log(image);
document.body.appendChild(img);

// const link = document.createElement('link');
// link.rel = 'stylesheet';
// link.href = url;

// document.head.appendChild(link);
console.log(url);

