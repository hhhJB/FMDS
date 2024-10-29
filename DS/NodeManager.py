from typing import List, Dict, Optional
from BaseNode import NodeBase, NodeTag
from PersonNode import PersonNode
from GroupNode import GroupNode


class NodeManager:
    def __init__(self):
        self.next_id = 1
        self.nodes: List[NodeBase] = []

    def insert(self, node: NodeBase):

        node.id = self.next_id
        self.next_id += 1
        self.nodes.append(node)

    def remove(self, node: NodeBase):

        for idx in range(len(self.nodes)):
            if self.nodes[idx] == node:
                # 解除组织和好友关系
                for relation_node in node.relations:
                    relation_node.remove_relation(node, False)

                self.nodes.pop(idx)
                break

    def get_node_by_id(self, node_id: int) -> Optional[NodeBase]:

        for node in self.nodes:
            if node.id == node_id:
                return node
        return None

    def to_jsonable_object(self) -> Dict:

        res = {
            "nextId": self.next_id,
            "nodes": [node.to_jsonable_object() for node in self.nodes]
        }
        return res

    def to_string(self) -> str:

        import json
        return json.dumps(self.to_jsonable_object())

    def import_data(self, data: str):

        import json
        obj = json.loads(data)
        self.next_id = obj["nextId"]
        self.nodes.clear()

        id_map: Dict[int, NodeBase] = {}

        for node in obj["nodes"]:
            if node["tag"] == NodeTag.PERSON:
                new_node = PersonNode(node["name"], node["gender"], node["id"])
                id_map[node["id"]] = new_node
                self.nodes.append(new_node)
            else:
                new_node = GroupNode(node["name"], NodeTag(node["tag"]), node["coef"], node["id"])
                id_map[node["id"]] = new_node
                self.nodes.append(new_node)

        for node in obj["nodes"]:
            id_list = node["relations"]
            target_node = id_map[node["id"]]
            target_node.relations = [id_map[it] for it in id_list if it in id_map]
