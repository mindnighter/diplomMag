import axios from 'axios';

const clone = (name, data, nameList) => {
  if (/\S/.test(name)) {
    if (nameList.find((item) => item === name)) {
      alert('That name already exists, type another!');
    } else {
      alert('cloned');

      axios.post('http://localhost:3001/',{name: name, node: data},{headers:{name: name, node: data}},).then(function (response) {
        console.log(response);
      });
    }
    //setTimeout(()=>window.location.reload(),100)
  }
};

export default clone;
