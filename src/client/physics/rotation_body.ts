import * as THREE from "three";

export class PhysicsRotationBody {
    mass: number;
    inertiaTensor: THREE.Vector3;
    angularVelocity: THREE.Vector3;
    orientation: THREE.Euler;
    angularMomentum: THREE.Vector3;
    angularDamping: number;
    SAS: boolean;

    constructor(mass: number, inertiaTensor: THREE.Vector3) {
        this.mass = mass;
        this.inertiaTensor = inertiaTensor;
        this.angularVelocity = new THREE.Vector3(0, 0, 0);
        this.orientation = new THREE.Euler(0, 0, 0, 'XYZ');
        this.angularMomentum = new THREE.Vector3(0, 0, 0);
        this.angularDamping = 0.20;
        this.SAS = false;
    }

    applyTorque(torque: THREE.Vector3) {
        const rotatedTorque = torque.clone().applyEuler(this.orientation);
        this.angularMomentum.add(rotatedTorque);
    }

    setSAS(enabled: boolean) {
        this.SAS = enabled;
    }

    update(dt: number) {
        this.angularVelocity.x += (this.angularMomentum.x / this.inertiaTensor.x) * dt;
        this.angularVelocity.y += (this.angularMomentum.y / this.inertiaTensor.y) * dt;
        this.angularVelocity.z += (this.angularMomentum.z / this.inertiaTensor.z) * dt;

        console.log("velocity: " + this.angularVelocity.z);
        console.log("momentum: " + this.angularMomentum.z);
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

        this.orientation.x += this.angularVelocity.x * dt;
        this.orientation.y += this.angularVelocity.y * dt;
        this.orientation.z += this.angularVelocity.z * dt;
    }

    getRotationMatrix() {
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationFromEuler(this.orientation);
        return rotationMatrix;
    }
}