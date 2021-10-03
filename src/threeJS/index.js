import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import * as dat from 'dat.gui';

import geometries from './geometries/index';

const figurePosition = (figure, x, y, z) => {
   x && (figure.position.x = x);
   y && (figure.position.y = y);
   z && (figure.position.z = z);
}

const gui = new dat.GUI();
var ControllPanel = function() {
    this.mesh = false;
    this.range = 45;
  };

var controlled = new ControllPanel();
var controllerDisplay = gui.add(controlled, 'mesh');
let wireframe = false;

const draw = (data) => {
    console.log(data);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    const root =  document.getElementById('root');
    if (root.firstElementChild){
        root.removeChild( root.firstElementChild );
    }
    root.appendChild( renderer.domElement );

    const controls = new TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 6;
    controls.update();

    let material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: wireframe } );

    data.map((item)=>{
        const geometry = geometries[item.geometry](item);
        const figure = new THREE.Mesh( geometry, material );
        figurePosition(figure, item.position.x, item.position.y, item.position.z)
        scene.add( figure );
    })

    camera.position.z = 5;
    

    const animate = function () {
        requestAnimationFrame( animate );

        controls.update();

        renderer.render( scene, camera );
    };

    controllerDisplay.onChange(function(){
        this.mesh = !this.mesh; 
        wireframe = this.mesh;
        material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: wireframe } );
        while(scene.children.length){ 
            scene.remove(scene.children[0]); 
        }
        data.map((item)=>{
            const geometry = geometries[item.geometry](item);
            const figure = new THREE.Mesh( geometry, material );
            figurePosition(figure, item.position.x, item.position.y, item.position.z)
            scene.add( figure );
        })
        animate();
    });
    
    animate();
}


 export default draw;