# NiftyRenderer/NiftyOS

### Why make this:
 - So i know excatly what is happening up until the browser
 - For fun, it is relaxing to make
 - Combine the best of every rendering tool I've used (BabylonJS, Unity, Vulkan, Opengl, ThreeJS, WebGL, Exokit)
 - Targetting only oculus quest for now (Chrome will never release webXR or add features I want)
 - For how much I hate browsers, since I am only one person targetting the browser makes the most sense, building/deploying to multiple platforms/appstores is just too much work and I'm not even sure they will allow what I want to do

### Coordinate system:
 - +y is up
 - +x is right
 - -z is forward
 - This mirrors threeJS/opengl defaults, will make gltf easier to import because it uses the same.
 - This is also the reason why an initial object.forward is (0,0,-1) which is weird but whatever
 - Texture coordinates have 0,0 as top left (Matching https://github.com/KhronosGroup/glTF/pull/692)

### Builds on top of lower level apis:
 - opengl
 - webgl
 - twgl
 - GPU Folder
 - composable Object folder
 - OS

### world/local matrix sync:
 - matrix are not atomatically synced for performance reasons
 - after setting pos, rot, scale computeLocalMatrix must be called to update the local matrix
 - computeWorldMatrix() will compute all parent matrix's then compute local matrix and then compute world matrix
 - when rendering the scene it is recommended to recurse the object tree calling computeWorldMatrix(false) from parents downward to avoid recomputing world matrix
 - cameras/lights should have their world matrix's computed first so their shader uniforms can be set right away

