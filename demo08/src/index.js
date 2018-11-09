const elem = document.createElement('div');
elem.classList.add('head');

elem.innerHTML = 'Hello Webpack';

document.body.appendChild(elem);

import(/* webpackChunkName: "lodash" */ 'lodash').then(({ default: _ }) => {
  console.log(
    _.join(['Hello', 'Webpack'], ' ')
  );
}).catch(err => {
  console.log('An error occurred');
})