## aframe-asset-lazy-load-component

An a-entity component to assign asset loading order and delays

### Usage

Install (or directly include the [browser files](dist)).

```bash
npm install --save aframe-asset-lazy-load
```

Register (Additionally requires jquery)

```js
$ = require("jquery");
require('aframe');
var layout = require('aframe-layout').Component;
AFRAME.registerComponent('layout', layout);
```

Use with delays or chunks.

```html
  <a-entity
    lazy-load="delay: 1000; src:../background.png; id: til-death"
    geometry="primitive: sphere;
              radius: 200;"
    ></a-entity>
  <a-entity
    lazy-load="chunk: 0; src:../background2.png; id: til-death"
    geometry="primitive: sphere;
              radius: 200;"
    ></a-entity>
  <a-entity
    lazy-load="chunk: 1; src:../background3.png; id: til-death"
    geometry="primitive: sphere;
              radius: 200;"
    ></a-entity>    
```

Chunking is simply a way to block asset loading. For example, Let's say you have a game with a cinematic opening. Currently, you have to load all your assets at the start, meaning textures for the game are taking up bandwith you might want to use to get a user in the door. With chunking, you can set what is to be loaded immediately, via chunk 1, and what is to then be loaded upon those being completed, via chunk 2. This lets you spread out asset loading to make the immediate experience smoother.

### Attributes

| Attribute | Description                                                                               | Default Value |
| --------- | -----------                                                                               | ------------- |
| delay     | Milliseconds waited until an image is appened to a-assets.                                | 0             |
| chunk     | Slot an asset is placed in for loading. Multiple assets can be assigned to the same chunk. Over-rides delays |               |
| src       | Path to the image being loaded                                                            |               |
| id        | The ID being associated with the entity's material property and element in a-assets.      |               |