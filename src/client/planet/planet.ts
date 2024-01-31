import * as THREE from "three";
import { SphereGeometry } from "three";
//import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

export class Planet {
    geometry: SphereGeometry
    material: THREE.MeshLambertMaterial
    //mass: number
    planet: THREE.Mesh

    constructor() {
        this.geometry = new THREE.SphereGeometry( 
            100, 
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

        this.planet.position.setX(200)

        this.planet.layers.enableAll();

        const earthDiv = document.createElement( 'div' );
        earthDiv.className = 'label';
        earthDiv.textContent = 'Earth';
        earthDiv.style.marginTop = '-1em';
        const earthLabel = new CSS2DObject( earthDiv );
        earthLabel.position.set( 0, 1, 0 );
        this.planet.add( earthLabel );
        earthLabel.layers.set( 0 );

        const earthMassDiv = document.createElement( 'div' );
        earthMassDiv.className = 'label';
        earthMassDiv.textContent = '5.97237e24 kg';
        earthMassDiv.style.marginTop = '-1em';
        const earthMassLabel = new CSS2DObject( earthMassDiv );
        earthMassLabel.position.set( 0, - 2 * 1, 0 );
        this.planet.add( earthMassLabel );
        earthMassLabel.layers.set( 1 );

        /*
        let renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        */

        let labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize( window.innerWidth, window.innerHeight );
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        document.body.appendChild( labelRenderer.domElement );
    }
}