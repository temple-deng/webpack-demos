import printMe from './print';
import './style/style.css';
import image from './assets/02.png';

const elem = document.createElement('div');
elem.classList.add('head');

elem.innerHTML = 'Hello Webpack';

document.body.appendChild(elem);

const btn = document.createElement('button');
btn.innerHTML = 'Click me and check the console';

btn.addEventListener('click', printMe);
const printCopy = printMe;

document.body.appendChild(btn);

const img = new Image(300, 300);
img.src = image;

console.log(image);
document.body.appendChild(img);

console.log('HMR');

if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated printMe module!');
    btn.removeEventListener('click', printCopy);
    btn.addEventListener('click', printMe);
  });
}