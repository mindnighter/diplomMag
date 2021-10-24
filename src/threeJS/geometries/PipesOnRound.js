import * as THREE from 'three';
import Pipe from './Pipe';
import { figurePosition } from '../utils/build';
import text from '../utils/text';
import ComputeBoundingBoxForAll from '../utils/ComputeBoundingBoxForAll';

const PipesOnRound = (item, scene, material, BoundingBox, BoundingBoxAll, iter, n, dataIter, hide) => {
    let N = item.N; let X = 0; let Z = 0; let R = item.R;
  let angle; let rotation = (Math.PI/180) * item.rotation;
  for (let i = 0; i < N; i++) {
    angle = 2*Math.PI*i/N;
    const geometry = Pipe(item.parameters);
      const figure = new THREE.Mesh(geometry, material);
      const PX = R*Math.cos(angle)+X;
      const PZ = R*Math.sin(angle)+Z;
      figurePosition(figure, PX, item.parameters.position, PZ);
      if(rotation){
        figure.rotation.z = rotation;
        figure.rotation.y = angle*2;
      }
      if(iter === dataIter){
        hide && scene.add(figure);
      } else {
        scene.add(figure);
      }
      if(BoundingBoxAll){ComputeBoundingBoxForAll(figure, iter, n, scene, i === N-1, !!rotation);}
      if(BoundingBox  && dataIter === iter){
        const positions = {
          position: {
            x: PX,
            y: item.parameters.position,
            z: PZ
          }
        }
        const boundingBox = new THREE.BoxHelper(figure, 0xff0000);
        boundingBox.update();
        scene.add(boundingBox);
        const boundingNumber = figure.geometry.boundingBox.clone();
        text(boundingNumber, scene, positions);
      }
  }
 return item;
};

export default PipesOnRound;
