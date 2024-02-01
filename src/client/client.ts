import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PlayerShip } from './ship/player_ship'
import { Navigation } from './ui/navigation'
import { Planet } from './planet/planet'
import { App } from './app'

App.init()

/* --- Planet --- */
const planet = new Planet(1000);
planet.planet.position.setX(2000)
App.scene.add(planet.planet);

/* -- Player Ship --- */
const playerShip = new PlayerShip();
App.scene.add(playerShip.command_module);
//playerShip.command_module.add(App.camera);
playerShip.setPlanet(planet);
App.register(playerShip.tick.bind(playerShip));

App.camera.position.set( 0, -6, 5 );
App.camera.lookAt( 0, 20, 5 );
playerShip.command_module.add(App.camera);
App.start();

Navigation.render();