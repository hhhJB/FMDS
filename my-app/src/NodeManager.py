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
                # 解除组织和好友关�?
                for relation_node in node.relations:
                    relation_node.remove_relation(node, False)

                self.nodes.pop(idx)
                break

    def getId_by_node(self,node:NodeBase) -> int:
        for node in self.nodes:
            if node == node:
                return node.id
        return -1

    def get_node_by_id(self, node_id: int) -> Optional[NodeBase]:

        for node in self.nodes:
            if node.id == node_id:
                return node
        return None
    
    def get_node_by_name(self, node_name:str) -> Optional[NodeBase]:

        for node in self.nodes:
            if node.name == node_name:
                return node
        return None
    
    def getSameGroupList(self, node1:PersonNode,node2:PersonNode) -> List[NodeBase]:
        res:List[NodeBase] = []
        for node in node1.relations:
            if (node.tag != NodeTag.NUL and node.tag != NodeTag.PERSON) and node in node2.relations:#是群组且在两个人关系组中
                res.append(node)
        return res
    
    def getTwoPersonPath(self,startNode:PersonNode,endNode:PersonNode,nowNode:PersonNode,GroupList:List[NodeBase],path=None) -> List[List[NodeBase]] :
        if path is None:
            path = []

        path = path + [nowNode]
        if nowNode == endNode:
            return [path]

        paths = [] #存储所有路径的列表
        for nei in nowNode.relations:
            if (nei.tag == NodeTag.PERSON) and all(item not in GroupList for item in nei.relations) and nei not in path: #满足条件：是person、不在共用群组、不重复path�?
                newPaths = self.getTwoPersonPath(startNode,endNode,nei,GroupList,path)
                for newPath in newPaths:
                    paths.append(newPath)
        return paths
    
    def findShortestPath(self,startNode:PersonNode,endNode:PersonNode,nowNode:PersonNode) -> List[NodeBase]:
        GroupList = self.getSameGroupList(startNode,endNode)
        paths = self.getTwoPersonPath(startNode,endNode,startNode,GroupList)
        if not paths:
            return []
        shortest_path = min(paths, key=len)
        return shortest_path

    
    def calculateTwoPersonIntimacy(self,node1:PersonNode,node2:PersonNode) -> float:
        #计算1：共同群组权值之�?
        GroupList = self.getSameGroupList(node1,node2)
        sum_coefficient = 0.0
        for group in GroupList:
            sum_coefficient += group.relation_coefficient
        
        #计算2:2个人的可达成路径权值之�?
        sum_relation_coefficient = 0.0
        TwoPersonPath = self.getTwoPersonPath(node1,node2,GroupList)

        for path in TwoPersonPath:
            sum_relation_coefficient += 5 - len(path) + 2
        
        return sum_coefficient + sum_relation_coefficient

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
