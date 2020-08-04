"use strict"

const path = require('path');

const distRoot = 'output';

module.exports = {
  dev: {
    assetsRoot: path.resolve(__dirname, `../${distRoot}`),
    assetsSubDirectory: './static',
    assetsPublicPath: './',
    proxyTable: {
      '/api': {
        target: 'http://oms.aixunmiao.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  build: {
    assetsRoot: path.resolve(__dirname, `../${distRoot}`),
    assetsSubDirectory: './static',
    assetsPublicPath: './',
  }
}