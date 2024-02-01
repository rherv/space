import * as THREE from "three";
import { Input } from "../input";
import { App } from "../app";
import { Planet } from "../planet/planet";
import { Gravitation } from "../physics/gravity";

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
    tmpQuaternion: THREE.Quaternion;
    rotationVector: THREE.Vector3; // = new Vector3( 0, 0, 0 );
    geometry: THREE.CylinderGeometry;
    angularDamping: number;
    rotationSpeed: number;
    shooting: boolean;
    delay: number;
    clock: THREE.Clock;
    timeSinceLastShot: number;
    planet: Planet | null;

    line: THREE.Line;

    material: THREE.MeshLambertMaterial;
    command_module: THREE.Mesh;

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
        this.shooting = false;
        this.delay = 0;
        this.clock = new THREE.Clock();
        this.timeSinceLastShot = 0;
        this.planet = null;

        this.geometry = new THREE.CylinderGeometry( 
            0.5, // radius top
            2, // radius bottom
            3, // height
            32  // radial segments
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

        const lineGeometry = new THREE.BufferGeometry()
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
        this.line = new THREE.Line(lineGeometry, lineMaterial);
        this.line.frustumCulled = false;
        App.scene.add(this.line);
    }

    controls() {
        this.rotationVector.x = ( - Input.getKey("w") * this.rotationSpeed + Input.getKey("s") * this.rotationSpeed );
        this.rotationVector.y = ( - Input.getKey("q") * this.rotationSpeed + Input.getKey("e") * this.rotationSpeed );
        this.rotationVector.z = ( - Input.getKey("d") * this.rotationSpeed + Input.getKey("a") * this.rotationSpeed );

        if(Input.getKey("t")) {
            this.SAS = !this.SAS;
        }

        this.moveVector = new THREE.Vector3(0, 0.1, 0)
            .applyQuaternion(this.command_module.quaternion)
            .multiplyScalar(Input.getKey("c"))

        this.shooting = Input.getKey("v") == 1;
    }

    setPlanet(planet: Planet) {
        this.planet = planet;
    }

    tick(dt: number) {
        this.timeSinceLastShot += dt;

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
            this.angularMomentum.multiplyScalar(Math.pow(this.angularDamping, dt));
            this.angularVelocity.multiplyScalar(Math.pow(this.angularDamping, dt));
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

        this.command_module.position.x += this.velocity.x * dt;
        this.command_module.position.y += this.velocity.y * dt;
        this.command_module.position.z += this.velocity.z * dt;

        if (this.planet != null) {
            this.velocity.add(Gravitation.calculateGravitation(this.planet, this.command_module.position));
            /*
            if (Gravitation.shouldGravitate(this.planet, this.command_module.position)) {
            }
            */
        }

        if (this.shooting && this.timeSinceLastShot > 0.13) {
            let bulletSpawn = this.command_module.position.clone()
                .add(new THREE.Vector3(0, 0, 0).applyQuaternion(this.command_module.quaternion))
            App.projectile_manager.newBullet(bulletSpawn, this.command_module.quaternion, this.velocity);
            this.timeSinceLastShot = 0;
        }

        let tempPos = this.command_module.position.clone();
        let tempVelocity = this.velocity.clone();
        let points: THREE.Vector3[] = [];

        for (let i = 0; i < 200; i++) {
            points.push(tempPos.clone());
            let timescale = 100;

            console.log(dt);
        
            if(this.planet != null) {
                //tempVelocity.addScaledVector(Gravitation.calculateGravitation(this.planet, tempPos), timescale * dt)

                let gravityAcceleration: THREE.Vector3 = Gravitation.calculateGravitation(this.planet, tempPos);

                tempVelocity.add(gravityAcceleration.multiplyScalar(timescale));
                
                tempPos.x += tempVelocity.x * timescale * 0.0165;
                tempPos.y += tempVelocity.y * timescale * 0.0165;
                tempPos.z += tempVelocity.z * timescale * 0.0165;
            }
        }

        this.line.geometry.setFromPoints(points);
    }
}