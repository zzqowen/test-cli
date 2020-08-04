const {
  series,
  src,
  dest,
  watch
} = require('gulp');
var es = require('event-stream');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss')
var inject = require('gulp-inject');
var gls = require('gulp-live-server');
var htmlhint = require("gulp-htmlhint");
var jshint = require("gulp-jshint");
var browserSync = require('browser-sync').create();
var proxyMiddleware = require('http-proxy-middleware');
var browserify = require('browserify');
var through2 = require('through2');

var config = require('./config');

var vendorStream = src('pages/home/*.js')
  .pipe(babel())
  .pipe(rename({
    extname: '.min.js'
  }))
  .pipe(dest('output/'))
  .pipe(through2.obj(function (file, enc, next) {
    browserify(file.path)
      // .transform(reactify)
      .bundle(function (err, res) {
        err && console.log(err.stack);
        file.contents = res;
        next(null, file);
      });
  }))
  // .pipe(uglify({
  //   ie8: true
  // }))
  // .pipe(jshint())
  // .pipe(jshint.reporter())
  .pipe(dest('output/'));

var appStream = src('pages/home/*.css')
  .pipe(postcss())
  .pipe(dest('output/'))

var h = function (cb) {
  console.log(src('pages/home/home.html'))
  src('pages/home/home.html')
    .pipe(inject(es.merge(vendorStream, appStream), {relative: false, ignorePath: 'output', addPrefix: '.', addRootSlash: false}))
    .pipe(htmlhint())
    .pipe(dest('output/'));

 
  cb && cb()
}

function lis() {
 watch("pages/**/*.html", series(h)).on('change', function(path, stats) {
    // console.log(path, stats)
    series(h)
  });
}

function c(cb) {
  src('output/*')
    .pipe(clean())
  cb && cb()
}
var proxyTable = config.dev.proxyTable;
var middleware = proxyMiddleware.createProxyMiddleware(Object.keys(proxyTable), proxyTable[Object.keys(proxyTable)[0]]);

function serverDev() {
  browserSync.init({
    server: {
      baseDir: "./output",
      index: "home.html",
      middleware: middleware
    },
    // port: 8888,
  });

  watch("pages/**/*.html").on('change', series(h, browserSync.reload));
  watch("pages/**/*.js").on('change', series(h));
  watch("pages/**/*.html").on('change', series(h));
}

// exports.dev = series(serverDev)
// exports.default = series(c, h)

module.exports = {
  default: series(h, lis),
  dev: series(serverDev),
}