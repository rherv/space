import * as THREE from "three";
import { App } from "../app";

export class Bullet {
    geometry: THREE.CylinderGeometry;
    material: THREE.MeshLambertMaterial;
    bullet: THREE.Mesh;
    velocity: THREE.Vector3;


    constructor(position: THREE.Vector3, quarternion: THREE.Quaternion, velocity: THREE.Vector3) {
        this.geometry = new THREE.CylinderGeometry( 
            1, // radius top
            0, // radius bottom
            30, // height
            8  // radial segments
        ); 

        this.material = new THREE.MeshLambertMaterial({
            //color: 0xFF9300, // Orange
            color: 0x33FF33, // Green
            //wireframe: true,
        })

        this.velocity = new THREE.Vector3(0, 400, 0)
            .applyQuaternion(quarternion)
            .add(velocity);

        console.log(this.velocity.x)
        console.log(this.velocity.y)
        console.log(this.velocity.z)

        this.material.flatShading = true

        this.bullet = new THREE.Mesh(this.geometry, this.material);

        this.bullet.position.x = position.x;
        this.bullet.position.y = position.y;
        this.bullet.position.z = position.z;

        App.scene.add(this.bullet);

        this.bullet.applyQuaternion(quarternion)
    }

    tick(dt: number) {
        this.bullet.position.x += this.velocity.x * dt;
        this.bullet.position.y += this.velocity.y * dt;
        this.bullet.position.z += this.velocity.z * dt;
    }
}