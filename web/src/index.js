import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/reset.css';
import { Input, List, message } from 'antd';
import axios from 'axios';

class App extends React.Component {
  state = {
    keyword: '',
    data: [],
    searching: false,
  };

  handleInputChange = (e) => {
    this.setState({ keyword: e.target.value });
  };

  handleSearch = () => {
    if (!this.state.keyword) {
      message.warning('请先输入搜索关键词');
      return;
    }
    if (this.state.searching) {
      message.warning('5s内仅允许进行一次搜索');
      return;
    }
    this.setState({ searching: true });
    axios
      .get(`http://localhost:3001/search?keyword=${this.state.keyword}`)
      .then((res) => {
        this.setState({ data: res.data });
        if (res.data.length > 5) {
          message.warning('请增加搜索字数，以缩小范围');
        } else if (res.data.length === 0) {
          message.warning('请重试或缩减搜索字数');
        }
      })
      .catch((err) => {
        console.error(err.message);
      })
      .finally(() => {
        setTimeout(() => {
          this.setState({ searching: false });
        }, 5000);
      });
  };

  highlightKeywords = (text) => {
    const regex = new RegExp(`(${this.state.keyword})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  };

  render() {
    return (
      <div style={{ padding: '24px' }}>
        <Input.Search
          placeholder="请输入关键词"
          enterButton="搜索"
          size="large"
          value={this.state.keyword}
          onChange={this.handleInputChange}
          onSearch={this.handleSearch}
        />
        <List
          style={{ marginTop: '24px' }}
          bordered
          dataSource={this.state.data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.highlightKeywords(item.question),
                    }}
                  />
                }
                description={
                  <div
                    style={{ color: 'blue', fontWeight: 'bold' }}
                    dangerouslySetInnerHTML={{
                      __html: this.highlightKeywords(item.answer),
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
}

ReactDOM.render(<App />, document.getElementById('root'));
