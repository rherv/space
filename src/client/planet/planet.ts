import * as THREE from "three";
import { SphereGeometry } from "three";
//import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

export class Planet {
    geometry: SphereGeometry
    material: THREE.MeshLambertMaterial
    //mass: number
    planet: THREE.Mesh
    diameter: number;

    constructor(diameter: number) {
        this.diameter = diameter;

        this.geometry = new THREE.SphereGeometry( 
            this.diameter, 
            32, 
            16
        ); 

        this.material = new THREE.MeshLambertMaterial({
            color: 0x414141,
            //wireframe: true,
        })
        this.material.flatShading = true

        this.planet = new THREE.Mesh(this.geometry, this.material);
        this.planet.castShadow = true; //default is false
        this.planet.receiveShadow = false; //default

        //this.planet.layers.enableAll();
        /*
        let renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        */
    }
}