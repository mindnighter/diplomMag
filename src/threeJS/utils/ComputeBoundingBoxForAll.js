import * as THREE from 'three';
import text from './text';

export const BoundingForAll = {
    min: {
      x: 0,
      y: 0,
      z: 0
    },
    max: {
      x: 0,
      y: 0,
      z: 0
    }
  }

const Compute = (boundingNumber, figure, rotate) =>{
  let MinX; let MaxX; let MinY; let MaxY; let MinZ; let MaxZ;
  if(rotate){
    MinX = boundingNumber.min.y+figure.position.x;
    MaxX = boundingNumber.max.y+figure.position.x;
    MinY = boundingNumber.min.x+figure.position.y;
    MaxY = boundingNumber.max.x+figure.position.y;
    MinZ = boundingNumber.min.y+figure.position.z -10;
    MaxZ = boundingNumber.max.y+figure.position.z +10;
  } else {
        MinX = boundingNumber.min.x+figure.position.x;
        MaxX = boundingNumber.max.x+figure.position.x;
        MinY = boundingNumber.min.y+figure.position.y;
        MaxY = boundingNumber.max.y+figure.position.y;
        MinZ = boundingNumber.min.z+figure.position.z;
        MaxZ = boundingNumber.max.z+figure.position.z;
  }
    
    if(MinX < BoundingForAll.min.x){BoundingForAll.min.x = MinX}
    if(MinY < BoundingForAll.min.y){BoundingForAll.min.y = MinY}
    if(MinZ < BoundingForAll.min.z){BoundingForAll.min.z = MinZ}

    if(MaxX > BoundingForAll.max.x){BoundingForAll.max.x = MaxX}
    if(MaxY > BoundingForAll.max.y){BoundingForAll.max.y = MaxY}
    if(MaxZ > BoundingForAll.max.z){BoundingForAll.max.z = MaxZ}
}

const ComputeBoundingBoxForAll = (figure, i, n, scene, show, last = true, rotate) => {
    const boundingBox = new THREE.BoxHelper(figure, 0xff0000);
    boundingBox.update();
    const boundingNumber = figure.geometry.boundingBox.clone();
    Compute(boundingNumber, figure, rotate);
    const x = Math.abs(BoundingForAll.max.x) + Math.abs(BoundingForAll.min.x);
    const y = Math.abs(BoundingForAll.max.y) + Math.abs(BoundingForAll.min.y);
    const z = Math.abs(BoundingForAll.max.z) + Math.abs(BoundingForAll.min.z);
    const geometry = new THREE.BoxGeometry(x, y, z)
    var material = new THREE.MeshLambertMaterial({color: 0x0000ff, transparent: true, opacity: 0.1});
    const box = new THREE.Mesh(geometry, material);
    box.position.x = (BoundingForAll.min.x+BoundingForAll.max.x)/2;
    box.position.y = (BoundingForAll.min.y+BoundingForAll.max.y)/2;
    box.position.z = (BoundingForAll.min.z+BoundingForAll.max.z)/2;
    //scene.add(box)
    const boundingBox2 = new THREE.BoxHelper(box, 0xff0000);
    boundingBox.update();
    if(++i === n && last && show){
        scene.add(boundingBox2);
    }
    text(BoundingForAll, scene, {position:{x:0,y:box.position.y,z:-box.position.z}}, 'All node', ++i === n && last && show);
}

export default ComputeBoundingBoxForAll;