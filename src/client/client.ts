import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PlayerShip } from './ship/player_ship'
import { Navigation } from './ui/navigation'

/* --- SCENE --- */
const scene = new THREE.Scene()

/* --- CAMERA --- */
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 2
camera.rotateX(1);
//camera.rotateX(-90);
//camera.rotateY(180);
//camera.rotateZ()

/* --- RENDERER --- */
const renderer = new THREE.WebGLRenderer()
// shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 0, 2, 5 ); //default; light shining from top
light.castShadow = true; // default false
scene.add( light );

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

var ambientLight = new THREE.AmbientLight(0xAA4040); // Soft white light
scene.add(ambientLight);

//const controls = new OrbitControls(camera, renderer.domElement)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const loader = new THREE.CubeTextureLoader();

const texture = loader.load([
    'starmap.jpg',
    'starmap.jpg',
    'starmap.jpg',
    'starmap.jpg',
    'starmap.jpg',
    'starmap.jpg',
]);

scene.background = texture;

THREE.CubeReflectionMapping  // NOTE Bend "outwards"

const playerShip = new PlayerShip();
scene.add(playerShip.command_module);
playerShip.command_module.add(camera);

Navigation.render();


var clock = new THREE.Clock();
var speed = 16; // units a second


function animate() {
    requestAnimationFrame(animate)

    //cube.rotation.x += 0.01
    //cube.rotation.y += 0.01
    const dt = clock.getDelta();
    playerShip.tick(dt);

    //controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}
animate()
