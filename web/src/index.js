import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/reset.css';
import { Input, List, message } from 'antd';
import axios from 'axios';

// 本地运行
const API_URL = 'http://localhost:3001';

function App() {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState([]);
  const [searching, setSearching] = useState(false);
  const [fetching, setFetching] = useState(false);

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearch = () => {
    if (keyword === '') {
      fetchRandomData();
      return;
    }

    if (searching) {
      message.warning('5s内仅允许进行一次搜索');
      return;
    }

    setSearching(true);

    axios
      .get(`${API_URL}/search?keyword=${keyword}`)
      .then((res) => {
        setData(res.data);
        if (res.data.length > 9) {
          message.warning('当前结果过多，可以增加搜索字数，以缩小范围');
        } else if (res.data.length === 0) {
          message.warning('没有搜索到相关信息');
        }
      })
      .catch((err) => console.error(err.message))
      .finally(() => {
        setKeyword('');
        setTimeout(() => setSearching(false), 5000);
      });
  };

  const fetchRandomData = () => {
    if (fetching) {
      message.warning('5s内仅允许进行一次搜索');
      return;
    }

    setFetching(true);

    axios
      .get(`${API_URL}/random`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err.message))
      .finally(() => setTimeout(() => setFetching(false), 5000));
  };

  const highlightKeywords = (text) => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Input.Search
        placeholder="请输入关键词"
        enterButton={keyword ? '搜索' : '随机学习'}
        size="large"
        value={keyword}
        onChange={handleInputChange}
        onSearch={handleSearch}
      />
      <List
        style={{ marginTop: '24px' }}
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <div
                  dangerouslySetInnerHTML={{
                    __html: highlightKeywords(item.question),
                  }}
                />
              }
              description={
                <div
                  style={{ color: 'blue', fontWeight: 'bold' }}
                  dangerouslySetInnerHTML={{
                    __html: `答案：${highlightKeywords(item.answer)}`,
                  }}
                />
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));