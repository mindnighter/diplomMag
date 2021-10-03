import * as THREE from 'three';

const cube = (item) => {
    const geometry = new THREE[item.geometry](item.size.a, item.size.b, item.size.c);
    return geometry;
};

export default cube;