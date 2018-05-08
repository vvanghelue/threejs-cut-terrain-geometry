var slicer = require('./slicer');
var fs = require('fs');

// console.log(THREE);
// console.log(sliceGeometry);



fs.readFile('./model.json', function (err, data) {
  if (err) {
    throw err; 
  }
  var mesh = new THREE.ObjectLoader().parse(
  	JSON.parse(
  		data.toString()
  	)
  );
  var geometry = new THREE.Geometry().fromBufferGeometry(mesh.geometry)
  var geometries = slicer.slice({
      geometry: geometry,
      level: 4
  });

  // console.log(geometries);

  // geometries.forEach(function (geometry, k) {
  //   fs.writeFile(`${k}.json`, JSON.stringify(geometry.toJSON()), function(err) {
  //     if(err) {
  //       return console.log(err);
  //     }
  //   });
  // });

  var geometryFull = new THREE.Object3D();
  geometryFull.name = 'terrain-collision';

  var material = new THREE.MeshLambertMaterial();

  geometries.forEach(function (geometry, k) {
    geometryFull.add(
      new THREE.Mesh(
        new THREE.BufferGeometry().fromGeometry(geometry), 
        material
      )
    );
  });
  fs.writeFile(`group.json`, JSON.stringify(geometryFull.toJSON()), function(err) {
    if(err) {
      return console.log(err);
    }
  });

});


// var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
// var geom = new THREE.BoxGeometry(1, 1, 1);
// geom = sliceGeometry(geom, plane);

// console.log(geom)