import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import * as dat from 'dat.gui';

import build from './utils/build';
import clone from './utils/clone';
import updateDatDropdown from './utils/updateDropdown';

const gui = new dat.GUI();

let data;
let nameList;
let dropdownController;

const ControllPanel = function () {
  this.wireframe = false;
  this.node = '';
  this['name for clone'] = '';
  this.ADD = () => {
    nameList = clone(this['name for clone'], data, nameList);
    updateDatDropdown(dropdownController , nameList);
  };
};

let name;
let wireframe = false;

const controlled = new ControllPanel();
const wireframeController = gui.add(controlled, 'wireframe');

const draw = (nodes) => {
  nameList = nodes.map((item) => item.name);
  dropdownController = gui.add(controlled, 'node', nameList);
  name = nodes[0].name;
  dropdownController.setValue(name);
  data = nodes.filter((item) => item.name === name)[0].node;

  gui.add(controlled, 'name for clone').onFinishChange(function (value) {
    this['name for clone'] = value;
  });
  gui.add(controlled, 'ADD');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  const root = document.getElementById('root');
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
  light.position.set(45, 100, 25);
  light.target.position.set(0, 0, 0);
  scene.add(light);
  scene.add(light.target);

  let material = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa
  });

  build(data, scene, material, light);

  camera.position.z = 15;

  const animate = function () {
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
    data = nodes.filter((item) => item.name === name)[0].node;
    build(data, scene, material, light);
    animate();
  });

  dropdownController.onChange(function (node) {
    name = node;
    data = nodes.filter((item) => item.name === name)[0].node;
    build(data, scene, material, light);
    animate();
  });
};

export default draw;
