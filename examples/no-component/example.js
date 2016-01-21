var assets = $("a-assets");
var sphere1 = $('.sphere-1');
var sphere1 = $('.sphere-2');

// Example Sphere 1
setTimeout(function(){
  // Append Img Element to Assets - Immediately starting load of content
  assets.prepend('<img id="example-sphere-1" src="../background.png">');
  // Upon Image Load being Done - Update Skybox Entity
  $('#example-sphere-1').on('load', function(){
    $('a-entity.sphere-1').attr("material","src: #example-sphere-1");
  });
});

// Example Sphere 2
setTimeout(function(){
  assets.prepend('<img id="example-sphere-2" src="../background2.jpg">');
  $('#example-sphere-2').on('load', function(){
    $('a-entity.sphere-2').attr("material","src: #example-sphere-2");
  });
}, 1550);