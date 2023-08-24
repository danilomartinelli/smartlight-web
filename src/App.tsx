import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

interface IData {
  time: number;
  LDRValue: number;
  light: boolean;
  light2: boolean;
  timestamp: number;
}

const App: React.FC = () => {
  const [data, setData] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get('https://smartlight-api.onrender.com/data', {
        params: {
          limit: 10
        }
      });
      setData(response.data);
      setLoading(false);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Dados da API:</h1>
      {loading && !error && <p>Carregando...</p>}
      {error && <p>{error}</p>}
      {
        !loading && !error && data.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>time</th>
                <th>LDRValue</th>
                <th>light</th>
                <th>light2</th>
                <th>timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.time}</td>
                  <td>{item.LDRValue}</td>
                  <td>{item.light ? 'true' : 'false'}</td>
                  <td>{item.light2 ? 'true' : 'false'}</td>
                  <td>{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </div>
  );
}

export default App;
