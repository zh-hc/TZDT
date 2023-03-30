import React, { useState, useEffect, useRef } from 'react'; // 引入useEffect和useRef
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
  const [highlightedData, setHighlightedData] = useState([]); // 新增highlightedData用于存储加粗标红后的数据
  const prevKeywordRef = useRef(''); // 新增prevKeywordRef用于存储上一次搜索关键词

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
        const highlightedData = res.data.map((item) => ({ // 对搜索结果进行加粗标红处理
          question: highlightKeywords(item.question),
          answer: highlightKeywords(item.answer),
        }));
        setHighlightedData(highlightedData);
        if (res.data.length > 9) {
          message.warning('当前结果过多，可以增加搜索字数，以缩小范围');
        } else if (res.data.length === 0) {
          message.warning('没有搜索到相关信息');
        }
      })
      .catch((err) => console.error(err.message))
      .finally(() => {
        prevKeywordRef.current = keyword;
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
      .then((res) => {
        const highlightedData = res.data.map((item) => ({ // 对搜索结果进行加粗标红处理
          question: highlightKeywords(item.question),
          answer: highlightKeywords(item.answer),
        }));
        setHighlightedData(highlightedData);
        setData(res.data);
      })
      .catch((err) => console.error(err.message))
      .finally(() => setTimeout(() => setFetching(false), 5000));
  };

  const highlightKeywords = (text) => {
    const regex = new RegExp(`(${prevKeywordRef.current || keyword})`, 'gi'); // 修改正则表达式，优先使用上一次搜索关键词进行加粗标红
    return text.replace(regex, '<strong style="color:red">$1</strong>'); // 修改加粗标红样式
  };

  useEffect(() => { // 在每次渲染之后更新prevKeywordRef.current
    prevKeywordRef.current = keyword;
  });

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
        dataSource={highlightedData} // 使用highlightedData替代data
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <div dangerouslySetInnerHTML={{ __html: item.question }} />
              }
              description={
                <div style={{ color: 'blue', fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: `答案：${item.answer}` }} />
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));