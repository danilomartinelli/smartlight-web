import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Definindo os tipos de dados

interface IData {
  time: number;
  LDRValue: number;
  light: boolean;
  light2: boolean;
}

const App: React.FC = () => {
  const [data, setData] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get('https://smartlight-api.onrender.com/data');

      // Ordena os registros pelo atributo time
      const sortedData = response.data.sort((a: IData, b: IData) => b.time - a.time);

      // Pega os últimos 10 registros
      const lastTenRecords = sortedData.slice(0, 10);

      setData(lastTenRecords);
      setLoading(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(); // Fazendo a chamada inicial
    const interval = setInterval(fetchData, 5000); // Fazendo a chamada a cada 5 segundos

    return () => clearInterval(interval); // Limpar o intervalo quando o componente for desmontado
  }, []);

  return (
    <div>
      <h1>Dados da API:</h1>
      <button onClick={fetchData}>Refresh</button>
      {loading ? <div>Carregando...</div> :
        error ? <div>Erro: {error}</div> :
          <ul>
            {data.map((item, index) => (
              <li key={index}>
                <p>Tempo: {item.time}</p>
                <p>Valor LDR: {item.LDRValue}</p>
                <p>Luz: {item.light ? 'Ligada' : 'Desligada'}</p>
                <p>Luz 2: {item.light2 ? 'Ligada' : 'Desligada'}</p>
              </li>
            ))}
          </ul>}
    </div>
  );
}

export default App;
