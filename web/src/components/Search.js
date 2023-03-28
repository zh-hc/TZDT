import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/search?keyword=${keyword}`);
      setResults(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <button onClick={handleSearch}>搜索</button>
      {results.map((result, index) => (
        <div key={index}>
          <div>{result.question}</div>
          <div>{result.answer}</div>
        </div>
      ))}
    </div>
  );
}

export default App;
