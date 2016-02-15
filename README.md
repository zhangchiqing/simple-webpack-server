# Webpack Simple Server

This server should be used for DEVELOPMENT ONLY.

The webpack-simple-server is a little node.js app which uses webpack-dev-server to serve your module for easy development and debugging.

- It automatically generates the html file needed for webpack-dev-server to serve your module.
- Supports CommonJS style javascript module.
- Updates the browser on changes.
- CSS loader included.
- Source mapping enabled.

## Get started
```
npm install --save-dev webpack
npm install --save-dev webpack-dev-server
npm install --save-dev webpack-simple-server
```

## Usage
### 1. Create a file `tests/main.js`
```
var webpackSimpleServer = require('webpack-simple-server');

webpackSimpleServer({
  entry: __dirname + '/../src/main.js',
  output: __dirname + '/../bundle/',
  title: 'Repo',
});

```

### 2. Run
```
node ./tests/main.js
```

### 3. Visit `http://localhost:8087/` to view your module

## Licensing
MIT
