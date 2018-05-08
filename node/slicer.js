var THREE = require('three');
global.THREE = THREE;
var slice = require('../slice');

module.exports = {

	slice : function (options) {
		options.geometry.computeBoundingBox();
		var boundingBox = options.geometry.boundingBox;

		var boundingBoxPoints = [
			[boundingBox.min.x, boundingBox.min.z],
			[boundingBox.max.x, boundingBox.max.z]
		];

		var SLICES = options.level;
		var squares = [];
		for (var i = 0; i < SLICES; i++) {
			for (var j = 0; j < SLICES; j++) {

				var partSizeX = Math.abs(boundingBox.min.x - boundingBox.max.x) / SLICES;
				var partSizeZ = Math.abs(boundingBox.min.z - boundingBox.max.z) / SLICES;

				var startingPoint = {
					x: boundingBox.min.x + partSizeX * i,
					z: boundingBox.min.z + partSizeZ * j
				};

				var square = [
					new THREE.Vector3(
						startingPoint.x,
						0,
						startingPoint.z
					)
					,
					new THREE.Vector3(
						startingPoint.x + partSizeX,
						0,
						startingPoint.z
					)
					,
					new THREE.Vector3(
						startingPoint.x + partSizeX,
						0,
						startingPoint.z + partSizeZ
					)
					,
					new THREE.Vector3(
						startingPoint.x,
						0,
						startingPoint.z + partSizeZ
					)
				];

				squares.push(square);
			}
		}

		var geometries = [];
		squares.forEach(function (square) {
			var geometry = options.geometry.clone();	
			for (var i = 0; i < 4; i++) {

				if (square[i+1]) {
					var ray = new THREE.Ray(square[i]);
					ray.lookAt(square[i+1]);
				} else {
					var ray = new THREE.Ray(square[i]);
					ray.lookAt(square[0]);
				}			
				var plane = new THREE.Plane();
				plane.setFromNormalAndCoplanarPoint(ray.direction, square[i]);

				var geometry = sliceGeometry(geometry, plane);
				var material = new THREE.MeshBasicMaterial({ wireframe: true });
			}

			geometries.push(geometry);
		});

		return geometries;
	}
}