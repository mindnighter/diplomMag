import './Code.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Code = ({data, index, draw}) => {
    const [parsedData, setData] = useState(data && JSON.stringify(data[+index].node, null, ' '));

    useEffect(() => {
        setData(data && JSON.stringify(data[+index].node, null, ' '))
      }, [data, index]);

    const handleChange = (e) => {
        setData(e.target.value)
    }

    const save = () => {
        axios.post('http://localhost:3001/save',{name: data[+index].name, node: JSON.parse(parsedData)}).then(function (response) {
            console.log(response);
        });
        data[index] = {name: data[+index].name, node: JSON.parse(parsedData)};
        //console.log(data)
        draw(data, false)
        //setTimeout(()=>window.location.reload(),100)
    }

    return(
        <div className="area">
            <textarea value={parsedData} onChange={handleChange}  id="code"></textarea>
            <button className="save" onClick={save}>Зберегти</button>
        </div>
    )
}

export default Code;