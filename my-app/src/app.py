from flask import Flask, jsonify, request
from typing import List
from NodeManager import NodeManager
from GroupNode import GroupNode
from BaseNode import NodeBase, NodeTag
app = Flask(__name__)  # 创建 Flask 应用实例

# 创建 NodeManager 实例
node_manager = NodeManager()

# 路由：获取所有节点数据
@app.route('/api/nodes', methods=['GET'])
def get_nodes():
    # 获取所有节点并转换为 JSON 可序列化的格式
    return jsonify([node.to_jsonable_object() for node in node_manager.nodes])

# 路由：添加一个新的组织节点
@app.route('/api/addOrganization', methods=['POST'])
def add_organization():
    data = request.json  # 获取前端传来的 JSON 数据
    name = data.get('name')
    node_tag = data.get('nodeTag')
    coef = data.get('coef', 1.0)  # 默认为 1.0

    if not name or not node_tag:
        return jsonify({"message": "名称或分类不能为空"}), 400
    
    # 创建新的组织节点并使用 NodeManager 添加
    new_organization = GroupNode(name=name, tag=node_tag, coefficient=coef)
    node_manager.insert(new_organization)  # 调用 NodeManager 的 insert 方法

    return jsonify({"message": "组织添加成功"}), 200

# 路由：根据 ID 获取某个节点
@app.route('/api/nodes/<int:node_id>', methods=['GET'])
def get_node_by_id(node_id):
    node = node_manager.get_node_by_id(node_id)
    if node:
        return jsonify(node.to_jsonable_object())
    else:
        return jsonify({"message": "节点不存在"}), 404

# 路由：移除某个节点
@app.route('/api/removeNode/<int:node_id>', methods=['DELETE'])
def remove_node(node_id):
    node = node_manager.get_node_by_id(node_id)
    if node:
        node_manager.remove(node)  # 调用 NodeManager 的 remove 方法
        return jsonify({"message": "节点已删除"})
    else:
        return jsonify({"message": "节点不存在"}), 404

if __name__ == '__main__':
    app.run(debug=True)