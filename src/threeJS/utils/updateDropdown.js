function updateDatDropdown(target, list) {
  let innerHTMLStr = '';
  if (list.constructor.name === 'Array') {
    for (let i = 0; i < list.length; i++) {
      let str = "<option value='" + list[i] + "'>" + list[i] + '</option>';
      innerHTMLStr += str;
    }
  }

  if (list.constructor.name === 'Object') {
    for (let key in list) {
      let str = "<option value='" + list[key] + "'>" + key + '</option>';
      innerHTMLStr += str;
    }
  }
  if (innerHTMLStr !== '')
    target.domElement.children[0].innerHTML = innerHTMLStr;
}

export default updateDatDropdown;
