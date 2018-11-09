import printMe from './print';

const elem = document.createElement('div');
elem.classList.add('head');

elem.innerHTML = 'Hello Webpack';

document.body.appendChild(elem);

const btn = document.createElement('button');
btn.innerHTML = 'Click me and check the console';

btn.addEventListener('click', printMe);

document.body.appendChild(btn);

if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Acepting the updated printMe module!');
    printMe();
  })
}