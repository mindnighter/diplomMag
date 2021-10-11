import { useEffect, useState } from 'react';
import draw from './threeJS';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState();

  useEffect(() => {
    axios.get('http://localhost:3001/').then(function (response) {
      if (!data) {
        setData(response.data.result);
      } else draw(data);
    });
  }, [data]);

  return <div className="App"></div>;
};

export default App;
