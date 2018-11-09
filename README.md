# Webpack Demos

## Demo01 Assets Management

利用 loader 打包非 JS 资源。   

需要注意的一点是，对这些外部资源以及按需加载的 chunk 文件来说，需要指定 pulicPath，不然像
下面的代码中，image 变量，以及 css 中 `url()` 的图片路径都只是一个文件名，不带路径部分，
那样就容易找不到正确的位置。   


index.html   

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Asset Management</title>
</head>
<body>
  <script src="./dist/main.js"></script>
</body>
</html>
```   

style.css    

```css
.head {
  color: red;
  width: 400px;
  height: 400px;
  background-image: url('../assets/01.png');
  background-size: 200px 200px;
}
```   


index.js   

```js
import './style/style.css';
import image from './assets/02.png';


const elem = document.createElement('div');
elem.classList.add('head');

elem.innerHTML = 'Hello Webpack';

document.body.appendChild(elem);

const img = new Image(300, 300);
img.src = image;

console.log(image);   // ./dist/d65910be0ae37295bcd224fae1d7222f.png
// 如果没配置 publicPath 的话就是 d65910be0ae37295bcd224fae1d7222f.png
document.body.appendChild(img);
```    

webpack.config.js   

```js
const path = require('path');

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: './dist/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};
```    

file-loader 也可以处理 font 文件，不过这里不给出示例了。   

## Demo02 Output Management

安装 HtmlWebpackPlugin: `$ npm install --save-dev html-webpack-plugin`。   
清理插件：`$ npm i --save-dev clean-webpack-plugin`    

`HtmlWebpackPlugin` 默认会生成自己的 `index.html` 文件。    

但是好像这个插件生成的对打包文件引用的地址与 publicPath 冲突啊，在示例里如果有 publicPath
配置项的话，会导致这个配置的路径添加的 js 地址的前面，导致引用不正确啊。这个其实应该是由于这个
插件本身就知道输出的各个文件的位置，所以在 HTML 中都配置好了。    

webpack.config.js    

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output Management'
    })
  ]
};
```   

生成的 index.html 文件：   

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Output Management</title>
  </head>
  <body>
  <script type="text/javascript" src="app.bundle.js"></script><script type="text/javascript" src="print.bundle.js"></script></body>
</html>
```    

## Demo03 Development

使用 source-map 调试。   

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output Management'
    })
  ]
};
```   

有多种自动编译模式：   

1. Watch Mode
2. webpack-dev-server
3. webpack-dev-middleware    

使用 webpack-dev-server 和启用 HMR：   

webpack.config.js:   

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output Management'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};

```   

index.js:   

```js
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
```    

主要就是 `devServer` 配置项和 webpack 内部的 HMR 插件 `webpack.HotModuleReplacementPlugin`。   

注意这里 webpack-dev-server 使用的是 html-webpack-plugin 生成的 html 文件。   

利用 style-loader 还可以实现 CSS 的 HMR。而且也不用额外的其他配置。   

## Demo04 上述内容的结合

webpack.config.js:   

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  devServer: {
    contentBase: './dist'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output Management'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
```      

在 dev-server 的情况下，其实 output 里的 path 是没有任何意义的，推断工作的工程应该是这样：
webpack 会打包所有的文件，但是打包的内容是放在内存中了，然后服务器根据对 `contentBase`
中配置路径来返回对应的打包内容，比如我们页面中请求 `./dist/app.js`，然后 `contentBase: './dist'`，
那么就会返回打包后的 app.js。    

但是在使用了 publicPath 配置项就又不一样了，感觉 publicPath 在这里会起两方面的作用，第一点
就是像之前提到的，会用来修改对外部资源和按需加载资源的 url，第二点就是在 dev-server 中，还
指定了我们 web 服务输出地址，比如说设置为 `publicPath: '/meizizi/'`，那我们所有的 web
内容其实要通过 `http://localhost:8080/meizizi/index.html` 类似的地址方法，同时需要注意的
是设置了 pubilcPath 的话那 `devServer.contentBase` 就又失效了，对我们应用完全无影响了。   

等等，感觉上面的说法好像是有误的，其实 `contentBase` 就是服务器提供服务的文件系统的目录咯，
`publicPath` 的根目录应该就是 `contentBase` 吧。    

但是 HMR 有一点陷阱就是：   

```js
import printMe from './print';

btn.addEventListener('click', printMe);

if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated printMe module!');
    btn.removeEventListener('click', printMe);
    btn.addEventListener('click', printMe);
  });
}
```    

上面的代码并没能成功的移除旧的 printMe 函数，推测是在 HMR 后 printMe 以及是另外一个变量了，
这样移除操作其实什么都没做，这样的话就又绑定了一个新的 hanler，不过可以通过下面这样 hack 的方式
修复：   

```js
import printMe from './print';

btn.addEventListener('click', printMe);
const printCopy = printMe;

if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated printMe module!');
    btn.removeEventListener('click', printCopy);
    btn.addEventListener('click', printMe);
  });
}
```    

## Demo05 Tree shaking

新的 webpack 4 正式版本，扩展了检测能力，通过 package.json 的 "sideEffects" 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯的 ES2015 模块)"，由此可以安全地删除文件
中未使用的部分。     

因为其实编译器是很难知道你未使用的可导出部分以及一些未用到的部分是否有副作用，是否是“纯”的，因此
只能我们通过 `sideEffects` 是提示给编译器。    

在一个 100% 的 ESM 中，识别未使用代码其实是很容易的，但是现在我们并未处在那一环境中，因此我们
需要手动提示 webpack 的编译器我们哪些代码是“纯粹的”。   

怎么做呢？在 package.json 中配置 `sideEffects` 字段：   

```json
{
  "name": "your-project",
  "sideEffects": false
}
```    

我们这个例子中的代码都没有副作用，因此我们可以通过把这个属性设为 `false` 来告诉 webpack 可以
安全地删除未用到的 export。   

那这个副作用估计就是指那些未用到的 export 可能产生的副作用。    

如果我们的代码有副作用，可以将字段定义为一个数组：   

```js
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js"
  ]
}
```   

这个数组接受相对路径，绝对路径，模式匹配。   

需要格外注意的点是所有被导入的文件都被视为 tree shaking 操作的对象，因此如果我们使用 css-loader
导入了 CSS file，也要把这个文件加入副作用名单，以防在 production 模式下被误删掉。   

这个字段也可以在 module.rules 配置中配置。   

然而光这样设置了还不够，必须设置 mode 为 production 模式 webpack 才会真正的把未使用的导出
删除掉。   

## Demo06 Production

使用 webpack-merge 包合并配置文件。 `$ npm i -D webpack-merge`    

webpack v4 production 模式下会自动设置 DefinePlugin，应该是等价于以下的配置：   

```js
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}
```   

## Demo07 Code Spliting

3 种启用代码分割的方式：   

+ 入口点：使用 entry 配置手动分割代码（这个意思是多页应用的自动分开打包？）
+ 禁止重复：使用 `SplitChunksPlugin` 禁止代码的重复并分割成块
+ 动态导入：通过在模块内部调用的函数分割代码    

`SplitChunksPlugin` 可以让我们抽取出公共的依赖到一个入口 chunk 中或者到一个全新的 chunk 中。   

webpack.config.js:   

```js
const path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    main: './src/index.js',
    another: './src/another-module.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: './dist/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
```   

index.js:   

```js
import _ from 'lodash';

const elem = document.createElement('div');
elem.classList.add('head');

elem.innerHTML = 'Hello Webpack';

document.body.appendChild(elem);
console.log(
  _.join(['Hello', 'Webpack'], ' ')
);
```   

another-module.js:   

```js
import _ from 'lodash';

console.log(
  _.join(['Another', 'module', 'loaded!'], ' ')
);
```   

注意 html 要同时引入 chunk 和 entry。而且顺序好像无所谓？    

## Demo08 Code Spliting2

webpack 支持两种动态导入的方式：`import()` 和 `require.ensure()`。    

webpack.config.js:   

```js
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: './dist/'
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
};
```   

index.js:   

```js
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
```   

然而打包出来的 chunk 名字是 vendors~lodash.chunk.js。。。。，无法理解。而且文档上打包出来的
文件也是有 vendors 前缀的。    

从 webpack4.6 开始支持 prefetch 和 preload。   

+ prefetch：资源可能在将来导航到别处的时候需要
+ preload：资源可能在当前导航中需要    

```js
import(/* webpackPrefetch: true */'LoginModal')
```   

原理也很简单，就是在页面中添加一个 `<link rel="prefetch" href="login-modal-chunk.js" />`   

preload 和 prefetch 的区别：   

+ preloaded chunk 会和父 chunk 并行加载，prefetched chunk 在父 chunk 加载完成后开始加载
+ preloaded chunk 有一个居中位置的优先级并且会立刻下载，prefetched chunk 会在浏览器空闲
时下载
+ preloaded chunk 应该被父 chunk 立即请求，prefetched chunk 可能是在未来的某个时间段使用

## Demo09 Lazy Loading

这里有必要将几个概念区分开来，bundle spliting, code spliting, lazy loading, dynamic
imports。这里 bundle spliting 是基础，是指不单一生成一个包含所有模块的打包文件，而是将一个
文件分成多个，这样有利于我们的长缓存，将不变的与经常变动的区别开来，而 code spliting 与 bundle
spliting 类似，意指将所有模块打到多个包中，code spliting 实现的方式上面已经提到了，有 3 种，
multi enrty, splitChunksPlugin, 和 dynamic imports。而 lazy loading 则是利用了 code
spliting 和 dynamic imports 技术，因为我们动态加载，并不意味着 lazy loading，只有将 loading
写在一些条件中，才会出现 lazy loading。   

配置同上。index.js:   

```js
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
```   

print.js:   

```js
console.log('The print.js module has loaded! See the network tab');

export default () => {
  console.log('Button Clicked!');
}
```    

## Demo10 Caching

由于 webpack 每次编译时都会在 entry chunk 中写入一些模板代码，包括 runtime code 和 manifest。
因此即使我们使用了 `contenthash`，每次编译出来的文件的名称还是不一样的。（然而测试的时候每次
编译出来的文件名称是一致的啊。。。。。）    

而且从原理来看，测试的时候结果更能说通啊，两次编译只要什么都不改动，那模板代码也不应该变动啊。即便
使用了下面的 `runtimeChunk` 也能看出每次生成的 runtime.hash.js 文件中的 hash 也是都不变
的啊。   

之前提过可以使用 SplitChunksPlugin 来分割模块代码到不同的 chunk 中，webpack 还提供了一种
优化机制来特意将 webpack runtime 代码分离出来，即将 `optimization.runtimeChunk` 设置
为 `single`。   


webpack.config.js:   

```js
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  plugins: [
    new CleanWebpackPlugin(['./dist']),
    new HtmlWebpackPlugin({
      title: 'Caching'
    })
  ],
  optimization: {
    runtimeChunk: 'single'
  }
};
```    

注意这里 runtime 代码反而被当成入口点，生成的文件名为 runtime.js，index.js 反而被当成额外
的 chunk，生成的文件名为 main.chunk.js。    

注意页面中要同时引入这两个脚本，runtime.js 在前，main.chunk.js 在后。   

然后如果再将第三方 vendor 代码提取出来的话，可以这样配置：   

```js
  var path = require('path');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: './src/index.js',
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Caching'
      }),
    ],
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist')
    },
    optimization: {
     runtimeChunk: 'single'
     runtimeChunk: 'single',
     splitChunks: {
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: 'vendors',
           chunks: 'all'
         }
       }
     }
    }
  };
```    

这种情况下，如果我们修改 entry 中的代码，引入一个新的文件 print.js，我们可能幻想只有 main
的 hash 变化，然而事实上是三个 bundle 的 hash 都会变化。这是因为 `module.id` 增加了，因此
三个文件中都有数据进行了变动。    

这种情况下 main 和 runtime bundle 的变化是可以理解的，但是 vendor 的变化是需要我们修复的。
有两种，一种是使用 `NamedModulesPlugin`，会使用模块路径而不是数字 id 标记模块。第二种是
`HashedModuleIdsPlugin`，后者推荐在 production 环境使用。   

```js
  const path = require('path');
  const webpack = require('webpack');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: './src/index.js',
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Caching'
      }),
      new webpack.HashedModuleIdsPlugin()
    ],
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist')
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    }
  };
```    

## Demo11 Authoring Libraries

webpack.config.js:   

```js
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack-numbers.js',
    library: 'webpackNumbers',
    libraryTarget: 'umd'
  },
  plugins: [
    new CleanWebpackPlugin(['./dist'])
  ],
  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_'
    }
  }
};
```   

这个 `externals` 配置意味着我们希望一个叫做 `lodash/_` 的依赖在对应的用户的环境中是可用的。   

## Demo12 Shimming

`ProvidePlugin` 可以让一个包的变量作为一个变量在每个被 webpack 编译的模块中出现。   

```js
plugins: [
  new webpack.ProvidePlugin({
    _: 'lodash'
  })
]
```

这个配置的意思就是，如果 webpack 在编译过程中至少遇见一次对变量 `_` 的使用，就加载 `lodash`
包并把它提供给需要它的每个模块。    

还有另一种配置方案，加入我们可能只用到了这个模块中的一个方法，可以这样配置 `[module, child, ...children?]`，
比如说加入我们现在只希望使用一个 `join` 方法。   

```js
  plugins: [
    new webpack.ProvidePlugin({
      join: ['lodash', 'join']
    })
  ]
```   

然而文档说这种方法结合 tree shaking 可以将 lodash 中没用到的丢掉，但是实验时没效果。   

## Demo13 Shimming2 Global Export

假设我们现在有个这样过时的库，期望在全局命名空间中定义变量。   

globals.js:   

```js
var file = 'blah.txt';

var helpers = {
  test: function() {
    console.log('test someing');
  },
  parse: function() {
    console.log('parse something');
  }
}
```    

这种情况下可以使用 exports-loader 来让全局变量变成一个正常的模块导出变量。   

```js
rules: [
  {
    test: require.resolve('globals.js'),
    use: 'exports-loader?file,parse=helpers.parse'
  }
]
```   

index.js:   

```js
import { file, parse } from './globals';

const elem = document.createElement('div');
elem.classList.add('head');

elem.innerHTML = 'Hello Webpack';

document.body.appendChild(elem);

console.log(file);
parse();
```   

然而上述的配置会报错。。。。，需要把 `require.resolve('globals.js')` 改为 `/globals\.js/`。   