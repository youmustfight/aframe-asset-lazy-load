/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// Browser distribution of the A-Frame component.
	(function () {
	  if (typeof AFRAME === 'undefined') {
	    console.error('Component attempted to register before AFRAME was available.');
	    return;
	  }

	  // Register all components here.
	  var components = {
	    assetLazyLoad: __webpack_require__(1).component
	  };

	  Object.keys(components).forEach(function (name) {
	    if (AFRAME.aframeCore) {
	      AFRAME.aframeCore.registerComponent(name, components[name]);
	    } else {
	      AFRAME.registerComponent(name, components[name]);
	    }
	  });
	})();


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Asset Lazy Load component for A-Frame.
	 */
	module.exports.component = {
	  schema: {
	    // type: {default: 'timeout', oneOf: ['timeout', 'chunk']},
	    delay: {default: 0, min: 0},
	    chunk: {min: 0},
	    src: {},
	    id: {}
	  },

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
	  init: function () {
	    /**
	     * Make sure Assets Exists
	     */

	    if (!assetsChecked) {
	      assetsChecked = true;
	      if(document.querySelector("a-assets") == null){
	        aScene = $("a-scene");
	        aAssets = document.createElement("a-assets");
	        aScene.prepend(aAssets);
	        aAssets = $("a-assets");
	      }
	    }

	    // Gather Up Lazy Loads
	    if (!lazyLoadInitiated) {
	      lazyLoadInitiated = true;
	      initLazyLoading($('[lazy-load]'));
	    }

	  },

	  /**
	   * Called when component is attached and when component data changes.
	   * Generally modifies the entity based on the data.
	   */
	  update: function (oldData) {

	  },

	  /**
	   * Called when a component is removed (e.g., via removeAttribute).
	   * Generally undoes all modifications to the entity.
	   */
	  remove: function () {

	  }
	};

	// Checking existance of <a-assets>
	var assetsChecked = false;
	var aScene;
	var aAssets;

	// Checking to see if lazy-load initialized
	var lazyLoadInitiated = false;

	// Where we're putting all our assets in load order
	var lazyLoadManifest = [];


	var initLazyLoading = function(elements){
	  console.log("~~~Setting Up Lazy Loading~~~");
	  // Reset Stack for jQuery
	  setTimeout(function(){

	    // Build Load Order
	    elements.each(function(i){
	      var el = $(elements[i]);
	      // If has delay, and not concerned with chunk, set off immediately
	      if(el.attr("lazy-load").chunk == undefined && el.attr("lazy-load").delay != undefined){
	        dispatchLoad(el);
	      }
	      // If it has a chunk, add to manifest
	      if(el.attr("lazy-load").chunk != undefined){
	        var pos = el.attr("lazy-load").chunk;
	        // If nothing exists at that position, create new set of arrays
	        if(lazyLoadManifest[pos] == undefined){
	          lazyLoadManifest[pos] = [[],[]];
	        }
	        // Prioritize if has src
	        if(el.attr("lazy-load").src){
	          // 0 array contains only uploads with srcs
	          lazyLoadManifest[pos][0].push(el);
	        } else {
	          // 1 array contains anything with only an id
	          lazyLoadManifest[pos][1].push(el);
	        }
	      }
	    });

	    // Start Loading! Set in motion recurssion!!!
	    console.log("~~~Lazy Loading~~~");
	    console.log(lazyLoadManifest);
	    runLazyLoad(0,0,lazyLoadManifest.length);
	  });
	}

	var runLazyLoad = function(currentChunk, currentSet, lastChunk){
	  var thisChunk = currentChunk;
	  var thisSet = currentSet;

	  // Stop if we're past the last chunk
	  if(thisChunk > lastChunk){
	    return;
	  }
	  // Check to see if we're in an undefined chunk
	  if (lazyLoadManifest[thisChunk] == undefined){
	    runLazyLoad((thisChunk+1), 0, lastChunk);
	    return;
	  }
	  // Set Remaining Variables
	  var assetsToHandle = lazyLoadManifest[thisChunk][thisSet].length;
	  var assetsHandled = 0;

	  // Check to see if we're in an empty chunk
	  if (lazyLoadManifest[thisChunk][thisSet].length == 0){
	    if (thisSet == 0){
	      runLazyLoad(thisChunk, 1, lastChunk);
	      return;
	    } else {
	      runLazyLoad((thisChunk+1), 0, lastChunk);
	      return;
	    }
	  } else {
	    // Run this chunk if not undefined
	    for (var asset in lazyLoadManifest[thisChunk][thisSet]){
	      // For each asset in our SRC set
	      if (thisSet == 0){
	        dispatchLoad(lazyLoadManifest[thisChunk][thisSet][asset], function(){
	          assetsHandled++;
	          if(assetsHandled == assetsToHandle){
	            runLazyLoad(thisChunk, 1, lastChunk);
	          }
	        });
	      } else {
	        // Set our material srcs, and increment. 
	        lazyLoadManifest[thisChunk][thisSet][asset].attr("material","src:#" + lazyLoadManifest[currentChunk][currentSet][asset].attr("lazy-load").id);
	        assetsHandled++;
	        if(assetsHandled == assetsToHandle){
	          runLazyLoad((thisChunk+1), 0, lastChunk);
	        }
	      }
	    }
	  }

	}

	var dispatchLoad = function(el,cb){
	  setTimeout(function(){
	    // If the asset has a SRC
	    if(el.attr("lazy-load").src){
	      // Add to a-assets
	      aAssets.prepend('<img id=' + el.attr("lazy-load").id + ' src="' + el.attr("lazy-load").src + '">');
	      // Wait till loaded...
	      $('#'+ el.attr("lazy-load").id).on('load', function(){
	        // To update entity's material property
	        $(el).attr("material","src:#" + el.attr("lazy-load").id);
	        // Run callback
	        if (cb) return cb();
	      });
	    } else {
	      // Otherwise, just upadte tag
	      $(el).attr("material","src:#" + el.attr("lazy-load").id);
	      if (cb) return cb();
	    }
	  }, el.attr("lazy-load").delay || 0);
	}

/***/ }
/******/ ]);