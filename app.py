from flask import Flask, jsonify
from DS.BaseNode import NodeTag 

app = Flask(__name__)

# 模拟节点数据 只是个测试
nodes = [
    {"id": 1, "name": "Alice", "tag": NodeTag.PERSON, "relations": [2, 3]},
    {"id": 2, "name": "Bob", "tag": NodeTag.PERSON, "relations": [1]},
    {"id": 3, "name": "SCUT", "tag": NodeTag.UNIVERSITY, "relations": [1]},
]

@app.route('/api/nodes', methods=['GET'])
def get_nodes():
    return jsonify(nodes)



if __name__ == '__main__':
    app.run(debug=True)
