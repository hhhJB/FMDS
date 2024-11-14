import React, { CSSProperties } from 'react';
import * as echarts from 'echarts';
import axios from 'axios'; // 引入 Axios
import { NodeBase ,NodeTag} from '../NodeBase'



export interface RelationChartProps {
    style?: CSSProperties;
}

export class RelationChart extends React.Component<RelationChartProps> {
    private selfRef: React.RefObject<HTMLDivElement>;
    private chart!: echarts.ECharts;

    constructor(props: any) {
        super(props);
        this.selfRef = React.createRef();
        this.showGlobalRelationGraph = this.showGlobalRelationGraph.bind(this);
    }

    override render() {
        return <div ref={this.selfRef} style={this.props.style} />;
    }

    override async componentDidMount() {
        this.chart = echarts.init(this.selfRef.current!);
        await this.fetchNodes(); // 获取节点数据
    }

    async fetchNodes() {
        try {
            // 向后端请求数据
            const response = await axios.get('/api/nodes');
            const nodes: NodeBase[] = response.data;  // 确保数据符合 NodeBase 的结构
            this.showGlobalRelationGraph(nodes); // 展示关系图
        } catch (error) {
            console.error('Error fetching nodes:', error);
        }
    }

    private nodeTagToHumanReadableString(tag: NodeTag): string {
        switch (tag) {
            case NodeTag.GROUP:
                return '群组';
            case NodeTag.PERSON:
                return '个人';
            case NodeTag.NUL:
                return '未知';
            case NodeTag.PRIMARY_SCHOOL:
                return '小学';
            case NodeTag.JUNIOR_HIGH:
                return '初中';
            case NodeTag.SENIOR_HIGH:
                return '高中';
            case NodeTag.UNIVERSITY:
                return '大学';
            default:
                return '未知';
        }
    }

    showGlobalRelationGraph(nodes: NodeBase[]) {
        this.setState({
            visibility: 'visible',
        });

        // 生成图表参数。
        let data: Array<{ [key: string]: any }> = [];
        let links: Array<{ [key: string]: any }> = [];
        let chartIdMap = new Map<NodeBase, number>();
        let nodeCount = 0;

        // 添加点。
        nodes.forEach(node => {
            chartIdMap.set(node, nodeCount++);
            data.push({
                name: nodeCount - 1,
                value: node.name,
                id: nodeCount - 1,
                category: this.nodeTagToHumanReadableString(node.tag),
                draggable: true,
            });
        });

        // 添加关联关系。
        nodes.forEach(first => {
            let firstChartId = chartIdMap.get(first);
            first.relations.forEach(second => {
                if (first.id < second.id) {
                    links.push({
                        source: firstChartId,
                        target: chartIdMap.get(second),
                    });
                }
            });
        });

        this.chart.clear();
        this.chart.setOption({
            title: {
                text: '全局关系图',
                top: 'bottom',
                left: 'right',
            },
            tooltip: {
                trigger: 'item',
                formatter: '{c}',
            },
            legend: {
                left: 'center',
                show: true,
            },
            series: [{
                type: 'graph',
                layout: 'force',
                symbolSize: 45,
                focusNodeAdjacency: true,
                roam: true,
                categories: [
                    {
                        name: this.nodeTagToHumanReadableString(NodeTag.PERSON),
                        itemStyle: {
                            color: "#894276",
                        },
                    },
                    {
                        name: this.nodeTagToHumanReadableString(NodeTag.GROUP),
                        itemStyle: {
                            color: "#66a9c9",
                        },
                    },
                    // 其他类别
                ],
                force: {
                    repulsion: 1400,
                },
                data: data,
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}',
                },
                links: links,
                lineStyle: {
                    opacity: 0.9,
                    width: 1,
                    curveness: 0,
                },
            }],
        });
    }


    /**
     * 展示单人社交网络图。
     */
    showPersonRelationGraph(node: NodeBase = new NodeBase('')) {
        this.setState({
            visibility: 'visible'
        });

        // 生成图表参数。
        let data: Array<{ [key: string]: any }> = [];
        let links: Array<{ [key: string]: any }> = [];
        let chartIdMap = new Map<NodeBase, number>();
        let nodeCount = 0;

        // 中心点。
        chartIdMap.set(node, nodeCount++);
        data.push({
            name: 0,
            id: 0,
            value: node.name,
            category: '中心',
            draggable: true,
        });

        let firstClassRelationList = new Array<NodeBase>();

        // 一级关系。
        node.relations.forEach(next => {
            data.push({
                name: nodeCount,
                id: nodeCount,
                value: next.name,
                category: next.tag === NodeTag.PERSON ? '一级好友' : '一级组织',
                draggable: true
            });

            chartIdMap.set(next, nodeCount++);
            links.push({
                source: 0,
                target: nodeCount - 1
            });

            firstClassRelationList.push(next);
        });

        // 二级关系。
        firstClassRelationList.forEach(firstClassNode => {
            let firstNodeChartId = chartIdMap.get(firstClassNode);
            firstClassNode.relations.forEach(secondClassNode => {
                if (!chartIdMap.has(secondClassNode)) {
                    chartIdMap.set(secondClassNode, nodeCount++);

                    data.push({
                        id: nodeCount - 1,
                        name: nodeCount - 1,
                        value: secondClassNode.name,
                        category: secondClassNode.tag === NodeTag.PERSON ?
                            '二级好友' : '二级组织',
                        draggable: true
                    });

                    links.push({
                        source: firstNodeChartId,
                        target: nodeCount - 1
                    });
                }
            });
        });

        this.chart.clear();
        this.chart.setOption({
            // 标题。
            title: {
                text: node.name + '的关系放射',
                top: 'bottom',
                left: 'right'
            },

            // 鼠标覆盖显示内容。
            tooltip: {
                trigger: 'item',
                formatter: '{c}'
            },

            legend: {
                left: 'center',
                show: true
            },

            series: [{
                type: 'graph',
                layout: 'force',
                symbolSize: 45,
                focusNodeAdjacency: true,
                roam: true,

                // 配色表。
                categories: [
                    {
                        name: '中心',
                        itemStyle: {
                            color: "#c21f30",
                        }
                    },
                    {
                        name: '一级组织',
                        itemStyle: {
                            color: "#2f90b9",
                        }
                    },
                    {
                        name: '二级组织',
                        itemStyle: {
                            color: "#9a8878",
                        }
                    },
                    {
                        name: '一级好友',
                        itemStyle: {
                            color: "#813c85",
                        }
                    },
                    {
                        name: '二级好友',
                        itemStyle: {
                            color: "#bacf65",
                        }
                    }
                ],
                force: {
                    repulsion: 1400
                },
                data: data,
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}'
                },
                links: links,
                lineStyle: {
                    opacity: 0.9,
                    width: 1,
                    curveness: 0
                }
            }]
        });
    }
}
