import { useEffect, useState } from 'react';
import draw from './threeJS';
import axios from 'axios';

import Code from './Code/Code';
import './App.css';

sessionStorage.setItem('index', 0);

const App = () => {
  const [data, setData] = useState();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3001/').then(function (response) {
      if (!data) {
        setData(response.data.result);
      } else draw(data);
    });
  }, [data]);

  setInterval(()=>setIndex(sessionStorage.getItem('index')), 50)

  return <div className="App">
    <Code data={data} draw={draw} index={index}/>
    <div id="scene"></div>
  </div>;
};

export default App;
