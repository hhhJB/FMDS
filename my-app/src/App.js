import React, { Component } from 'react';
import axios from 'axios';
import { Input, Modal, message, Select } from 'antd';

class App extends Component {
  state = {
    nodes: [],  // 存储节点数据
    nodeSelected: null,  // 当前选中的节点
    relationDrawerVisible: false,  // 控制关系面板的显示
    recommendFriendDrawerVisible: false,  // 控制推荐面板的显示
  };

  // 获取节点数据
  fetchNodes() {
    axios.get('http://localhost:5000/api/nodes')  // 请求获取所有节点
      .then(response => {
        this.setState({ nodes: response.data })  // 更新组件状态
      })
      .catch(error => {
        console.error("获取节点数据时出错！", error)
      })
  }

  // 显示添加组织的弹窗
  showAddOrganizationModal() {
    let name = '';
    let nodeTag = '';
    let coef = 1.0;

    Modal.info({
      title: '添加组织',
      centered: true,
      closable: true,
      maskClosable: true,
      okText: '添加',
      onOk: () => {
        if (name.trim().length === 0) {
          message.warn('名称为空，未保存。');
        } else if (nodeTag === '') {
          message.warn('没有选择分类，未保存。');
        } else {
          // 发送 POST 请求到 Flask 后端
          axios.post('http://localhost:5000/api/addOrganization', { name, nodeTag, coef })
            .then(() => {
              this.fetchNodes();  // 刷新节点数据
            })
            .catch(error => {
              message.error('添加组织失败。');
            })
        }
      },
      content: (
        <div>
          <Input placeholder="名称" onChange={e => name = e.target.value} />
          <Input placeholder="关系系数（默认为 1）" type="number" onChange={e => coef = parseFloat(e.target.value)} />
          <Select placeholder="选择分类" onChange={value => nodeTag = value}>
            <Select.Option value="PRIMARY_SCHOOL">小学</Select.Option>
            <Select.Option value="JUNIOR_HIGH">初中</Select.Option>
            <Select.Option value="SENIOR_HIGH">高中</Select.Option>
            <Select.Option value="UNIVERSITY">大学</Select.Option>
            <Select.Option value="GROUP">团体</Select.Option>
          </Select>
        </div>
      ),
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.showAddOrganizationModal}>添加组织</button>
        <ul>
          {this.state.nodes.map(node => (
            <li key={node.id}>{node.name} - {node.tag} - {node.coef}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
