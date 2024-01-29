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

    //applyTorque(torque: THREE.Vector3) {
    //    const rotatedTorque = torque.clone().applyEuler(this.orientation);
    //    this.angularMomentum.add(rotatedTorque);
    //}

    setSAS(enabled: boolean) {
        this.SAS = enabled;
    }

    pitch_up() {
        let up: THREE.Vector3 = new THREE.Vector3(0, 0, 0.1);
        const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

        console.log("BEFORE TRANSFORM: X: " + up.x + " Y: " + up.y + " Z: " + up.z);
        let upa: THREE.Vector3 = up.applyQuaternion(quaternion);
        upa.x = Math.abs(upa.x) < 0.01 ? 0 : upa.x;
        upa.y = Math.abs(upa.y) < 0.01 ? 0 : upa.y;
        upa.z = Math.abs(upa.z) < 0.01 ? 0 : upa.z;
        console.log("AFTER TRANSFORM: X: " + upa.x + " Y: " + upa.y + " Z: " + upa.z);

        //let vecRot: THREE.Vector3 = this.eulerToVector(this.orientation);
        //console.log("ORIENTATION: X: " + vecRot.x + " Y: " + vecRot.y + " Z: " + vecRot.z);
        this.angularMomentum.add(up);
    }

    update(dt: number) {
        this.angularVelocity.x += (this.angularMomentum.x / this.inertiaTensor.x) * dt;
        this.angularVelocity.y += (this.angularMomentum.y / this.inertiaTensor.y) * dt;
        this.angularVelocity.z += (this.angularMomentum.z / this.inertiaTensor.z) * dt;
        let vecRot: THREE.Vector3 = this.eulerToVector(this.orientation);
        console.log("ORIENTATION: X: " + vecRot.x + " Y: " + vecRot.y + " Z: " + vecRot.z);

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

    eulerToVector(euler: THREE.Euler) {
        const { x, y, z } = euler;
    
        // Calculate the components of the unit vector
        const xComponent = Math.cos(y) * Math.cos(x);
        const yComponent = Math.sin(y) * Math.cos(x);
        const zComponent = Math.sin(x);
    
        // Create and return the vector
        return new THREE.Vector3(xComponent, yComponent, zComponent).normalize();
    }
}