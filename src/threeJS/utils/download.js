import {textArr} from './text.js'

const generate = () => {
    let txt = '';
    for (var variableKey in textArr){
        if (textArr.hasOwnProperty(variableKey)){
            txt += textArr[variableKey];
        }
      }
      return txt;
}

function download(filename) {
    
    const text = generate();
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

  export default download;