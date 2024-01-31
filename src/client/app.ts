import * as THREE from "three";

export namespace App {
    export let scene: THREE.Scene;
    export let camera: THREE.PerspectiveCamera;
    export let renderer: THREE.WebGLRenderer; // = new THREE.WebGLRenderer()

    export function start() {
        /* Scene */
        scene = new THREE.Scene()
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
        camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000)
        camera.position.z = 2.2
        camera.position.y = -1.5
        camera.rotateX(1.4);

        /* Renderer */
        renderer = new THREE.WebGLRenderer();
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(renderer.domElement)

        const light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( 0, 2, 5 ); //default; light shining from top
        light.castShadow = true; // default false
        scene.add( light );


        //Set up shadow properties for the light
        light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 500; // default


        var ambientLight = new THREE.AmbientLight(0xAA4040); // Soft white light
        scene.add(ambientLight);
    }
}