import * as THREE from "three";
import { Planet } from "../planet/planet";

export namespace Gravitation {
    const G = 6.67430e-11;

    export function shouldGravitate(planet: Planet, pos: THREE.Vector3): boolean {
        const direction = planet.planet.position.clone().sub(pos);
        const distance = direction.length();
        return distance > planet.diameter;
    }

    export function calculateGravitation(planet: Planet, pos: THREE.Vector3): THREE.Vector3 {
        const velocity: THREE.Vector3 = new THREE.Vector3()
        const direction = planet.planet.position.clone().sub(pos);
        const distance = direction.length();

        const forceMagnitude = (G * 20 * 2_000_000_000_000_000) / (distance * distance);

        const force = direction.normalize().multiplyScalar(forceMagnitude);
        const acceleration1 = force.clone().divideScalar(10);

        velocity.addScaledVector(acceleration1, 1);


        return velocity;
    }
}