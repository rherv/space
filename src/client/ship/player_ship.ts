import * as THREE from "three";
import { Input } from "../input";
import { Navigation } from "../ui/navigation";

interface Binds {
    [key: string]: { x: number; y: number, z: number };
}

export class PlayerShip {
    velocity: THREE.Vector3;
    moveVector: THREE.Vector3;
    angularVelocity: THREE.Vector3;
    inertiaTensor: THREE.Vector3;
    rotation_input;
    angularMomentum: THREE.Vector3;
    geometry: THREE.CylinderGeometry;
    material: THREE.MeshLambertMaterial;
    command_module: THREE.Mesh;
    tmpQuaternion: THREE.Quaternion;
    rotationVector: THREE.Vector3; // = new Vector3( 0, 0, 0 );
    angularDamping: number;
    rotationSpeed: number;
    blockPos: THREE.Vector3;

    SAS: boolean;

    constructor() {
        /* rotation physics */
        this.velocity = new THREE.Vector3(0,0,0);
        this.moveVector = new THREE.Vector3(0,0,0);
        this.inertiaTensor = new THREE.Vector3(1, 1, 1);
        this.angularVelocity = new THREE.Vector3(0, 0, 0);
        this.rotation_input = { x: 0.0, y: 0.0, z: 0.0 };
        this.rotationVector = new THREE.Vector3(0, 0, 0);
        this.angularMomentum = new THREE.Vector3();
        this.angularDamping = 0.20;
        this.rotationSpeed = 0.015;
        this.controls = this.controls.bind(this)

        /* 3d physics */
        this.blockPos = new THREE.Vector3(0,0,0);

        this.geometry = new THREE.CylinderGeometry( 
            0.5, // radius top
            2, // radius bottom
            3, // height
            16  // radial segments
        ); 

        this.material = new THREE.MeshLambertMaterial({
            color: 0x414141,
            //wireframe: true,
        })
        this.material.flatShading = true

        this.tmpQuaternion = new THREE.Quaternion();

        this.command_module = new THREE.Mesh(this.geometry, this.material);
        this.command_module.castShadow = true; //default is false
        this.command_module.receiveShadow = false; //default

        this.SAS = true;

        document.addEventListener("keydown", this.controls, false);
        document.addEventListener("keyup", this.controls, false);
    }

    controls() {
        this.rotationVector.x = ( - Input.getKey("w") * this.rotationSpeed + Input.getKey("s") * this.rotationSpeed );
        this.rotationVector.y = ( - Input.getKey("q") * this.rotationSpeed + Input.getKey("e") * this.rotationSpeed );
        this.rotationVector.z = ( - Input.getKey("d") * this.rotationSpeed + Input.getKey("a") * this.rotationSpeed );

        if(Input.getKey("t")) {
            this.SAS = !this.SAS;
        }

        this.moveVector = new THREE.Vector3(0, 0.01, 0)
            .applyQuaternion(this.command_module.quaternion)
            .multiplyScalar(Input.getKey("c"))
    }

    tick(dt: number) {
        this.angularMomentum.add(
            this.rotationVector,
        )

        this.velocity.x += this.moveVector.x;
        this.velocity.y += this.moveVector.y;
        this.velocity.z += this.moveVector.z;

        this.angularVelocity.x += (this.angularMomentum.x / this.inertiaTensor.x) * dt
        this.angularVelocity.y += (this.angularMomentum.y / this.inertiaTensor.y) * dt
        this.angularVelocity.z += (this.angularMomentum.z / this.inertiaTensor.z) * dt

        if(this.SAS) {
            this.angularMomentum.x *= Math.pow(this.angularDamping, dt);
            this.angularVelocity.x *= Math.pow(this.angularDamping, dt);
            this.angularMomentum.y *= Math.pow(this.angularDamping, dt);
            this.angularVelocity.y *= Math.pow(this.angularDamping, dt);
            this.angularMomentum.z *= Math.pow(this.angularDamping, dt);
            this.angularVelocity.z *= Math.pow(this.angularDamping, dt);
        } else {
            this.angularVelocity.multiplyScalar(0.95);
        }

        this.tmpQuaternion.set(
            this.angularVelocity.x * dt,
            this.angularVelocity.y * dt,
            this.angularVelocity.z * dt,
            1,
        ).normalize();

        this.command_module.quaternion.multiply(this.tmpQuaternion);

        Navigation.update(this.command_module.quaternion, this.SAS, this.command_module.position);

        console.log("X: " + this.velocity.x);
        console.log("Y: " + this.velocity.y);
        console.log("Z: " + this.velocity.z);

        this.command_module.position.x += this.velocity.x * dt;
        this.command_module.position.y += this.velocity.y * dt;
        this.command_module.position.z += this.velocity.z * dt;

        // navigator.
    }
}