# node.py

from typing import List, Dict

class NodeTag:
    "枚举类 模仿原文件"
    NUL = 'nul'
    PERSON = 'person'
    PRIMARY_SCHOOL = 'primary school'
    JUNIOR_HIGH = 'junior high'
    SENIOR_HIGH = 'senior high'
    UNIVERSITY = 'university'
    GROUP = 'group'

class NodeBase:
    def __init__(self, name: str, tag: str = NodeTag.NUL, node_id: int = -1):
        self.name = name
        self.tag = tag
        self.id = node_id
        self.relations: List['NodeBase'] = []

    def to_jsonable_object(self) -> Dict:

        return {
            "name": self.name,
            "tag": self.tag,
            "id": self.id,
            "relations": [node.id for node in self.relations]
        }

    def add_relation(self, node: 'NodeBase', both_side: bool = True):

        if node not in self.relations:
            self.relations.append(node)
            if both_side:
                node.add_relation(self, both_side=False)
    def remove_relation(self, node: 'NodeBase', both_side: bool = True):

        if node in self.relations:
            self.relations.remove(node)
            if both_side:
                node.remove_relation(self, both_side=False)
