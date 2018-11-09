const elem = document.createElement('div');
elem.classList.add('head');

elem.innerHTML = 'Hello Webpack';

document.body.appendChild(elem);

const btn = document.createElement('button');
btn.innerHTML = 'Click me to load print.js';

document.body.appendChild(btn);

btn.onclick = function(e) {
  import(/* webpackChunkName: "print" */'./print')
  .then(({ default: fn }) => {
    fn();
  }).catch(err => {
    console.error('An error occurred')
  });
}