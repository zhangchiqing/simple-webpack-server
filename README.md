# Simple Webpack Server

This server should be used for DEVELOPMENT ONLY.

The simple-webpack-server is a little node.js app which uses webpack-dev-server to serve your module for easy development and debugging.

- It automatically generates the html file needed for webpack-dev-server to serve your module (For example, a ReactJS component).
- Supports CommonJS style javascript module.
- Updates the browser on changes.
- CSS loader included.
- Source mapping enabled.
- No need to create webpack.config.js

## Get started
```
npm install --save-dev webpack
npm install --save-dev webpack-dev-server
npm install --save-dev simple-webpack-server
```

## Usage
### 1. Create a file `debugging.js`
```
var simpleWebpackServer = require('simple-webpack-server');

simpleWebpackServer({
  entry: __dirname + '/src/myModule.js',
  output: __dirname + '/bundle/',
  title: 'myModule',
});

```

### 2. Run
```
node debugging.js
```

### 3. Visit `http://localhost:8087/` to view your module

## Licensing
MIT
