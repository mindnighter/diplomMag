import * as THREE from 'three';
import text from './text';
import geometries from '../geometries/index'

const figurePosition = (figure, x, y, z) => {
  x && (figure.position.x = x);
  y && (figure.position.y = y);
  z && (figure.position.z = z);
};

const build = (data, scene, material, light) => {
  while (scene.children.length) {
    scene.remove(scene.children[0]);
  }
  light.position.set(4500, 10000, 2500);
  light.target.position.set(0, 0, 0);
  scene.add(light);
  scene.add(light.target);
  data.map((item) => {
    const geometry = geometries[item.geometry](item);
    const figure = new THREE.Mesh(geometry, material);
    figurePosition(figure, item.position.x, item.position.y, item.position.z);
    scene.add(figure);
    const boundingBox = new THREE.BoxHelper(figure, 0xff0000);
    boundingBox.update();
    scene.add(boundingBox);
    const boundingNumber = figure.geometry.boundingBox.clone();
    text(boundingNumber, scene, item);
    return item;
  });
};

export default build;
