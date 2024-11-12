from flask import Flask, jsonify, request
from typing import List
from NodeManager import NodeManager
from GroupNode import GroupNode
from BaseNode import NodeBase, NodeTag
app = Flask(__name__)  # ���� Flask Ӧ��ʵ��

# ���� NodeManager ʵ��
node_manager = NodeManager()

# ·�ɣ���ȡ���нڵ�����
@app.route('/api/nodes', methods=['GET'])
def get_nodes():
    # ��ȡ���нڵ㲢ת��Ϊ JSON �����л��ĸ�ʽ
    return jsonify([node.to_jsonable_object() for node in node_manager.nodes])

# ·�ɣ����һ���µ���֯�ڵ�
@app.route('/api/addOrganization', methods=['POST'])
def add_organization():
    data = request.json  # ��ȡǰ�˴����� JSON ����
    name = data.get('name')
    node_tag = data.get('nodeTag')
    coef = data.get('coef', 1.0)  # Ĭ��Ϊ 1.0

    if not name or not node_tag:
        return jsonify({"message": "���ƻ���಻��Ϊ��"}), 400
    
    # �����µ���֯�ڵ㲢ʹ�� NodeManager ���
    new_organization = GroupNode(name=name, tag=node_tag, coefficient=coef)
    node_manager.insert(new_organization)  # ���� NodeManager �� insert ����

    return jsonify({"message": "��֯��ӳɹ�"}), 200

# ·�ɣ����� ID ��ȡĳ���ڵ�
@app.route('/api/nodes/<int:node_id>', methods=['GET'])
def get_node_by_id(node_id):
    node = node_manager.get_node_by_id(node_id)
    if node:
        return jsonify(node.to_jsonable_object())
    else:
        return jsonify({"message": "�ڵ㲻����"}), 404

# ·�ɣ��Ƴ�ĳ���ڵ�
@app.route('/api/removeNode/<int:node_id>', methods=['DELETE'])
def remove_node(node_id):
    node = node_manager.get_node_by_id(node_id)
    if node:
        node_manager.remove(node)  # ���� NodeManager �� remove ����
        return jsonify({"message": "�ڵ���ɾ��"})
    else:
        return jsonify({"message": "�ڵ㲻����"}), 404

if __name__ == '__main__':
    app.run(debug=True)
