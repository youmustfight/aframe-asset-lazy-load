var AFRAME = require('aframe-core');
var assetLazyLoad = require('../index.js').component;
AFRAME.registerComponent('lazy-load', assetLazyLoad);