import * as THREE from 'three';

const material = (mesh = false, color = 0x00ff00) => new THREE.MeshBasicMaterial( { color: color, wireframe: mesh } );

export default material; 