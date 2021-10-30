import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import * as dat from 'dat.gui';

import build from './utils/build';
import clone from './utils/clone';
import download from './utils/download';
import updateDatDropdown from './utils/updateDropdown';

import {textArr} from './utils/text';
import {BoundingForAll} from './utils/ComputeBoundingBoxForAll';

export const remove = (obj, all = false) => {
  for (var variableKey in obj){
    if (obj.hasOwnProperty(variableKey)){
        delete obj[variableKey];
    }
  }
  if(all){
    obj.min = {x: 0,
      y: 0,
      z: 0}
    obj.max = {x: 0,
      y: 0,
      z: 0}
  }
}

const gui = new dat.GUI();

let data;
let nameList;
let BoundingBox = false;
let BoundingBoxAll = false;
let name;
let wireframe = false;
let iter;
let hide = true;

let wireframeController; let detailController; let dropdownController; let Bounding_Box_AllController;
let Bounding_BoxController; let hideController; let nameController;

const ControllPanel = function () {
  this.wireframe = false;
  this['Bounding Box All'] = false;
  this.Bounding_Box = false;
  this.node = '';
  this.detail = '';
  this.hide = false;
  this['name of copy'] = '';
  this.COPY = () => {
    nameList = clone(this['name of copy'], data, nameList);
    updateDatDropdown(dropdownController , nameList);
  };
  this['generate report'] = () => {
    download(`report ${name}`, data)
  }
};

const controlled = new ControllPanel();

const draw = (nodes, controllers = true) => {
if(controllers) {
  nameList = nodes.map((item) => item.name);
  name = nodes[0].name;
  data = nodes.filter((item) => item.name === name)[0].node;
  wireframeController = gui.add(controlled, 'wireframe');
  dropdownController = gui.add(controlled, 'node', nameList);
  detailController = gui.add(controlled, 'detail', data.map((item,i)=>i));
  Bounding_Box_AllController = gui.add(controlled, 'Bounding Box All')
  Bounding_BoxController = gui.add(controlled, 'Bounding_Box');
  hideController = gui.add(controlled, 'hide');
  nameController = gui.add(controlled, 'name of copy');
  gui.add(controlled, 'COPY');
  gui.add(controlled, 'generate report');
}

dropdownController.setValue(name);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  const root = document.getElementById('scene');
  if (root.firstElementChild) {
    root.removeChild(root.firstElementChild);
  }
  root.appendChild(renderer.domElement);

  const controls = new TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 6;
  controls.update();

  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(4500, 10000, 2500);
  light.target.position.set(0, 0, 0);
  scene.add(light);
  scene.add(light.target);

  let material = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    transparent: true, opacity: 1
  });
  material.side = THREE.DoubleSide;

  start();

  camera.position.z = 700;
  camera.position.y = -100;

  function animate () {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
  };

  animate();

  wireframeController.onChange(function () {
    this.wireframe = !this.wireframe;
    wireframe = this.wireframe;
    wireframe
      ? (material = new THREE.MeshBasicMaterial({
          color: 0x0000aa,
          wireframe: wireframe
        }))
      : (material = new THREE.MeshPhongMaterial({
          color: 0xaaaaaa
        }));
        material.side = THREE.DoubleSide;
    data = nodes.filter((item) => item.name === name)[0].node;
    start();
  });

  dropdownController.onChange(function (node) {
    name = node;
    data = nodes.filter((item) => item.name === name)[0].node;
    sessionStorage.setItem('index', nameList.indexOf(node));
    remove(textArr);
    remove(BoundingForAll, true);
    start(); 
  });

  detailController.onChange(function (i) {
    iter = i;
    start();
  });

  Bounding_Box_AllController.onChange(function () {
    this['Bounding Box All'] = !BoundingBoxAll;
    BoundingBoxAll = this['Bounding Box All'];
    start();
  });

  Bounding_BoxController.onChange(function () {
    this.Bounding_Box = !this.Bounding_Box;
    BoundingBox = this.Bounding_Box;
    start();
  });

  hideController.onChange(function () {
    this.hide = !hide;
    hide = this.hide;
    start();
  });

  nameController.onFinishChange(function (value) {
    this['name of copy'] = value;
  });

  function start () {
    build(data, scene, material, light, BoundingBox, BoundingBoxAll, +iter, hide);
    animate();
  }
};

export default draw;
