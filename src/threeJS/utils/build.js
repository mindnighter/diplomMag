import * as THREE from 'three';
import text from './text';
import geometries from '../geometries/index';
import ComputeBoundingBoxForAll from '../utils/ComputeBoundingBoxForAll'

export const figurePosition = (figure, x, y, z) => {
  x && (figure.position.x = x);
  y && (figure.position.y = y);
  z && (figure.position.z = z);
};

const build = (data, scene, material, light, BoundingBox,  BoundingBoxAll, iter, hide) => {
  while (scene.children.length) {
    scene.remove(scene.children[0]);
  }
  light.position.set(4500, 10000, 2500);
  light.target.position.set(0, 0, 0);
  scene.add(light);
  scene.add(light.target);
  data.map((item, i) => {
    if(item.geometry === 'PipesOnRound' || item.geometry === 'HorizontalPipesOnRound'){
      geometries[item.geometry](item, scene, material, BoundingBox, BoundingBoxAll, i, data.length, iter, hide)
    } else {
      const geometry = geometries[item.geometry](item);
      const figure = new THREE.Mesh(geometry, material);
      figurePosition(figure, item.position.x, item.position.y, item.position.z);
      if(iter === i){
        hide && scene.add(figure);
      } else {
        scene.add(figure);
      }
      ComputeBoundingBoxForAll(figure, i, data.length, scene, BoundingBoxAll); 
      const boundingBox = new THREE.BoxHelper(figure, 0xff0000);
        boundingBox.update();
        const boundingNumber = figure.geometry.boundingBox.clone();
        text(boundingNumber, scene, item, i, BoundingBox && iter === i);
      if(BoundingBox && iter === i){
        scene.add(boundingBox);
      }
    }
    
    return item;
  });
};

export default build;
