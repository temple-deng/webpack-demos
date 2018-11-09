import './style/style.css';
import image from './assets/02.png';
import { cube } from './math.js';


const elem = document.createElement('div');
elem.classList.add('head');

elem.innerHTML = 'Hello Webpack';

document.body.appendChild(elem);

const img = new Image(300, 300);
img.src = image;

console.log(image);
document.body.appendChild(img);

const elem2 = document.createElement('div');
elem2.innerHTML = `5 cube is equal to ${cube(5)}`;

document.body.appendChild(elem2);
