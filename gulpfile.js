const {
  series,
  src,
  dest,
  watch
} = require('gulp');
const babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var htmlhint = require("gulp-htmlhint");
var es = require('event-stream');
var ss = require('stream-series');

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function sleep(n) {
  msleep(n * 1000);
}
function testJS() {
  return src('test/*.js')
  .pipe(babel())
  .pipe(uglify())
  .pipe(rename({
    extname: '.min.js'
  }))
  .pipe(dest('test/output'));
}


function test(cb) {
  testJS();
  cb()
}


function htm(cb) {
  src('test/test.html')
    .pipe(inject(ss(testJS()), {
      relative: false,
      ignorePath: 'output',
      addPrefix: '.',
      addRootSlash: false
    }))
    .pipe(htmlhint())
    .pipe(dest('test/output'));
  watch('test/*.js').on('change', series(test))
  cb && cb()
}

module.exports = {
  default: series(test, htm),
}