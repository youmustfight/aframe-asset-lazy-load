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
    // See if a-assets exists
    if (!assetsChecked) {
      assetsChecked = true;
      if(document.querySelector("a-assets") == null){
        aScene = document.querySelector("a-scene");
        aAssets = document.createElement("a-assets");
        aScene.appendChild(aAssets);
        aAssets = document.querySelector("a-assets");
      }
    }

    // Gather Up Lazy Loads
    if (!lazyLoadInitiated) {
      lazyLoadInitiated = true;
      var entities = document.querySelectorAll('a-entity');
      var entitiesArray = Array.prototype.slice.call(entities);
      var lazyLoadEntities = entitiesArray.filter(function(el){
        if(el.hasAttribute('lazy-load')){
          return true;
        }
        return false;
      });
      initLazyLoading(lazyLoadEntities);
    }

  },
  update: function (oldData) { },
  remove: function () {}
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
  setTimeout(function(){
  // Build Load Order
    elements.forEach(function(el){
      var attributes = el.getAttribute("lazy-load");
      // If has delay, and not concerned with chunk, set off immediately
      if(attributes.chunk == undefined && attributes.delay != undefined){
        dispatchLoad(el);
      }
      // If it has a chunk, add to manifest
      if(attributes.chunk != undefined){
        var pos = attributes.chunk;
        // If nothing exists at that position, create new set of arrays
        if(lazyLoadManifest[pos] == undefined){
          lazyLoadManifest[pos] = [[],[]];
        }
        // Prioritize if has src
        if(attributes.src){
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
    console.log("Load Order:", lazyLoadManifest);
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
        lazyLoadManifest[thisChunk][thisSet][asset].setAttribute("material","src:#" + lazyLoadManifest[currentChunk][currentSet][asset].getAttribute("lazy-load").id);
        assetsHandled++;
        if(assetsHandled == assetsToHandle){
          runLazyLoad((thisChunk+1), 0, lastChunk);
        }
      }
    }
  }

}

var dispatchLoad = function(el,cb){
  var attributes = el.getAttribute("lazy-load");
  setTimeout(function(){
    // If the asset has a SRC
    if(attributes.src){
      // Add to a-assets
      var newAsset = document.createElement("img");
      newAsset.id = attributes.id;
      newAsset.src = attributes.src;
      aAssets.appendChild(newAsset);
      // Wait till loaded...
      newAsset.addEventListener('load', function(){
        // To update entity's material property
        el.setAttribute("material","src:#" + attributes.id);
        // Run callback
        if (cb) return cb();
      });
    } else {
      // Otherwise, just upadte tag
      el.setAttribute("material","src:#" + attributes.id);
      if (cb) return cb();
    }
  }, attributes.delay || 0);
}