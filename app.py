from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/nodes', methods=['GET'])
def get_nodes():
    # 模拟节点数据
    nodes = [
        {"id": 1, "name": "Alice", "tag": "PERSON", "relations": [2, 3]},
        {"id": 2, "name": "Bob", "tag": "PERSON", "relations": [1]},
        {"id": 3, "name": "Charlie", "tag": "GROUP", "relations": [1]},

    ]
    return jsonify(nodes)

if __name__ == '__main__':
    app.run(debug=True)
