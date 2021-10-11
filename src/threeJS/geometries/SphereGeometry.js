import * as THREE from 'three';

const SphereGeometry = (item) => {
  const geometry = new THREE[item.geometry](
    item.size.a,
    item.size.b,
    item.size.c
  );
  return geometry;
};

export default SphereGeometry;
