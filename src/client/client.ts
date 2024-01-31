import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PlayerShip } from './ship/player_ship'
import { Navigation } from './ui/navigation'
import { Planet } from './planet/planet'
import { App } from './app'

App.start()

/* --- Planet --- */
const planet = new Planet();
App.scene.add(planet.planet);

/* -- Player Ship --- */
const playerShip = new PlayerShip();
App.scene.add(playerShip.command_module);
playerShip.command_module.add(App.camera);

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    App.camera.aspect = window.innerWidth / window.innerHeight
    App.camera.updateProjectionMatrix()
    App.renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}


Navigation.render();

var clock = new THREE.Clock();
// var speed = 16; // units a second

function animate() {
    requestAnimationFrame(animate)

    const dt = clock.getDelta();
    playerShip.tick(dt);

    render()
}

function render() {
    App.renderer.render(App.scene, App.camera);
}

animate()
