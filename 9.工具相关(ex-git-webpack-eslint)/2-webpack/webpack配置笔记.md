# Webpack介绍（v3.5.5）
## 概述
### 为什要使用WebPack

1. 页面应用拥有复杂的JavaScript代码和一大堆依赖包，为简化开发复杂度，提出一些方式
  - 模块化，让我们可以把复杂的程序细化为小的文件;
  - 类似于TypeScript扩展js的语言，使目前版本js能有一些特殊特性，并还可在当前浏览器版本使用
  - Scss，less等CSS预处理器
2. 上述方式提供了开发效率，但还需要对开发文件进行额外的处理才能让浏览器识别，因此出现了webpack这样的工具

### WebPack、Grunt、Gulp相比有什么特性​
1. WebPack是一种模块化的解决方案
  - WebPack可以看做是模块打包机：它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其转换和打包为合适的格式供浏览器使用。
2. Gulp/Grunt是一种能够优化前端的开发流程的工具
  - Grunt和Gulp的工作方式是：在一个配置文件中，指明对某些文件进行类似编译，组合，压缩等任务的具体步骤，工具之后可以自动替你完成这些任务。

## 初体验
### 目录结构
![目录结构][1]
### hello.js
```javascript
module.exports = function() {
    var greet = document.createElement('div');
    greet.textContent = "Hello!!!! Rextao";
    return greet;
};
```
### index.js
```javascript
const greeter = require('./hello.js');
document.getElementById("root").appendChild(greeter());
```
### index.html

``` html
<body>
    <div id="root"></div>
    <script src="../bundle.js"></script>
</body>
```
### package.json
1. 利用npm init自动生成后，加入webpack包

``` json
{
  "name": "testwebpack",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^3.5.5"
  }
}
```
### 输入命令行参数
1.  webpack在终端中使用基本用法
1.  webpack app/index.js bundle.js
2.   终端输入命令打包太复杂，容易出错，使用配置文件方式

``` javascript
# {extry file}出填写入口文件的路径，本文中就是上述main.js的路径，
# {destination for bundled file}处填写打包文件的存放路径
# 填写路径的时候不用添加{}
webpack {entry file} {destination for bundled file}
```
## 通过配置文件使用webpack
### webpack.config.js
1. 在命令行输入webpack(非全局安装需使用node_modules/.bin/webpack)即可，会自动引用这个文件的配置
2.  注：“__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录。

```javascript
module.exports = {
    entry:  __dirname + "/app/index.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname,//打包后的文件存放的地方
        filename: "bundle.js"//打包后输出文件的文件名
    }
};
```
## 利用npm start打包
### 更改package.json文件
1. 增加start：webpack一行
```json
"scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "webpack"
}
```
1. package.json中的script会按照一定顺序寻找命令对应位置，本地的node_modules/.bin路径就在这个寻找清单中，所以无论是全局还是局部安装的Webpack，都能找到webpack命令
2.  npm的start命令是一个特殊的脚本名称，其特殊性表现在，在命令行中使用npm start就可以执行其对于的命令，如果对应的此脚本名称不是start，想要在命令行中运行时，需要这样用npm run {script name}如npm run build，会运行。。。。处的脚本
```json
"scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "build" : "............ ",
      "start": "webpack"
}
```

## 强大之处
### 生成Source Maps（使调试更容易）
#### 概述
1. 不过有时候通过打包后的文件，你是不容易找到出错了的地方，对应的你写的代码的位置的，Source Maps就是来帮我们解决这个问题的。
1. 在webpack的配置文件中配置source maps，需要配置devtool，有四种不同的配置选项，并各具优缺点
1. 通过此工具，配置打包速度与生成错误的方式

#### devtool配置
| devtool选项 | 配置结果 |
|--------|--------|
|    source-map    |     产生完整且功能完备的source map，打包慢   |
|    cheap-module-source-map    |     调试只能对应具体行，没有具体列对应，构建速度更快，但是不利于调试，推荐在大型项目考虑时间成本时使用  |
|    eval-source-map    |     不影响速度，且完备，但输出的js执行具有性能和安全隐患，开发最好选择，生产阶段不要用   |
|   cheap-module-eval-source-map   |     最快生成source map的方式，没有列映射   |
1. 综述：devtool配置从上到下是速度越来越快，副作用越来越大

### 构建本地服务器
#### 概述
1. webpack-dev-server是基于node构建的，可以自动刷新修改后的结果
| devserver的配置选项 | 功能描述 |
|--------|--------|
|     contentBase   |   默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到“public"目录）     |
|      port  |     设置默认监听端口，如果省略，默认为”8080“   |
|     inline   |     设置为true，当源文件改变时会自动刷新页面   |
|   historyApiFallback     |    在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html    |
|   colors     |    终端输出为彩色   |

#### webpack.config.js
```javascript
module.exports = {
    entry:  __dirname + "/app/index.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname+"/public",//打包后的文件存放的地方
        filename: "bundle.js"//打包后输出文件的文件名
    },
    devServer :{
        contentBase : __dirname+"/public",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    }
};
```
#### package.json
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack",
    "server" : "webpack-dev-server --open" //注释删掉，--open会运行命令后，自动弹出页面
}
```
#### 输入命令
1. 在终端中输入npm run server

## Loaders
### 概述
1. 通过使用不同的loader，webpack有能力调用外部的脚本或工具，实现对不同格式的文件的处理，如
	- 分析转换scss为css
	- 把下一代的JS文件（ES6，ES7)转换为现代浏览器兼容的JS文件
	- 对React的开发而言，合适的Loaders可以把React的中用到的JSX文件转换为JS文件

1. loader主要配置参数
    - 需要在webpack.config.js中的modules关键字下进行配置

| 配置参数 | 说明 |是否必须|
|--------|--------|----------|
|test|     一个用以匹配loaders所处理文件的拓展名的正则表达式  |必须 |
|   loader     |    loader的名称   |必须 |
| include/exclude|手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）|可选|
| query|为loaders提供额外的设置选项|可选|


### Babel
1. 概述
	- Babel其实是一个编译JavaScript的平台，可以达到如下目的
	- 使用下一代的js代码（ES6，ES7...），即使这些标准目前并未被当前的浏览器完全的支持；
	- 使用基于js进行了拓展的语言，比如React的JSX；
	- babel其实是几个模块化的包，需要每个功能都需要安装单独包，使用最多的是解析Es6的babel-preset-es2015包和解析JSX的babel-preset-react包
2. 安装依赖
```
npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react
```
3. 利用react简易测试babel
	- webpack.config.js增加babel
```javascript
 module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "es2015", "react"
                        ]
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
```
	- config.json将数据提炼出来，webpack3.*内置支持
```json
{
  "greetText": "Hello Rextao!!!"
}
```
	- index.js
```javascript
import config from './config.json'
import React from  'react'
import ReactDom from 'react-dom'
export default class Hello extends React.Component{
    render(){
        return(
            <div>
                {config.greetText}
            </div>
        )
    }
}
ReactDom.render(
    <Hello/>,
    document.getElementById('root')
);
```
	- package.json
```json
  "devDependencies": {
        "babel-core": "^6.26.0",
        "babel-loader": "^7.1.2",
        "babel-preset-es2015": "^6.24.1",
        "babel-preset-react": "^6.24.1",
        "webpack": "^3.5.5"
  },
  "dependencies": {
        "react": "^15.6.1",
        "react-dom": "^15.6.1"
  }
```
	- 目录结构
![目录结构][2]

3. 利用.babelrc配置
		- 考虑到babel可能配置有很多内容，可以将babel的配置项放于“.babelrc”配置文件中
		- webpack会自动调用.babelrc里的babel配置选项
		- webpack.config.json
```javascript
module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
```
 	- .babelrc
```json
{
  "presets": ["react", "es2015"]
}
```

### CSS
1. webpack提供的样式处理工具
	- css-loader：使你能够使用类似@import 和 url(...)的方法实现 require()的功能
	- style-loader：将所有的计算后的样式加入页面中
2. 安装
```
npm install --save-dev style-loader css-loader
```
3. webpack.config.json
```json
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test : /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            }
        ]
    }
```
1. 设置main.css样式文件在app文件夹下
2. index.js
```javascript
import config from './config.json'
import React from  'react'
import ReactDom from 'react-dom'
import './main.css';
export default class Hello extends React.Component{
    render(){
        return(
            <div>
                {config.greetText}
            </div>
        )
    }
}
ReactDom.render(
    <Hello/>,
    document.getElementById('root')
);
```
1. 通常情况下，css会和js打包到同一个文件中，并不会打包为一个单独的css文件，不过通过合适的配置webpack也可以把css打包为单独的文件的。

### CSS module
1. 把JS的模块化思想带入CSS中来，通过CSS模块，所有的类名，动画名默认都只作用于当前模块
2. Webpack从一开始就对CSS模块化提供了支持，在css-loader模块中增加可选参数options：{module：true}
3.  webpack.config.json
```json
 use: [
        {
            loader: "style-loader"
        },
        {
            loader: "css-loader",
            options: {
                modules: true
            }
        }
    ]
```

### PostCSS（css处理平台）
1. 为CSS代码自动添加适应不同浏览器的CSS前缀。
2. 安装
```
npm install --save-dev postcss-loader autoprefixer
```
3. webpack.config.js
```json
use: [
        {
            loader: "postcss-loader"
        }
    ]
```
1. postcss.config.js
``` javascript
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```
	- 你写的css会自动根据Can i use里的数据添加不同前缀

### 其他loader
1. url-loader
	- 安装
```
npm install --save-dev url-loader
npm install --save-dev file-loader
```
	- 这个loader将图片转为base64编码并载入浏览器，减少http请求数
	- 但图片重用高时，都转为base64会增加html与js体积，两者要均衡
	- 主要是解决：css中引入图片问题，如不增加url-loader，css中引入图片会报错
	- url-loader基于file-loader
	- webpack.config.js
```
module: {
        loaders: [
            ........
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 5000  //图片小于5000字节，会自动转换为base64编码
                        }
                    }
                ]
            }
        ]
    }
```

### CSS3图标配置
```javascript
{
    test: /\.(png|jpg|gif|woff|woff2|svg|ttf|eot)$/i,
    use: [
        {
            loader: 'url-loader',
            options: {
                limit: 5000
            }
        }
    ]
}
```



## 插件（Plugins）
### 概述
1. loaders是在打包构建过程中用来处理源文件的（JSX，Scss，Less..），一次处理一个
2. 插件并不直接操作单个文件，它直接对整个构建过程其作用
3. 如插件是第三方的需要通过npm

### 使用插件的方法
1. 增加版权说明
```javascript
plugins: [
    	new webpack.BannerPlugin('版权所有，翻版必究')
]
```
	- 会在bundle.js中首行，看到这个注释信息
2. HtmlWebpackPlugin
	- 插件通过一个模板，生成一个新的html文件，这样无需在index.html中引用bundle.js，通过模板与这个插件，会自动生成
	- 安装
```
npm install --save-dev html-webpack-plugin
```
	- webpack.config.js
```javascript
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	.......
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
    .......
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
        })
    ],
};
```
	- index.tmpl.html文件，在app下;注意这个模板文件没有引入js与css
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Webpack Sample Project</title>
    </head>
    <body>
        <div id='root'>
        </div>
    </body>
</html>
```

3. Hot Module Replacement
	 - 允许你在修改组件代码后，自动刷新实时预览修改后的效果。
	 - Babel有一个叫做react-transform-hrm的插件，可以在不对React模块进行额外的配置的前提下让HMR正常工作
	 - 注意：不增加此插件，在react中，如引入```<Index/>```组件，并不会做热更新
	 - webpack.config.js增加
``` javascript
    plugins: [
        new webpack.HotModuleReplacementPlugin()//热加载插件
    ]
```
	 - 安装react-transform-hmr
```
npm install --save-dev babel-plugin-react-transform react-transform-hmr
```
	 - 配置.babelrc
```
        {
          "presets": ["react", "es2015"],
          "env": {
            "development": {
            "plugins": [["react-transform", {
               "transforms": [{
                 "transform": "react-transform-hmr",
                 "imports": ["react"],
                 "locals": ["module"]
               }]
             }]]
            }
          }
        }
```

## 产品阶段的构建
###  webpack.production.config.js
1. 新增：
```
"build": "set NODE_ENV=production && webpack --config ./webpack.production.config.js --progress"
```
1. 这是windows下情况，有set 和&& ，linux系统为：
```
"build": " NODE_ENV=production  webpack --config ./webpack.production.config.js --progress"
```





### 优化插件
1. 大多来自于webpack社区，可以通过npm安装，通过以下插件可以完成产品发布阶段所需的功能
| 插件 | 描述 |是否要npm安装 |
|--------|--------|--------|
|  OccurenceOrderPlugin|     为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID   |否 |
|  UglifyJsPlugin      |   压缩JS代码     |否 |
|ExtractTextPlugin|分离CSS和JS文件| 是|
 - webpack.config.json
```json
plugins: [
    new webpack.BannerPlugin('版权所有，翻版必究'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
]
```
1. CommonsChunkPlugin
	- 提取js中的公共模块，并存储在高速缓存中供以后使用。这会对页面优化，浏览器可以快速使用缓存的公共模块，而不是每当访问新页面时被强制加载更大的包。
	- 配置webpack.production.config.js
```
		new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',						//  创建的文件名为vendor......js
            filename: '/js/[name].[hash:8].js'   // 在js文件夹下，hash码8位
        }),
```

## 缓存
1. 概述
	- 使用缓存的最好方法是保证你的文件名和文件内容是匹配的（内容改变，名称相应改变）
	- 通过添加特殊的字符串混合体（[name], [id] and [hash]）到输出文件名前解决缓存问题
```json
output: {
        path: __dirname+"/public",//打包后的文件存放的地方
        filename: "bundle-[hash].js"//打包后输出文件的文件名
    }
```

* * *
# 完整案例
## 目录结构
![目录结构][3]

## webpack.config.js
``` javascript
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry:  __dirname + "/app/js/index.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test : /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "postcss-loader"
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 5000
                        }
                    }
                ]
            }
        ]
    },
    devServer :{
        contentBase : __dirname+"/bulid",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
        }),
        new webpack.HotModuleReplacementPlugin()//热加载插件
    ]
};
```

## webpack.config.js
``` javascript


```

## webpack.production.config.js
``` javascript
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry:  __dirname + "/app/index.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname + "/build",
        filename: "./js/bundle-[hash].js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!postcss-loader"
                })
            }
        ]
    },
    devServer :{
        contentBase : "./public",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true,//实时刷新
        hot: true
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        // 提供公共代码
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: '/js/[name].[hash:8].js'
        }),
        new ExtractTextPlugin("/css/[name]-[hash:8].css") //[name]引用原文件名，[hash:8]：8为hash码命名文件

    ]
};
```

## postcss.config.js
``` javascript
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```

## package.json
``` json
{
  "name": "testwebpack",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack",
    "server": "set NODE_ENV=dev && webpack-dev-server --progress --colors",
    "build": "rd/s/q build && set NODE_ENV=production && webpack --config ./webpack.production.config.js --progress"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "autoprefixer": "^7.1.2",
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-plugin-react-transform": "^2.0.2",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "css-loader": "^0.28.5",
    "extract-text-webpack-plugin": "^3.0.0",
    "file-loader": "^0.11.2",
    "html-webpack-plugin": "^2.30.1",
    "postcss-loader": "^2.0.6",
    "react-transform-hmr": "^1.0.4",
    "style-loader": "^0.18.2",
    "url-loader": "^0.5.9",
    "webpack": "^3.5.5"
  },
  "dependencies": {
    "react": "^15.6.1",
    "react-dom": "^15.6.1"
  }
}
```

## index.js
``` javascript
import config from '../json/config.json'
import React from  'react'
import ReactDom from 'react-dom'
import Hello from './hello'
import '../css/main.css'
export default class Index extends React.Component{
    render(){
        return(
            <div>
                {config.greetText}
                <Hello/>
                <p>asdfasd</p>
                {console.log(PRODUCTION)}
            </div>
        )
    }
}
ReactDom.render(
<Index/>,
    document.getElementById('root')
);
```

## hello.js
``` javascript
import React from  'react'
export default class Hello extends React.Component{
    render(){
        return(
            <p>
                This is Hello1!!!
                <span className="small"> </span>
                <span className="big"> </span>
            </p>
        )
    }
}
```

## config.json
``` json
{
  "greetText": "Hello edeas!!!"
}
```

* * *

# webpack与react-router
## 概述
1. react-router使用v4版本
2. 之前使用遇到的一个主要问题是，webpack热部署后，react-router在浏览器输入地址，页面会跳转到错误页，页面显示 can't get，未找到原因
3. 利用上述完整案例，整合react-router，测试基本的转跳，link，404页面，未出现问题

## 主要变化
### index.js
```javascript
import React from  'react'
import ReactDom from 'react-dom'
import RouterMap from './router/RouterMap'
export default class Index extends React.Component{
    render(){
        return(
            <RouterMap/>
        )
    }
}
ReactDom.render(
<Index/>,
    document.getElementById('root')
);
```
### RouterMap.js
```javascript
import config from '../../json/config.json'
import React from  'react'
import Hello from './../hello'
import Test1 from './../test1'
import Test2 from './../test2'
import NoMatch from './../noMatch'
import '../../css/main.css'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
export default class RouterMap extends React.Component{
    render(){
        return(
            <Router>
                <div>
                    {config.greetText}
                    <Switch>
                        <Route exact path='/' component={Hello}/>
                        <Route path='/test1' component={Test1}/>
                        {/*如何传递url参数*/}
                        <Route path='/test2/:id' component={Test2}/>
                        {/*404页面配置*/}
                        <Route component={NoMatch}/>
                    </Switch>
                </div>
            </Router>
        )
    }
}
```
# 注意

1. 目前很多浏览器直接支持ES6语法，故webpack是否将es6语法编译为es5，需要看bundle.js

# 附录

## 补充
### 为何要分为两个js
1. 一般打包是将js压缩为vendor.js和app.js，vendor.js为第三方库引用的，app.js为项目引用的，这样更新版本时候，只需改app.js即可
2. 这样客户端缓存的vendor.js还可以使用，每次更新只需要更新app.js即可


[1]: ./images/1.jpg
[2]: ./images/2.png
[3]: ./images/3.png
