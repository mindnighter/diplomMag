import * as THREE from 'three';

const CylinderGeometry = (item) => {
    const geometry = new THREE[item.geometry](
        item.size.a,
        item.size.b,
        item.size.c,
        item.size.d,
    );
    return geometry;
};

export default CylinderGeometry;
