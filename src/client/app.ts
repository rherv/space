import * as THREE from "three";
import { ProjectileManager } from "./projectile/projectile_manager";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export namespace App {
    export let scene: THREE.Scene;
    export let camera: THREE.PerspectiveCamera;
    //export let renderer: THREE.WebGLRenderer; // = new THREE.WebGLRenderer()
    export const renderer = new THREE.WebGLRenderer( { antialias: true } );
    export let projectile_manager: ProjectileManager;
    export var clock: THREE.Clock;
    export let cameraMode: number = 0;

    // Type definition for the tick function
    type TickFunction = (dt: number) => void;

    // Array to store registered functions
    const tickFunctions: TickFunction[] = [];


    export function init() {
        /* --- Projectile Manager --- */
        projectile_manager = new ProjectileManager();

        /* Scene */
        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 10000)

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

        /* Camera */

        /* Renderer */
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( 0x20252f );
        renderer.setPixelRatio( window.devicePixelRatio );
        document.body.appendChild( renderer.domElement );

        const light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( 0, 2, 5 ); //default; light shining from top
        light.castShadow = true; // default false
        scene.add( light );

        //Set up shadow properties for the light
        light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 500; // default

        var ambientLight = new THREE.AmbientLight(0xFFFFFF); // Soft white light
        scene.add(ambientLight);
        
       // controls.autoRotateSpeed = 10;
        clock = new THREE.Clock();
        window.addEventListener('resize', onWindowResize, false)
    }

    export function start() {
        animate();
    }

    function animate() {
        requestAnimationFrame(animate);

        const dt = clock.getDelta();
        //playerShip.tick(dt);
        projectile_manager.tick(dt);

        tickFunctions.forEach(func => func(dt));

        render();
    }

    function render() {
        renderer.render(App.scene, App.camera);
    }

    export function register(func: TickFunction) {
        if (typeof(func) === "function") {
            tickFunctions.push(func);
        } else {
            console.error("Invalid function to register.");
        }

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    }
}