// File:js/rainbowalga.js
/**
 * @author Tamas Gal / tgal@km3net.de
 */

var RBA = { REVISION: '1' };

if ( typeof define === 'function' && define.amd ) {
      define( 'rba', RBA );
} else if ( 'undefined' !== typeof exports &&
            'undefined' !== typeof module ) {
      module.exports = RBA;
}

RBA.log = function ( message ) {
    var consoleContainer = $( "#console" );
    var scrollTarget = consoleContainer[0].scrollHeight;

    consoleContainer.append( message + "\n" );
    consoleContainer.animate( { scrollTop: scrollTarget }, 500 );
};

var parameters;
var gui_left;
var gui_right;

parameters = {"color": "#ff0000", "speed": 0.01, "test": 234,
              "focalLength": 15}


gui_right = new dat.GUI({autoPlace: false});
gui_right.remember(parameters);
$('#gui_right').append($(gui_right.domElement));

var stats = new Stats();
stats.showPanel( 1 );
$("#stats").append( stats.dom );



var scene = new THREE.Scene();
var width = window.innerWidth;
var height = window.innerHeight - 60 - 50;
var camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 100000 );
camera.position.set(1000, 1000, 1000);
camera.up.set(0, 0, 1);



testParameter = gui_right.add(parameters, 'test', 0, 500).step(1).name('Test');

cubeSpeed = gui_right.add(parameters, 'speed', -0.1, 0.1).step(0.01).name('Speed');
cubeSpeed.onChange(function(value) {
	parameters.speed = value;
});
focalLengthSetter = gui_right.add(parameters, 'focalLength', 3, 80).step(1).name('Focal Length');
focalLengthSetter.onChange(function(value) {
	camera.setFocalLength(value);
});



var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(width, height);
renderer.setClearColor( 0xf5f5f5, 1);
$("#canvas").append( renderer.domElement );

var grid = new THREE.GridHelper(1000, 50, 0xa8baca, 0xdddddd)
grid.geometry.rotateX(Math.PI / 2);
scene.add(grid);

var cubeColor = gui_right.addColor( parameters, 'color' ).name('Color');
//cubeColor.onChange(function(value) {
//    cube.material.color.setHex( value.replace("#", "0x") );
//});

var ambient_light = new THREE.DirectionalLight(0x666666, 1);
ambient_light.position.set(0, 2000, 0);
scene.add(ambient_light);

var spotlight = new THREE.DirectionalLight(0xffffff, 1);
spotlight.position.set(100, 100, 50);
scene.add(spotlight);


controls = new THREE.OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', function() {
  var WIDTH = window.innerWidth - 15,
      HEIGHT = window.innerHeight - 60 - 50;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
});


function render() {
  stats.begin();
  requestAnimationFrame(render);
  spotlight.position.copy( camera.getWorldPosition() );
  spotlight.position.z -= 300;
  spotlight.position.x += 300;
  renderer.render(scene, camera);
  stats.end();
  controls.update();
}

render();
