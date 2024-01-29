import * as THREE from "three";
import { Input } from "../input";
import { PhysicsRotationBody } from "../physics/rotation_body"
import { Navigation } from "../ui/navigation";

interface Binds {
    [key: string]: { x: number; y: number, z: number };
}

export class PlayerShip {
    rotation_input;
    geometry: THREE.CylinderGeometry;
    material: THREE.MeshLambertMaterial;
    command_module: THREE.Mesh;
    physicsBody: PhysicsRotationBody;

    SAS: boolean;

    constructor() {
        this.rotation_input = { x: 0.0, y: 0.0, z: 0.0 };

        this.geometry = new THREE.CylinderGeometry( 
            0.5, // radius top
            2, // radius bottom
            3, // height
            5  // radial segments
        ); 

        this.material = new THREE.MeshLambertMaterial({
            color: 0x414141,
            //wireframe: true,
        })
        this.material.flatShading = true

        this.command_module = new THREE.Mesh(this.geometry, this.material);
        this.command_module.castShadow = true; //default is false
        this.command_module.receiveShadow = false; //default

        this.SAS = false;

        this.physicsBody = new PhysicsRotationBody(1, new THREE.Vector3(1, 1, 1));

        this.controls = this.controls.bind(this)
        document.addEventListener("keydown", this.controls, false);
        document.addEventListener("keyup", this.controls, false);
    }

    controls() {
        this.rotation_input = {
            x: 0.0,
            y: 0.0,
            z: 0.0,
        }

        const binds: Binds = {
            "w" : { x: -0.02,   y: 0,       z: 0     },
            "a" : { x: 0,       y: 0,       z: -0.02 },
            "s" : { x: 0.02,    y: 0,       z: 0     },
            "d" : { x: 0,       y: 0,       z: 0.02  },
            "q" : { x: 0,       y: 0.02,    z: 0     },
            "e" : { x: 0,       y: -0.02,   z: 0     },
        };

        for (const key in binds) {
            if(Input.getKey(key)) {
                this.rotation_input.x += binds[key].x;
                this.rotation_input.y += binds[key].y;
                this.rotation_input.z += binds[key].z;
            }
        }

        if(Input.getKey("t")) {
            this.SAS = !this.SAS;
            this.physicsBody.setSAS(this.SAS)
        }

        /*
        const magnitude = Math.sqrt(Math.pow(this.rotation_input.x,2) + Math.pow(this.rotation_input.z,2));

        if (magnitude !== 0) {
            const scaleFactor = 0.1 / magnitude;
            this.rotation_input.x /= scaleFactor;
            this.rotation_input.z /= scaleFactor;
        }
        */
    }

    tick(dt: number) {
        this.physicsBody.applyTorque(
            new THREE.Vector3(this.rotation_input.x, this.rotation_input.y, this.rotation_input.z)
        );

        this.physicsBody.update(dt);

        const rotationMatrix = this.physicsBody.getRotationMatrix();
        this.command_module.setRotationFromMatrix(rotationMatrix);
        
        Navigation.update(rotationMatrix, this.SAS);

        //this.command_module.rotateX(this.rotation_input.x);
        //this.command_module.rotateZ(this.rotation_input.y);

        //this.rotation_input.x *= 0.95;
        //this.rotation_input.y *= 0.95;
    }
}