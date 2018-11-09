import { file, parse } from './globals';

const elem = document.createElement('div');
elem.classList.add('head');

elem.innerHTML = 'Hello Webpack';

document.body.appendChild(elem);

console.log(file);
parse();

