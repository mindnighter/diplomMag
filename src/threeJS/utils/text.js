import SpriteText from 'three-spritetext';

const text = (boundingNumber, scene, item) => {
  let sprite = new SpriteText(
    `x:${Math.abs(boundingNumber.min.x) + Math.abs(boundingNumber.max.x)} y:${
      Math.abs(boundingNumber.min.y) + Math.abs(boundingNumber.max.y)
    } z:${Math.abs(boundingNumber.min.z) + Math.abs(boundingNumber.max.z)}`,
    10,
    '#00ff00'
  );
  sprite.textHeight = 0.5;
  sprite.position.x = boundingNumber.max.x + item.position.x;
  sprite.position.y = boundingNumber.max.y + item.position.y;
  sprite.position.z = boundingNumber.max.z + item.position.z;
  scene.add(sprite);
};

export default text;
