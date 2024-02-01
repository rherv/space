import { Bullet } from "./bullet";

export class ProjectileManager {
    bullets: Bullet[];

    constructor() {
        this.bullets = [];
    }

    newBullet(position: THREE.Vector3, quarternion: THREE.Quaternion, velocity: THREE.Vector3) {
        this.bullets.push(new Bullet(position, quarternion, velocity));
    }

    tick(dt: number) {
        this.bullets.forEach((bullet, index) => {
            this.bullets[index].tick(dt);
            //bullet.tick(dt);
        });
    }
}