/* doctest */
/*
 * Usage:
 *
 * var webpackSimpleServer = require('webpack-simple-server');
 * webpackSimpleServer({
 *  entry: __dirname + './repo.js',
 *  outputDir: __dirname + '../bundle/',
 *  title: 'Repo',
 * });
 */
'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('assert-plus');
var debug = require('debug');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
// > getFileName('./repo.js');
// 'repo.js'
var getFileName = function(pathStr) {
  assert.string(pathStr, 'pathStr');
  return path.basename(pathStr);
};

// > getFileNameNoExt('./repo.js');
// 'repo'
// > getFileNameNoExt('/file/./../base/repo.ext.js');
// 'repo.ext';
// > getFileNameNoExt('repo');
// 'repo'
// > getFileNameNoExt('repo.7');
// 'repo'
var getFileNameNoExt = function(pathStr) {
  assert.string(pathStr, 'pathStr');
  var filename = getFileName(pathStr);
  return filename.replace(/\.[^\.]*$/, '');
};

var makeWebpackConfig = function(entry, outputDir) {
  assert.string(entry, 'entry');
  assert.string(outputDir, 'outputDir');

  return {
    entry: {
      app: [
        entry,
        'webpack-dev-server/client?http://localhost:8087',
        'webpack/hot/dev-server'],
    },
    output: {
      path: path.resolve(outputDir),
      filename: getFileName(entry),
    },
    debug: true,
    devtool: 'sourcemap',
    plugins: [new webpack.HotModuleReplacementPlugin()],
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    }
  };
};

var makeJS = function(compiler) {
  assert.object(compiler, 'compiler');

  return new Promise(function(resolve, reject) {

    compiler.watch({
      aggregateTimeout: 300, // wait so long for more changes
      poll: true // use polling instead of native watchers
    }, function(err, stats) {
      if (err) {
        reject(err);
      }

      debug('r:webpackjs')('webpack:build', stats.toString({
        assets: true,
        colors: true,
        version: true,
        modules: false,
        hash: false,
        timings: false,
        chunks: true,
        chunkModules: false,
        reasons : true,
        cached : true,
        chunkOrigins : true
      }));

      resolve();
    });
  });
};

var makeHTMLString = function(urlBundleJS, title) {
  assert.string(urlBundleJS, 'urlBundleJS');
  title = title || 'Document';
  return '' +
  '<!DOCTYPE html><html lang="en">\n' +
  '<head> <meta charset="UTF-8"> <title>' + title + '</title> </head>\n' +
  '<body> <script src="' + urlBundleJS + '"></script></body> </html>';
};

var writeHTML = function(pathHTML, html) {
  assert.string(pathHTML, 'pathHTML');
  assert.string(html, 'html');
  fs.writeFileSync(pathHTML, html);
  debug('r:html')('saved html to', path.resolve(pathHTML));
};

var makeWebpackDevserverConfig = function(filename, outputDir) {
  assert.string(filename, 'filename');
  assert.string(outputDir, 'outputDir');

  return {
    // webpack-dev-server options

    contentBase: outputDir,
    // or: contentBase: "http://localhost/",

    hot: true,
    // Enable special support for Hot Module Replacement
    // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
    // Use "webpack/hot/dev-server" as additional module in your entry point
    // Note: this does _not_ add the
    // `HotModuleReplacementPlugin` like the CLI option does.

    // Set this as true if you want to access dev server from arbitrary url.
    // This is handy if you are using a html5 router.
    historyApiFallback: false,

    // webpack-dev-middleware options
    quiet: false,
    noInfo: false,
    lazy: false,
    port: 8087,
    filename: filename,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    publicPath: '/',
    headers: { 'X-Custom-Header': 'yes' },
    stats: { colors: true },
  };
};

var makeCompiler = function(config) {
  var webpackConfig = makeWebpackConfig(config.entry, config.outputDir);
  debug('r:webpackConfig')(webpackConfig);
  return webpack(webpackConfig);
};

// saveHTML({ entry: './repo.js', 'outputDir': '../bundle/' })
var saveHTML = function(config) {
  var filename = getFileName(config.entry);
  var filenameNoExt = getFileNameNoExt(config.entry);
  var html = makeHTMLString(filename, filenameNoExt);
  var pathHTML = path.join(config.outputDir, 'index.html');
  writeHTML(pathHTML, html);
};

var makeServer = function(config, compiler) {
  assert.object(compiler, 'compiler');
  var webpackDevserverConfig = makeWebpackDevserverConfig(
    getFileName(config.entry),
    config.outputDir);
  debug('r:webpack')('webpackDevServerConfig', webpackDevserverConfig);
  return new WebpackDevServer(compiler, webpackDevserverConfig);
};

// run
module.exports = function(config) {
  assert.object(config, 'config');
  assert.string(config.entry, 'config.entry');
  assert.string(config.outputDir, 'config.outputDir');

  saveHTML(config);
  var compiler = makeCompiler(config);
  makeJS(compiler)
  .then(function() {
    var server = makeServer(config, compiler);
    server.listen(8087, 'localhost', function() {
      console.log('server is running. visit: http://localhost:8087/');
    });
  });
};

