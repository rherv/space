import * as THREE from "three";

export namespace Navigation {
    const console_ui = document.createElement('div');
    console_ui.style.position = 'absolute';
    console_ui.style.top = '10px';
    console_ui.style.left = '10px';
    console_ui.style.backgroundColor = 'black'; // Set background color to black
    console_ui.style.border = '2px solid green'; // Set border to 2px solid green
    console_ui.style.color = 'white';
    console_ui.style.padding = "10px";
    console_ui.innerHTML = 'x: unknown<br>y: unknown<br>z: unknown<br>';

    export function render() {
        document.body.appendChild(console_ui);
    }

    export function update(matrix: THREE.Matrix4, SAS: boolean) {
         // Create a new Quaternion to store the rotation
        var quaternion = new THREE.Quaternion();

        // Extract the rotation from the Matrix4
        quaternion.setFromRotationMatrix(matrix);

        // Create a new Euler to represent the rotation in Euler angles
        var euler = new THREE.Euler(0, 0, 0, "XYZ");
    
        euler.setFromQuaternion(quaternion);

        console_ui.innerHTML = 
            'x: ' + THREE.MathUtils.radToDeg(euler.x).toFixed(2) + '°<br>' +
            'y: ' + THREE.MathUtils.radToDeg(euler.y).toFixed(2) + '°<br>' +
            'z: ' + THREE.MathUtils.radToDeg(euler.z).toFixed(2) + '°<br>' +
            'SAS: ' + SAS
    }
}