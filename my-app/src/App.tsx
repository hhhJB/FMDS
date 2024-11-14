import React, { Component } from 'react';
import axios from 'axios';
import { CloseOutlined, DeleteOutlined, DownloadOutlined, ImportOutlined, InfoCircleOutlined, PlusOutlined, SaveOutlined, StarOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Drawer, Input, message, Modal, notification, Select, Upload } from 'antd'
import { DefaultOptionType } from 'antd/lib/select'
import { RcFile } from 'antd/lib/upload'
import { FilterFunc } from 'rc-select/lib/Select'
import { RelationChart } from './components/RelationChart'
import { FreeKeyObject } from './FreeKeyObject'
import './App.css'

interface Node {
    id: number;
    name: string;
    tag: string;
    coef?: number;
}

interface AppState {
    nodes: Node[];
    nodeSelected: Node | null;
    relationDrawerVisible: boolean;
    recommendFriendDrawerVisible: boolean;
}

class App extends Component<{}, AppState> {

    constructor(props: any) {
        super(props)

        // 绑定引用。
        // this.chartRef = React.createRef()

        // 首先弹出一个使用说明。
        Modal.info({
            title: '欢迎体验社会关系网络演示',
            okText: '好的',
            closable: true,
            maskClosable: true,
            centered: true,
            content: <div>
                作者：王境博 唐梓淞 李和沛<br />
                Data Structure Project design<br />
                <br />
                使用前，请认真阅读以下内容：<br />
                巴拉巴拉<br />
                <br />
                本页内容及样例数据仅供技术试验，与实际人物与组织无关，请勿对号入座。
            </div>,
            icon: <InfoCircleOutlined style={{ color: '#20a162' }} />
        })

        // 注册成员函数。
        this.fetchNodes = this.fetchNodes.bind(this)
    }

    state = {
        nodes: [] as Node[],  // 存储节点数据
        nodeSelected: null,  // 当前选中的节点
        relationDrawerVisible: false,  // 控制关系面板的显示
        recommendFriendDrawerVisible: false,  // 控制推荐面板的显示
    };

    componentDidMount() {
        console.log(this.fetchNodes);
        this.fetchNodes();  // 加载节点数据
    }

    // 获取所有节点数据
    public fetchNodes = () => {
        axios.get('http://localhost:5000/api/nodes')
            .then(response => {
                this.setState({ nodes: response.data });
            })
            .catch(error => {
                message.error("获取节点数据失败！");
                console.error("获取节点数据时出错：", error);
            });
    };

    // 显示添加组织的弹窗
    showAddOrganizationModal = () => {
        let name = '';
        let nodeTag = '';
        let coef = 1.0;

        Modal.info({
            title: '添加组织',
            centered: true,
            closable: true,
            maskClosable: true,
            okText: '添加',
            // 使用箭头函数确保 `this` 指向当前的 `App` 实例
            onOk: () => {
                console.log('this in onOk:', this);
                if (name.trim().length === 0) {
                    message.warning('名称为空，未保存。');
                } else if (nodeTag === '') {
                    message.warning('没有选择分类，未保存。');
                } else {
                    // 发送 POST 请求到 Flask 后端
                    axios.post('http://localhost:5000/api/addOrganization',
                        { name, nodeTag, coef },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                        .then(() => {
                            message.success("组织添加成功！");
                            // 使用 this.fetchNodes() 直接调用 fetchNodes 方法
                            this.fetchNodes();  // 重新加载节点数据
                        })
                        .catch(error => {
                            message.error("添加组织失败！");
                            console.error("添加组织时出错：", error);
                        });
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
    };

    // 删除节点
    removeNode = (nodeId: number) => {
        axios.delete(`http://localhost:5000/api/removeNode/${nodeId}`)  // 修正模板字符串
            .then(() => {
                message.success("节点删除成功！");
                this.fetchNodes();  // 重新加载节点数据
            })
            .catch(error => {
                message.error("删除节点失败！");
                console.error("删除节点时出错：", error);
            });
    };

    render() {
        return (
            <div>
                <Button onClick={this.showAddOrganizationModal}>添加组织</Button>
                <ul>
                    {this.state.nodes.map(node => (
                        <li key={node.id}>
                            {node.name} - {node.tag} - {node.coef}
                            <Button onClick={() => this.removeNode(node.id)} type="link">删除</Button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default App;