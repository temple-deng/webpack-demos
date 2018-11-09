import _ from 'lodash';

const elem = document.createElement('div');
elem.classList.add('head');

elem.innerHTML = 'Hello Webpack';

document.body.appendChild(elem);
console.log(
  _.join(['Hello', 'Webpack'], ' ')
);