import SpriteText from 'three-spritetext';

export const textArr = {};

const add = (str, i) => {
  textArr[i] = str;
}

const text = (boundingNumber, scene, item, i, show) => {
  let sprite = new SpriteText(
    `width:${(Math.abs(boundingNumber.min.x) + Math.abs(boundingNumber.max.x)).toFixed(2)} heigth:${
      (Math.abs(boundingNumber.min.y) + Math.abs(boundingNumber.max.y)).toFixed(2)
    } depth:${(Math.abs(boundingNumber.min.z) + Math.abs(boundingNumber.max.z)).toFixed(2)}`,
    10,
    '#00ff00'
  );
  sprite.textHeight = 10;
  sprite.position.x = item.position.x;
  sprite.position.y = item.position.y;
  sprite.position.z = boundingNumber.max.z + 100 + item.position.z;
  if(show){scene.add(sprite)};

  add(`${i}: \n 
  width:${(Math.abs(boundingNumber.min.x) + Math.abs(boundingNumber.max.x)).toFixed(2)} \n
  heigth:${(Math.abs(boundingNumber.min.y) + Math.abs(boundingNumber.max.y)).toFixed(2)} \n
  depth:${(Math.abs(boundingNumber.min.z) + Math.abs(boundingNumber.max.z)).toFixed(2)} \n \n`, i)
};

export default text;
