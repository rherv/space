import * as THREE from "three";
import { Input } from "../input";
import { Navigation } from "../ui/navigation";

interface Binds {
    [key: string]: { x: number; y: number, z: number };
}

export class PlayerShip {
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

    SAS: boolean;

    constructor() {
        this.inertiaTensor = new THREE.Vector3(1, 1, 1);
        this.angularVelocity = new THREE.Vector3(0, 0, 0);
        this.rotation_input = { x: 0.0, y: 0.0, z: 0.0 };
        this.rotationVector = new THREE.Vector3(0, 0, 0);
        this.angularMomentum = new THREE.Vector3();
        this.angularDamping = 0.20;

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

        this.SAS = false;

        this.controls = this.controls.bind(this)
        document.addEventListener("keydown", this.controls, false);
        document.addEventListener("keyup", this.controls, false);
    }

    controls() {
        this.rotationVector.x = ( - Input.getKey("w") * 0.02 + Input.getKey("s") * 0.02 );
        this.rotationVector.y = ( - Input.getKey("q") * 0.02 + Input.getKey("e") * 0.02 );
        this.rotationVector.z = ( - Input.getKey("d") * 0.02 + Input.getKey("a") * 0.02 );

        if(Input.getKey("t")) {
            this.SAS = !this.SAS;
            //this.physicsBody.setSAS(this.SAS)
        }
    }

    tick(dt: number) {
        this.angularMomentum.add(
            this.rotationVector,
        )

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
    }
}