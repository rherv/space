import * as THREE from "three";

export namespace Navigation {
    /*
    const console_ui = document.createElement('div');
    console_ui.style.position = 'absolute';
    console_ui.style.top = '10px';
    console_ui.style.left = '10px';
    console_ui.style.backgroundColor = 'black'; // Set background color to black
    console_ui.style.border = '2px solid green'; // Set border to 2px solid green
    console_ui.style.color = 'white';
    console_ui.style.width = "210px"
    console_ui.style.padding = "10px";
    console_ui.innerHTML = 'x: unknown<br>y: unknown<br>z: unknown<br>';

    */
    export function render() {
        //document.body.appendChild(console_ui);
    }

    export function update(quaternion: THREE.Quaternion, SAS: boolean, pos: THREE.Vector3) {
        /*
        const euler = new THREE.Euler().setFromQuaternion(quaternion);

        let sasColor = (SAS) ? 'green' : 'red';
        let sasStatus = (SAS) ? ' enabled  ' : ' disabled '
        const sasMessage = 'SAS: <span style="background-color: ' + sasColor + ';">' + sasStatus + '</span></pre>'

        console_ui.innerHTML =
            '<pre>' +
            'x: ' + pos.x.toFixed(2) + '<br>y: ' + pos.y.toFixed(2) + '<br>z: ' + pos.z.toFixed(2) + '<br>' +
            sasMessage
            */
    }
}